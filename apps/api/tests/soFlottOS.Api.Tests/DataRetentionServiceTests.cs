using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Services;
using Xunit;

namespace soFlottOS.Api.Tests;

public sealed class DataRetentionServiceTests
{
    private static Task<RetentionSweepResult> SweepAsync(
        EmailTestDatabase database, TimeProvider clock, PrivacyOptions? options = null) =>
        DataRetentionService.PurgeAsync(
            new ConsentRepository(database.Context), new PrivacyRequestRepository(database.Context),
            options ?? new PrivacyOptions(), clock);

    [Fact]
    public async Task Purge_DeletesOnlyConsentRecordsOlderThanTheRetentionPeriod()
    {
        using var database = new EmailTestDatabase();
        var now = PrivacySamples.Now;
        var expired = Guid.NewGuid();
        var exactlyAtLimit = Guid.NewGuid();
        var recent = Guid.NewGuid();
        var brandNew = Guid.NewGuid();
        database.Context.ConsentRecords.AddRange(
            PrivacySamples.StoredConsent(expired, null, now.AddDays(-1096)),
            PrivacySamples.StoredConsent(exactlyAtLimit, null, now.AddDays(-1095)),
            PrivacySamples.StoredConsent(recent, null, now.AddDays(-1094)),
            PrivacySamples.StoredConsent(brandNew, null, now));
        await database.Context.SaveChangesAsync();

        var result = await SweepAsync(database, new FixedEmailClock(now));

        Assert.Equal(1, result.ConsentRecords);
        Assert.Equal(0, result.PrivacyRequests);
        using var other = database.NewContext();
        var remaining = await other.ConsentRecords.Select(record => record.Id).ToListAsync();
        Assert.DoesNotContain(expired, remaining);
        Assert.Contains(exactlyAtLimit, remaining);
        Assert.Contains(recent, remaining);
        Assert.Contains(brandNew, remaining);
    }

    [Fact]
    public async Task Purge_DeletesOnlyFinishedRequestsOlderThanTheRetentionPeriod()
    {
        using var database = new EmailTestDatabase();
        var now = PrivacySamples.Now;
        var oldCompleted = PrivacySamples.StoredRequest(PrivacyRequestStatus.Completed, now.AddDays(-1300), now.AddDays(-1200));
        var oldRejected = PrivacySamples.StoredRequest(PrivacyRequestStatus.Rejected, now.AddDays(-1300), now.AddDays(-1100));
        var recentlyCompleted = PrivacySamples.StoredRequest(PrivacyRequestStatus.Completed, now.AddDays(-1300), now.AddDays(-30));
        var oldButOpen = PrivacySamples.StoredRequest(PrivacyRequestStatus.Received, now.AddDays(-2000));
        var oldInProgress = PrivacySamples.StoredRequest(PrivacyRequestStatus.InProgress, now.AddDays(-2000));
        var fresh = PrivacySamples.StoredRequest(PrivacyRequestStatus.Received, now);
        database.Context.PrivacyRequests.AddRange(oldCompleted, oldRejected, recentlyCompleted, oldButOpen, oldInProgress, fresh);
        await database.Context.SaveChangesAsync();

        var result = await SweepAsync(database, new FixedEmailClock(now));

        Assert.Equal(2, result.PrivacyRequests);
        Assert.Equal(0, result.ConsentRecords);
        using var other = database.NewContext();
        var remaining = await other.PrivacyRequests.Select(request => request.Id).ToListAsync();
        Assert.Equal(
            new[] { recentlyCompleted.Id, oldButOpen.Id, oldInProgress.Id, fresh.Id }.Order(),
            remaining.Order());
    }

