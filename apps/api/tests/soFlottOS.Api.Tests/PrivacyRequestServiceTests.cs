using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Common;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services;
using soFlottOS.Api.Services.Email;
using Xunit;

namespace soFlottOS.Api.Tests;

public sealed class PrivacyRequestServiceTests
{
    private static async Task<(string EventType, string Recipient, EmailContent Content)[]> OutboxAsync(EmailTestDatabase database)
    {
        using var other = database.NewContext();
        var messages = await other.EmailMessages.OrderBy(message => message.Id).ToListAsync();
        return messages
            .Select(message => (message.EventType, message.Recipient,
                JsonSerializer.Deserialize<EmailContent>(message.ContentJson)!))
            .ToArray();
    }

    [Fact]
    public async Task Create_StoresTheRequestWithADueDateOneMonthAhead()
    {
        using var database = new EmailTestDatabase();
        var service = PrivacySamples.RequestService(database);

        var response = await service.CreateAsync(PrivacySamples.NewRequest(PrivacyRequestType.Export));

        Assert.NotEqual(Guid.Empty, response.Id);
        Assert.Equal(PrivacyRequestStatus.Received, response.Status);
        Assert.Equal(PrivacySamples.Now, response.CreatedAt);
        Assert.Equal(new DateTimeOffset(2026, 4, 10, 12, 0, 0, TimeSpan.Zero), response.DueAt);

        using var other = database.NewContext();
        var stored = await other.PrivacyRequests.SingleAsync();
        Assert.Equal(response.Id, stored.Id);
        Assert.Equal(PrivacyRequestType.Export, stored.Type);
        Assert.Equal(PrivacyRequestStatus.Received, stored.Status);
        Assert.Equal(PrivacySamples.Now, stored.UpdatedAt);
        Assert.Equal(response.DueAt, stored.DueAt);
        Assert.Null(stored.CompletedAt);
        Assert.Null(stored.HandlerNote);
    }

    [Fact]
    public async Task Create_ClampsTheDueDateToTheEndOfAShorterMonth()
    {
        using var database = new EmailTestDatabase();
        var clock = new FixedEmailClock(new DateTimeOffset(2026, 1, 31, 8, 0, 0, TimeSpan.Zero));

        var response = await PrivacySamples.RequestService(database, clock).CreateAsync(PrivacySamples.NewRequest());

        Assert.Equal(new DateTimeOffset(2026, 2, 28, 8, 0, 0, TimeSpan.Zero), response.DueAt);
    }

    [Fact]
    public async Task Create_TrimsInputAndTurnsBlankOptionalFieldsIntoNull()
    {
        using var database = new EmailTestDatabase();
        var service = PrivacySamples.RequestService(database);

        await service.CreateAsync(new CreatePrivacyRequestRequest
        {
            Type = PrivacyRequestType.Correction,
            Email = "  person@example.org  ",
            FullName = "   ",
            Message = "  Bitte korrigieren.  ",
            Locale = " EN "
        });

        var stored = await database.NewContext().PrivacyRequests.SingleAsync();
        Assert.Equal("person@example.org", stored.Email);
        Assert.Null(stored.FullName);
        Assert.Equal("Bitte korrigieren.", stored.Message);
        Assert.Equal("en", stored.Locale);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("fr")]
    [InlineData("klingon")]
    public async Task Create_UnknownLocaleFallsBackToGerman(string? locale)
    {
        using var database = new EmailTestDatabase();

        await PrivacySamples.RequestService(database).CreateAsync(PrivacySamples.NewRequest(locale: locale));

        Assert.Equal("de", (await database.NewContext().PrivacyRequests.SingleAsync()).Locale);
    }

    [Theory]
    [InlineData("not-an-email")]
    [InlineData("a@b")]
    [InlineData("")]
    [InlineData("   ")]
    public async Task Create_RejectsInvalidEmailAndStoresNothing(string email)
    {
        using var database = new EmailTestDatabase();
        var service = PrivacySamples.RequestService(database);

        var exception = await Assert.ThrowsAsync<ValidationException>(
            () => service.CreateAsync(PrivacySamples.NewRequest() with { Email = email }));

        Assert.True(exception.Errors.ContainsKey("email"));
        Assert.Empty(await database.NewContext().PrivacyRequests.ToListAsync());
        Assert.Empty(await database.NewContext().EmailMessages.ToListAsync());
    }

