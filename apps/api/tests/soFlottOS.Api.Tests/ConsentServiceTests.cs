using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Common;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using Xunit;

namespace soFlottOS.Api.Tests;

public sealed class ConsentServiceTests
{
    [Fact]
    public async Task Record_StoresDecisionWithServerTimeAndTrimmedVersion()
    {
        using var database = new EmailTestDatabase();
        var service = PrivacySamples.ConsentService(database);
        var previous = Guid.NewGuid();
        var request = PrivacySamples.Consent(previousId: previous) with { Version = " 1.0 " };

        await service.RecordAsync(request);

        using var other = database.NewContext();
        var stored = await other.ConsentRecords.SingleAsync();
        Assert.Equal(request.Id, stored.Id);
        Assert.Equal(previous, stored.PreviousConsentId);
        Assert.Equal("1.0", stored.Version);
        Assert.Equal(ConsentAction.Custom, stored.Action);
        Assert.True(stored.Analytics);
        Assert.False(stored.Marketing);
        Assert.True(stored.Preferences);
        Assert.Equal(PrivacySamples.Now, stored.CreatedAt);
    }

    [Fact]
    public async Task Record_SameIdTwiceIsIdempotentAndKeepsTheFirstDecision()
    {
        using var database = new EmailTestDatabase();
        var clock = new FixedEmailClock(PrivacySamples.Now);
        var service = PrivacySamples.ConsentService(database, clock);
        var request = PrivacySamples.Consent();

        await service.RecordAsync(request);
        clock.Now = PrivacySamples.Now.AddHours(1);
        await service.RecordAsync(request with { Action = ConsentAction.AcceptAll, Marketing = true });

        using var other = database.NewContext();
        var stored = await other.ConsentRecords.SingleAsync();
        Assert.Equal(ConsentAction.Custom, stored.Action);
        Assert.False(stored.Marketing);
        Assert.Equal(PrivacySamples.Now, stored.CreatedAt);
    }

    [Fact]
    public async Task Record_TreatsEmptyPreviousIdAsNoPreviousDecision()
    {
        using var database = new EmailTestDatabase();
        var service = PrivacySamples.ConsentService(database);

        await service.RecordAsync(PrivacySamples.Consent(previousId: Guid.Empty));

        Assert.Null((await database.NewContext().ConsentRecords.SingleAsync()).PreviousConsentId);
    }

    [Fact]
    public async Task Record_RejectsEmptyId()
    {
        using var database = new EmailTestDatabase();
        var service = PrivacySamples.ConsentService(database);

        var exception = await Assert.ThrowsAsync<ValidationException>(
            () => service.RecordAsync(PrivacySamples.Consent(Guid.Empty)));

        Assert.True(exception.Errors.ContainsKey("id"));
        Assert.Empty(await database.NewContext().ConsentRecords.ToListAsync());
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("1.0 beta")]
    [InlineData("<script>")]
    [InlineData("123456789012345678901")]
    public async Task Record_RejectsInvalidVersion(string version)
    {
        using var database = new EmailTestDatabase();
        var service = PrivacySamples.ConsentService(database);

        var exception = await Assert.ThrowsAsync<ValidationException>(
            () => service.RecordAsync(PrivacySamples.Consent() with { Version = version }));

        Assert.True(exception.Errors.ContainsKey("version"));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(4)]
    [InlineData(-1)]
    public async Task Record_RejectsUndefinedAction(int action)
    {
        using var database = new EmailTestDatabase();
        var service = PrivacySamples.ConsentService(database);

        var exception = await Assert.ThrowsAsync<ValidationException>(
            () => service.RecordAsync(PrivacySamples.Consent() with { Action = (ConsentAction)action }));

        Assert.True(exception.Errors.ContainsKey("action"));
    }

    [Fact]
    public async Task Record_RejectsADecisionThatFollowsItself()
    {
        using var database = new EmailTestDatabase();
        var service = PrivacySamples.ConsentService(database);
        var id = Guid.NewGuid();

        var exception = await Assert.ThrowsAsync<ValidationException>(
            () => service.RecordAsync(PrivacySamples.Consent(id, id)));

        Assert.True(exception.Errors.ContainsKey("previousId"));
    }

    [Fact]
    public async Task Record_ValidationMessagesFollowTheRequestLocale()
    {
        using var database = new EmailTestDatabase();

        // HttpContextAccessor keeps its context in an ambient slot, so each service is built right before it is used.
        var english = PrivacySamples.ConsentService(database, locale: "en");
        var en = await Assert.ThrowsAsync<ValidationException>(() => english.RecordAsync(PrivacySamples.Consent(Guid.Empty)));
        var german = PrivacySamples.ConsentService(database);
        var de = await Assert.ThrowsAsync<ValidationException>(() => german.RecordAsync(PrivacySamples.Consent(Guid.Empty)));

        Assert.Equal("The consent id is required.", en.Message);
        Assert.Equal("Die Einwilligungs-ID ist erforderlich.", de.Message);
    }

    [Fact]
    public void ConsentRecord_HoldsNoIdentifiersBeyondTheDecisionItself()
    {
        var properties = typeof(ConsentRecord).GetProperties().Select(property => property.Name).Order().ToArray();

        Assert.Equal(
            ["Action", "Analytics", "CreatedAt", "Id", "Marketing", "Preferences", "PreviousConsentId", "Version"],
            properties);
    }

