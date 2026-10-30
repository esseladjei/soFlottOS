using System.Text.Json;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Services.Email;
using Xunit;

namespace soFlottOS.Api.Tests;

public sealed class EmailOutboxTests
{
    [Fact]
    public async Task Queue_DeduplicatesRecipientsAndPersistsOnlyOnBusinessSave()
    {
        using var database = new EmailTestDatabase();
        var queue = EmailSamples.Queue(database.Context);
        queue.Stage("welcome", new AccountCreatedEmail(EmailSamples.Order().Client.User!),
            "owner@example.com", "OWNER@example.com");
        using var other = database.NewContext();
        Assert.Empty(await other.EmailMessages.ToListAsync());
        await database.Context.SaveChangesAsync();
        var stored = Assert.Single(await other.EmailMessages.ToListAsync());
        Assert.Equal(EmailMessageStatus.Pending, stored.Status);
        Assert.Equal(32, stored.DeliveryKey.Length);
        Assert.Contains("Ihr Konto ist bereit", JsonSerializer.Deserialize<EmailContent>(stored.ContentJson)!.Text);
    }

    [Fact]
    public async Task BusinessRollback_RollsBackEmailWithAccount()
    {
        using var database = new EmailTestDatabase();
        await using (var transaction = await database.Context.Database.BeginTransactionAsync())
        {
            var user = EmailSamples.Order().Client.User!;
            user.Id = 0;
            database.Context.Users.Add(user);
            EmailSamples.Queue(database.Context).Stage("account_created", new AccountCreatedEmail(user), user.Email);
            await database.Context.SaveChangesAsync();
            await transaction.RollbackAsync();
        }
        using var other = database.NewContext();
        Assert.Empty(await other.Users.ToListAsync());
        Assert.Empty(await other.EmailMessages.ToListAsync());
    }

    [Fact]
    public async Task DisabledQueueDoesNotPersistOrRenderAndInvalidRecipientsAreExplicit()
    {
        using var database = new EmailTestDatabase();
        var options = new EmailOptions();
        EmailSamples.Queue(database.Context, options).Stage("event", new AccountCreatedEmail(null!), "invalid");
        await database.Context.SaveChangesAsync();
        Assert.Empty(await database.Context.EmailMessages.ToListAsync());
        Assert.Throws<ValidationException>(() =>
            EmailSamples.Queue(database.Context).Stage("event", new AccountCreatedEmail(EmailSamples.Order().Client.User!), "invalid"));
    }

    [Fact]
    public async Task ClaimsAreExclusiveAndExpiredLeasesCanBeRecoveredWithoutStaleWrites()
    {
        using var database = new EmailTestDatabase();
        var now = DateTimeOffset.UtcNow;
        var message = Message(now);
        database.Context.EmailMessages.Add(message);
        await database.Context.SaveChangesAsync();
        var firstRepository = new EmailRepository(database.Context);
        using var secondContext = database.NewContext();
        var secondRepository = new EmailRepository(secondContext);
        var first = await firstRepository.ClaimAsync(message.Id, now, TimeSpan.FromSeconds(30), 5, default);
        Assert.NotNull(first);
        Assert.Null(await secondRepository.ClaimAsync(message.Id, now, TimeSpan.FromSeconds(30), 5, default));
        var recovered = await secondRepository.ClaimAsync(message.Id, now.AddSeconds(31), TimeSpan.FromSeconds(30), 5, default);
        Assert.NotNull(recovered);
        Assert.Equal(2, recovered.AttemptCount);
        await firstRepository.CompleteAsync(first, "stale-id", now, default);
        await secondRepository.CompleteAsync(recovered, "provider-id", now.AddSeconds(32), default);
        var stored = await secondContext.EmailMessages.AsNoTracking().SingleAsync();
        Assert.Equal("provider-id", stored.ProviderMessageId);
        Assert.Equal(EmailMessageStatus.Sent, stored.Status);
    }