    [Fact]
    public async Task Purge_FollowsTheClockAndTheConfiguredPeriods()
    {
        using var database = new EmailTestDatabase();
        var now = PrivacySamples.Now;
        database.Context.ConsentRecords.AddRange(
            PrivacySamples.StoredConsent(Guid.NewGuid(), null, now.AddDays(-40)),
            PrivacySamples.StoredConsent(Guid.NewGuid(), null, now.AddDays(-10)));
        database.Context.PrivacyRequests.AddRange(
            PrivacySamples.StoredRequest(PrivacyRequestStatus.Completed, now.AddDays(-60), now.AddDays(-45)),
            PrivacySamples.StoredRequest(PrivacyRequestStatus.Completed, now.AddDays(-60), now.AddDays(-5)));
        await database.Context.SaveChangesAsync();
        var options = new PrivacyOptions { ConsentEvidenceRetentionDays = 30, CompletedRequestRetentionDays = 30 };
        var clock = new FixedEmailClock(now);

        var first = await SweepAsync(database, clock, options);
        Assert.Equal(new RetentionSweepResult(1, 1), first);

        clock.Now = now.AddDays(100);
        var second = await SweepAsync(database, clock, options);
        Assert.Equal(new RetentionSweepResult(1, 1), second);
        Assert.Empty(await database.NewContext().ConsentRecords.ToListAsync());
        Assert.Empty(await database.NewContext().PrivacyRequests.ToListAsync());
    }

    [Fact]
    public async Task Purge_WithNothingExpiredRemovesNothing()
    {
        using var database = new EmailTestDatabase();

        Assert.Equal(new RetentionSweepResult(0, 0), await SweepAsync(database, new FixedEmailClock(PrivacySamples.Now)));
    }
}

public sealed class PrivacyOptionsTests
{
    [Fact]
    public void Defaults_MatchTheDocumentedRetentionPolicy()
    {
        var options = new PrivacyOptions();

        Assert.Equal("Privacy", PrivacyOptions.SectionName);
        Assert.Equal(1095, options.ConsentEvidenceRetentionDays);
        Assert.Equal(1095, options.CompletedRequestRetentionDays);
        Assert.Equal("info@soflott.de", options.NotificationEmail);
        Assert.Equal(24, options.RetentionSweepIntervalHours);
        options.Validate();
    }

    [Fact]
    public void ShippedAppSettingsBindToTheDefaults()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory is not null && !File.Exists(Path.Combine(directory.FullName, "src", "soFlottOS.Api", "appsettings.json")))
        {
            directory = directory.Parent;
        }

        Assert.NotNull(directory);
        var path = Path.Combine(directory.FullName, "src", "soFlottOS.Api", "appsettings.json");
        var configuration = new ConfigurationBuilder().AddJsonFile(path, optional: false).Build();

        var options = configuration.GetSection(PrivacyOptions.SectionName).Get<PrivacyOptions>();

        Assert.NotNull(options);
        Assert.Equal(1095, options.ConsentEvidenceRetentionDays);
        Assert.Equal(1095, options.CompletedRequestRetentionDays);
        Assert.Equal("info@soflott.de", options.NotificationEmail);
        Assert.Equal(24, options.RetentionSweepIntervalHours);
        options.Validate();
    }

    [Theory]
    [InlineData(0, 1095, "info@soflott.de", 24)]
    [InlineData(3651, 1095, "info@soflott.de", 24)]
    [InlineData(1095, 0, "info@soflott.de", 24)]
    [InlineData(1095, -1, "info@soflott.de", 24)]
    [InlineData(1095, 1095, "info@soflott.de", 0)]
    [InlineData(1095, 1095, "info@soflott.de", 169)]
    [InlineData(1095, 1095, "", 24)]
    [InlineData(1095, 1095, "not-an-email", 24)]
    public void Validate_RejectsOutOfRangeValues(int consentDays, int requestDays, string email, int sweepHours)
    {
        var options = new PrivacyOptions
        {
            ConsentEvidenceRetentionDays = consentDays,
            CompletedRequestRetentionDays = requestDays,
            NotificationEmail = email,
            RetentionSweepIntervalHours = sweepHours
        };

        Assert.Throws<InvalidOperationException>(options.Validate);
    }
}