    [Fact]
    public async Task Create_RejectsTooLongInputAndUndefinedType()
    {
        using var database = new EmailTestDatabase();
        var service = PrivacySamples.RequestService(database);
        var longEmail = new string('a', 250) + "@example.org";

        Assert.True((await Assert.ThrowsAsync<ValidationException>(
            () => service.CreateAsync(PrivacySamples.NewRequest() with { Email = longEmail }))).Errors.ContainsKey("email"));
        Assert.True((await Assert.ThrowsAsync<ValidationException>(
            () => service.CreateAsync(PrivacySamples.NewRequest() with { FullName = new string('n', 121) }))).Errors.ContainsKey("fullName"));
        Assert.True((await Assert.ThrowsAsync<ValidationException>(
            () => service.CreateAsync(PrivacySamples.NewRequest() with { Message = new string('m', 2001) }))).Errors.ContainsKey("message"));
        Assert.True((await Assert.ThrowsAsync<ValidationException>(
            () => service.CreateAsync(PrivacySamples.NewRequest() with { Type = (PrivacyRequestType)99 }))).Errors.ContainsKey("type"));
        Assert.Empty(await database.NewContext().PrivacyRequests.ToListAsync());
    }

    [Fact]
    public async Task Create_QueuesAnAcknowledgementAndAnInternalNotificationInTheOutbox()
    {
        using var database = new EmailTestDatabase();
        var options = new PrivacyOptions { NotificationEmail = "datenschutz@example.com" };
        var service = PrivacySamples.RequestService(database, options: options);

        var response = await service.CreateAsync(PrivacySamples.NewRequest());

        var outbox = await OutboxAsync(database);
        Assert.Equal(2, outbox.Length);

        var acknowledgement = Assert.Single(outbox, message => message.EventType == "privacy_request_received");
        Assert.Equal("erika.mustermann@example.org", acknowledgement.Recipient);
        Assert.Contains(response.Id.ToString("D"), acknowledgement.Content.Text);
        Assert.Contains("10.04.2026", acknowledgement.Content.Text);
        Assert.Contains("Ihre Datenschutzanfrage ist eingegangen", acknowledgement.Content.Subject);

        var notification = Assert.Single(outbox, message => message.EventType == "privacy_request_notification");
        Assert.Equal("datenschutz@example.com", notification.Recipient);
        Assert.Contains(response.Id.ToString("D"), notification.Content.Text);
        Assert.Contains("Neue Datenschutzanfrage", notification.Content.Subject);
    }

    [Fact]
    public async Task Create_UsesTheDefaultInternalInbox()
    {
        using var database = new EmailTestDatabase();

        await PrivacySamples.RequestService(database).CreateAsync(PrivacySamples.NewRequest());

        var outbox = await OutboxAsync(database);
        Assert.Contains(outbox, message => message.Recipient == "info@soflott.de");
    }

    [Fact]
    public async Task Create_AcknowledgementFollowsTheRequestLocale()
    {
        using var database = new EmailTestDatabase();

        var response = await PrivacySamples.RequestService(database)
            .CreateAsync(PrivacySamples.NewRequest(PrivacyRequestType.Deletion, "en"));

        var acknowledgement = Assert.Single(await OutboxAsync(database), message => message.EventType == "privacy_request_received");
        Assert.Contains("We have received your privacy request", acknowledgement.Content.Subject);
        Assert.Contains("Erasure (Art. 17)", acknowledgement.Content.Text);
        Assert.Contains("10/04/2026", acknowledgement.Content.Text);
        Assert.Contains(response.Id.ToString("D"), acknowledgement.Content.Text);
        Assert.DoesNotContain("Datenschutzanfrage", acknowledgement.Content.Text);
    }