    [Fact]
    public async Task TransientFailuresBackOffAndRetryWithSameProviderKey()
    {
        using var database = new EmailTestDatabase();
        var clock = new FixedEmailClock(DateTimeOffset.UtcNow);
        database.Context.EmailMessages.Add(Message(clock.Now));
        await database.Context.SaveChangesAsync();
        var sender = new RecordingSender { Failure = new EmailDeliveryException("rate limited", true, TimeSpan.FromSeconds(120)) };
        var dispatcher = Dispatcher(database, sender, clock);
        await dispatcher.ProcessBatchAsync(default);
        var pending = await database.Context.EmailMessages.AsNoTracking().SingleAsync();
        Assert.Equal(EmailMessageStatus.Pending, pending.Status);
        Assert.Equal(clock.Now.AddSeconds(120), pending.NextAttemptAt);
        await dispatcher.ProcessBatchAsync(default);
        Assert.Single(sender.Keys);
        sender.Failure = null;
        clock.Now = pending.NextAttemptAt;
        await dispatcher.ProcessBatchAsync(default);
        var sent = await database.Context.EmailMessages.AsNoTracking().SingleAsync();
        Assert.Equal(EmailMessageStatus.Sent, sent.Status);
        Assert.Equal(2, sent.AttemptCount);
        Assert.Equal(sender.Keys[0], sender.Keys[1]);
    }

    [Theory]
    [InlineData(false, 0)]
    [InlineData(true, 4)]
    public async Task PermanentFailuresAndAttemptLimitAreTerminal(bool transient, int attempts)
    {
        using var database = new EmailTestDatabase();
        var clock = new FixedEmailClock(DateTimeOffset.UtcNow);
        var message = Message(clock.Now);
        message.AttemptCount = attempts;
        database.Context.EmailMessages.Add(message);
        await database.Context.SaveChangesAsync();
        var sender = new RecordingSender { Failure = new EmailDeliveryException("provider failure", transient) };
        await Dispatcher(database, sender, clock).ProcessBatchAsync(default);
        Assert.Equal(EmailMessageStatus.Failed, (await database.Context.EmailMessages.AsNoTracking().SingleAsync()).Status);
    }

    [Fact]
    public async Task ExpiredIdempotencyWindowAndCorruptPayloadDoNotSend()
    {
        using var database = new EmailTestDatabase();
        var clock = new FixedEmailClock(DateTimeOffset.UtcNow);
        var expired = Message(clock.Now);
        expired.FirstAttemptAt = clock.Now.AddHours(-24);
        expired.AttemptCount = 1;
        var invalid = Message(clock.Now);
        invalid.ContentJson = "bad-json";
        database.Context.EmailMessages.AddRange(expired, invalid);
        await database.Context.SaveChangesAsync();
        var sender = new RecordingSender();
        await Dispatcher(database, sender, clock).ProcessBatchAsync(default);
        Assert.Empty(sender.Keys);
        Assert.All(await database.Context.EmailMessages.AsNoTracking().ToListAsync(), message => Assert.Equal(EmailMessageStatus.Failed, message.Status));
    }

    [Fact]
    public async Task InterruptedFinalAttemptBecomesFailedRatherThanStuck()
    {
        using var database = new EmailTestDatabase();
        var now = DateTimeOffset.UtcNow;
        var message = Message(now);
        message.Status = EmailMessageStatus.Processing;
        message.AttemptCount = 5;
        message.LeaseUntil = now.AddSeconds(-1);
        database.Context.EmailMessages.Add(message);
        await database.Context.SaveChangesAsync();
        Assert.Empty(await new EmailRepository(database.Context).GetDueIdsAsync(now, 20, 5, default));
        Assert.Equal(EmailMessageStatus.Failed, (await database.Context.EmailMessages.AsNoTracking().SingleAsync()).Status);
    }

    private static EmailMessage Message(DateTimeOffset now) => new()
    {
        EventType = "test", Recipient = "customer@example.com", NextAttemptAt = now,
        ContentJson = JsonSerializer.Serialize(new EmailContent("Subject", "<p>HTML</p>", "Text", []))
    };
    private static EmailDispatcher Dispatcher(EmailTestDatabase database, IEmailSender sender, TimeProvider clock) =>
        new(new EmailRepository(database.Context), sender, EmailSamples.Options(), clock,
            NullLogger<EmailDispatcher>.Instance, new EphemeralDataProtectionProvider());
    private sealed class RecordingSender : IEmailSender
    {
        public EmailDeliveryException? Failure { get; set; }
        public List<string> Keys { get; } = [];
        public Task<string> SendAsync(EmailContent content, string recipient, string idempotencyKey, CancellationToken cancellationToken = default)
        {
            Keys.Add(idempotencyKey);
            return Failure is null ? Task.FromResult("provider-id") : Task.FromException<string>(Failure);
        }
    }
}