    [Fact]
    public async Task History_ReturnsTheChainNewestFirst()
    {
        using var database = new EmailTestDatabase();
        var first = Guid.NewGuid();
        var second = Guid.NewGuid();
        var third = Guid.NewGuid();
        var unrelated = Guid.NewGuid();
        database.Context.ConsentRecords.AddRange(
            PrivacySamples.StoredConsent(first, null, PrivacySamples.Now.AddDays(-20)),
            PrivacySamples.StoredConsent(second, first, PrivacySamples.Now.AddDays(-10)),
            PrivacySamples.StoredConsent(third, second, PrivacySamples.Now),
            PrivacySamples.StoredConsent(unrelated, null, PrivacySamples.Now));
        await database.Context.SaveChangesAsync();

        var history = await PrivacySamples.ConsentService(database).GetHistoryAsync(third, 50);

        Assert.Equal([third, second, first], history.Select(item => item.Id));
        Assert.Equal(second, history[0].PreviousId);
        Assert.Null(history[2].PreviousId);
        Assert.Equal(PrivacySamples.Now, history[0].CreatedAt);
    }

    [Fact]
    public async Task History_StartingFromAMiddleRecordLeavesOutNewerOnes()
    {
        using var database = new EmailTestDatabase();
        var first = Guid.NewGuid();
        var second = Guid.NewGuid();
        var third = Guid.NewGuid();
        database.Context.ConsentRecords.AddRange(
            PrivacySamples.StoredConsent(first, null, PrivacySamples.Now.AddDays(-2)),
            PrivacySamples.StoredConsent(second, first, PrivacySamples.Now.AddDays(-1)),
            PrivacySamples.StoredConsent(third, second, PrivacySamples.Now));
        await database.Context.SaveChangesAsync();

        var history = await PrivacySamples.ConsentService(database).GetHistoryAsync(second, 50);

        Assert.Equal([second, first], history.Select(item => item.Id));
    }

    [Fact]
    public async Task History_UnknownIdIsNotFound()
    {
        using var database = new EmailTestDatabase();

        await Assert.ThrowsAsync<NotFoundException>(
            () => PrivacySamples.ConsentService(database).GetHistoryAsync(Guid.NewGuid(), 50));
    }

    [Fact]
    public async Task History_EmptyIdIsAValidationError()
    {
        using var database = new EmailTestDatabase();

        await Assert.ThrowsAsync<ValidationException>(
            () => PrivacySamples.ConsentService(database).GetHistoryAsync(Guid.Empty, 50));
    }

    [Fact]
    public async Task History_StopsWhenTheChainLoopsBackOnItself()
    {
        using var database = new EmailTestDatabase();
        var a = Guid.NewGuid();
        var b = Guid.NewGuid();
        var c = Guid.NewGuid();
        database.Context.ConsentRecords.AddRange(
            PrivacySamples.StoredConsent(a, c, PrivacySamples.Now.AddDays(-2)),
            PrivacySamples.StoredConsent(b, a, PrivacySamples.Now.AddDays(-1)),
            PrivacySamples.StoredConsent(c, b, PrivacySamples.Now));
        await database.Context.SaveChangesAsync();

        var history = await PrivacySamples.ConsentService(database).GetHistoryAsync(c, 100);

        Assert.Equal([c, b, a], history.Select(item => item.Id));
    }

    [Fact]
    public async Task History_StopsWhenARecordPointsAtItself()
    {
        using var database = new EmailTestDatabase();
        var id = Guid.NewGuid();
        database.Context.ConsentRecords.Add(PrivacySamples.StoredConsent(id, id, PrivacySamples.Now));
        await database.Context.SaveChangesAsync();

        var history = await PrivacySamples.ConsentService(database).GetHistoryAsync(id, 100);

        Assert.Equal(id, Assert.Single(history).Id);
    }

    [Fact]
    public async Task History_StopsWhereAnOlderRecordWasAlreadyPurged()
    {
        using var database = new EmailTestDatabase();
        var id = Guid.NewGuid();
        database.Context.ConsentRecords.Add(PrivacySamples.StoredConsent(id, Guid.NewGuid(), PrivacySamples.Now));
        await database.Context.SaveChangesAsync();

        var history = await PrivacySamples.ConsentService(database).GetHistoryAsync(id, 50);

        Assert.Equal(id, Assert.Single(history).Id);
    }

    [Theory]
    [InlineData(50, 50)]
    [InlineData(3, 3)]
    [InlineData(0, 1)]
    [InlineData(-5, 1)]
    [InlineData(500, 100)]
    public async Task History_ClampsTakeToTheHardCap(int take, int expected)
    {
        using var database = new EmailTestDatabase();
        Guid? previous = null;
        var newest = Guid.Empty;
        for (var index = 0; index < 120; index++)
        {
            newest = Guid.NewGuid();
            database.Context.ConsentRecords.Add(
                PrivacySamples.StoredConsent(newest, previous, PrivacySamples.Now.AddMinutes(index)));
            previous = newest;
        }

        await database.Context.SaveChangesAsync();

        var history = await PrivacySamples.ConsentService(database).GetHistoryAsync(newest, take);

        Assert.Equal(expected, history.Count);
        Assert.Equal(newest, history[0].Id);
    }
}