    [Fact]
    public async Task Create_EmailsNeverEchoTheFreeTextMessageOrTheName()
    {
        using var database = new EmailTestDatabase();

        await PrivacySamples.RequestService(database).CreateAsync(PrivacySamples.NewRequest());

        foreach (var (_, _, content) in await OutboxAsync(database))
        {
            foreach (var body in new[] { content.Subject, content.Text, content.Html })
            {
                Assert.DoesNotContain("geheim-Marker-4711", body);
                Assert.DoesNotContain("Erika", body);
                Assert.DoesNotContain("Mustermann", body);
            }
        }
    }

    [Fact]
    public async Task Create_InternalNotificationContainsNoRequesterAddress()
    {
        using var database = new EmailTestDatabase();

        await PrivacySamples.RequestService(database).CreateAsync(PrivacySamples.NewRequest());

        var notification = Assert.Single(await OutboxAsync(database), message => message.EventType == "privacy_request_notification");
        Assert.DoesNotContain("erika.mustermann@example.org", notification.Content.Text);
        Assert.DoesNotContain("erika.mustermann@example.org", notification.Content.Html);
    }

    [Fact]
    public async Task Create_AsksTheEmailCommunicationsOnceWithTheConfiguredInbox()
    {
        using var database = new EmailTestDatabase();
        var emails = new FakeEmailCommunications();
        var service = new PrivacyRequestService(
            new Data.Repositories.PrivacyRequestRepository(database.Context), emails,
            new PrivacyOptions { NotificationEmail = "dpo@example.com" },
            new FixedEmailClock(PrivacySamples.Now), PrivacySamples.Locale());

        var response = await service.CreateAsync(PrivacySamples.NewRequest());

        var (request, internalRecipient) = Assert.Single(emails.PrivacyRequests);
        Assert.Equal(response.Id, request.Id);
        Assert.Equal("dpo@example.com", internalRecipient);
    }

    [Fact]
    public async Task GetStatus_ReturnsOnlyReferenceStatusAndDates()
    {
        using var database = new EmailTestDatabase();
        var service = PrivacySamples.RequestService(database);
        var created = await service.CreateAsync(PrivacySamples.NewRequest(PrivacyRequestType.Restriction));

        var status = await service.GetStatusAsync(created.Id);

        Assert.Equal(created.Id, status.Id);
        Assert.Equal(PrivacyRequestType.Restriction, status.Type);
        Assert.Equal(PrivacyRequestStatus.Received, status.Status);
        Assert.Equal(created.CreatedAt, status.CreatedAt);
        Assert.Equal(created.DueAt, status.DueAt);
        Assert.Null(status.CompletedAt);

        Assert.Equal(
            ["CompletedAt", "CreatedAt", "DueAt", "Id", "Status", "Type"],
            typeof(PrivacyRequestStatusResponse).GetProperties().Select(property => property.Name).Order());
        var json = JsonSerializer.Serialize(status);
        Assert.DoesNotContain("example.org", json);
        Assert.DoesNotContain("Mustermann", json);
        Assert.DoesNotContain("Marker", json);
    }

    [Fact]
    public async Task GetStatus_UnknownIdIsNotFound()
    {
        using var database = new EmailTestDatabase();

        await Assert.ThrowsAsync<NotFoundException>(
            () => PrivacySamples.RequestService(database).GetStatusAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task UpdateStatus_CompletedAndRejectedStampCompletedAt()
    {
        using var database = new EmailTestDatabase();
        var clock = new FixedEmailClock(PrivacySamples.Now);
        var service = PrivacySamples.RequestService(database, clock);
        var completed = await service.CreateAsync(PrivacySamples.NewRequest());
        var rejected = await service.CreateAsync(PrivacySamples.NewRequest());
        clock.Now = PrivacySamples.Now.AddDays(3);

        var completedResponse = await service.UpdateStatusAsync(
            completed.Id, new UpdatePrivacyRequestStatusRequest { Status = PrivacyRequestStatus.Completed });
        var rejectedResponse = await service.UpdateStatusAsync(
            rejected.Id, new UpdatePrivacyRequestStatusRequest { Status = PrivacyRequestStatus.Rejected });

        Assert.Equal(PrivacyRequestStatus.Completed, completedResponse.Status);
        Assert.Equal(clock.Now, completedResponse.CompletedAt);
        Assert.Equal(clock.Now, completedResponse.UpdatedAt);
        Assert.Equal(PrivacyRequestStatus.Rejected, rejectedResponse.Status);
        Assert.Equal(clock.Now, rejectedResponse.CompletedAt);

        using var other = database.NewContext();
        Assert.All(await other.PrivacyRequests.ToListAsync(), request => Assert.Equal(clock.Now, request.CompletedAt));
    }

    [Fact]
    public async Task UpdateStatus_InProgressDoesNotComplete()
    {
        using var database = new EmailTestDatabase();
        var service = PrivacySamples.RequestService(database);
        var created = await service.CreateAsync(PrivacySamples.NewRequest());

        var response = await service.UpdateStatusAsync(
            created.Id, new UpdatePrivacyRequestStatusRequest { Status = PrivacyRequestStatus.InProgress });

        Assert.Equal(PrivacyRequestStatus.InProgress, response.Status);
        Assert.Null(response.CompletedAt);
    }

    [Fact]
    public async Task UpdateStatus_KeepsTheFirstCompletionTimeAndReopeningClearsIt()
    {
        using var database = new EmailTestDatabase();
        var clock = new FixedEmailClock(PrivacySamples.Now);
        var service = PrivacySamples.RequestService(database, clock);
        var created = await service.CreateAsync(PrivacySamples.NewRequest());

        clock.Now = PrivacySamples.Now.AddDays(1);
        await service.UpdateStatusAsync(created.Id, new UpdatePrivacyRequestStatusRequest { Status = PrivacyRequestStatus.Completed });
        clock.Now = PrivacySamples.Now.AddDays(2);
        var rejected = await service.UpdateStatusAsync(created.Id, new UpdatePrivacyRequestStatusRequest { Status = PrivacyRequestStatus.Rejected });
        Assert.Equal(PrivacySamples.Now.AddDays(1), rejected.CompletedAt);

        var reopened = await service.UpdateStatusAsync(created.Id, new UpdatePrivacyRequestStatusRequest { Status = PrivacyRequestStatus.InProgress });
        Assert.Null(reopened.CompletedAt);
        Assert.Null((await database.NewContext().PrivacyRequests.SingleAsync()).CompletedAt);
    }

    [Fact]
    public async Task UpdateStatus_NullNoteKeepsTheExistingOneAndBlankNoteClearsIt()
    {
        using var database = new EmailTestDatabase();
        var service = PrivacySamples.RequestService(database);
        var created = await service.CreateAsync(PrivacySamples.NewRequest());

        var withNote = await service.UpdateStatusAsync(created.Id,
            new UpdatePrivacyRequestStatusRequest { Status = PrivacyRequestStatus.InProgress, HandlerNote = "  Identität prüfen  " });
        Assert.Equal("Identität prüfen", withNote.HandlerNote);

        var unchanged = await service.UpdateStatusAsync(created.Id,
            new UpdatePrivacyRequestStatusRequest { Status = PrivacyRequestStatus.InProgress });
        Assert.Equal("Identität prüfen", unchanged.HandlerNote);

        var cleared = await service.UpdateStatusAsync(created.Id,
            new UpdatePrivacyRequestStatusRequest { Status = PrivacyRequestStatus.InProgress, HandlerNote = "   " });
        Assert.Null(cleared.HandlerNote);
    }

    [Fact]
    public async Task UpdateStatus_RejectsUnknownIdUndefinedStatusAndLongNote()
    {
        using var database = new EmailTestDatabase();
        var service = PrivacySamples.RequestService(database);
        var created = await service.CreateAsync(PrivacySamples.NewRequest());

        await Assert.ThrowsAsync<NotFoundException>(() => service.UpdateStatusAsync(
            Guid.NewGuid(), new UpdatePrivacyRequestStatusRequest { Status = PrivacyRequestStatus.Completed }));
        await Assert.ThrowsAsync<ValidationException>(() => service.UpdateStatusAsync(
            created.Id, new UpdatePrivacyRequestStatusRequest { Status = (PrivacyRequestStatus)42 }));
        await Assert.ThrowsAsync<ValidationException>(() => service.UpdateStatusAsync(
            created.Id, new UpdatePrivacyRequestStatusRequest { Status = PrivacyRequestStatus.Completed, HandlerNote = new string('x', 2001) }));
        Assert.Equal(PrivacyRequestStatus.Received, (await database.NewContext().PrivacyRequests.SingleAsync()).Status);
    }

    [Fact]
    public async Task List_FiltersByStatusAndReturnsNewestFirstWithPersonalData()
    {
        using var database = new EmailTestDatabase();
        var oldest = PrivacySamples.StoredRequest(PrivacyRequestStatus.Received, PrivacySamples.Now.AddDays(-3));
        var middle = PrivacySamples.StoredRequest(PrivacyRequestStatus.InProgress, PrivacySamples.Now.AddDays(-2));
        var newest = PrivacySamples.StoredRequest(PrivacyRequestStatus.Received, PrivacySamples.Now.AddDays(-1));
        newest.FullName = "Erika Mustermann";
        newest.Message = "Hallo";
        newest.HandlerNote = "intern";
        database.Context.PrivacyRequests.AddRange(oldest, middle, newest);
        await database.Context.SaveChangesAsync();
        var service = PrivacySamples.RequestService(database);

        var all = await service.ListAsync(null);
        var received = await service.ListAsync(PrivacyRequestStatus.Received);

        Assert.Equal([newest.Id, middle.Id, oldest.Id], all.Select(item => item.Id));
        Assert.Equal([newest.Id, oldest.Id], received.Select(item => item.Id));
        var first = received[0];
        Assert.Equal("person@example.org", first.Email);
        Assert.Equal("Erika Mustermann", first.FullName);
        Assert.Equal("Hallo", first.Message);
        Assert.Equal("intern", first.HandlerNote);
        Assert.Equal("de", first.Locale);
    }

    [Fact]
    public async Task List_IsCappedAtTwoHundredEntries()
    {
        using var database = new EmailTestDatabase();
        for (var index = 0; index < 205; index++)
        {
            database.Context.PrivacyRequests.Add(
                PrivacySamples.StoredRequest(PrivacyRequestStatus.Received, PrivacySamples.Now.AddMinutes(-index)));
        }

        await database.Context.SaveChangesAsync();

        var items = await PrivacySamples.RequestService(database).ListAsync(null);

        Assert.Equal(PrivacyRequestService.MaxListLength, items.Count);
        Assert.Equal(PrivacySamples.Now, items[0].CreatedAt);
    }

    [Fact]
    public void RequestEmails_RenderReferenceAndDatesButNoRequesterDetails()
    {
        var renderer = new EmailTemplateRenderer(EmailSamples.Options(), EmailSamples.Seller());
        var request = PrivacySamples.StoredRequest(PrivacyRequestStatus.Received, PrivacySamples.Now);
        request.FullName = "<Erika & Co>";
        request.Message = "<b>Marker</b>";

        var acknowledgement = renderer.Render(new PrivacyRequestEmail(request, PrivacyRequestEmailKind.Acknowledgement) { Locale = "de" });
        var notification = renderer.Render(new PrivacyRequestEmail(request, PrivacyRequestEmailKind.InternalNotification) { Locale = "de" });

        Assert.StartsWith("soFlott · Ihre Datenschutzanfrage ist eingegangen · " + request.Id.ToString("N")[..8], acknowledgement.Subject);
        Assert.Contains("Guten Tag,", acknowledgement.Text);
        Assert.Contains("Löschung (Art. 17)", acknowledgement.Text);
        Assert.Contains("10.03.2026", acknowledgement.Text);
        Assert.Contains("10.04.2026", acknowledgement.Text);
        Assert.Contains("Sprache der Anfrage: DE", notification.Text);
        Assert.DoesNotContain("Sprache der Anfrage", acknowledgement.Text);
        foreach (var email in new[] { acknowledgement, notification })
        {
            Assert.DoesNotContain("Erika", email.Html);
            Assert.DoesNotContain("Marker", email.Html);
            Assert.DoesNotContain("person@example.org", email.Html);
            Assert.DoesNotContain("person@example.org", email.Text);
        }
    }
}
