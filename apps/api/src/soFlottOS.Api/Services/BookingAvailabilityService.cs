using System.Globalization;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Dtos;

namespace soFlottOS.Api.Services;

public sealed class BookingAvailabilityService(AppDbContext dbContext, TimeProvider clock, MessageLocale locale)
{
    public async Task<BookingAvailabilityResponse> GetAsync(CancellationToken cancellationToken = default)
    {
        var settings = await dbContext.BookingAvailability.AsNoTracking().SingleAsync(cancellationToken);
        var windows = JsonSerializer.Deserialize<List<BookingWindow>>(settings.WindowsJson)
            ?? throw new InvalidOperationException("Booking availability windows are missing.");
        var now = clock.GetUtcNow();
        var local = BusinessTime.ToLocal(now);
        var minute = local.TimeOfDay.TotalMinutes;
        var withinWindow = windows.Any(window => window.DayOfWeek == (int)local.DayOfWeek &&
            minute >= ParseMinute(window.StartTime, false) && minute < ParseMinute(window.EndTime, true));
        var reason = settings.IsBusy ? "Busy" : settings.ScheduleEnabled && !withinWindow ? "OutsideHours" : null;
        return new(settings.ScheduleEnabled, settings.IsBusy, windows, BusinessTime.ZoneId, reason is null, reason, now);
    }

    public async Task<BookingAvailabilityResponse> SaveAsync(
        SaveBookingAvailabilityRequest request, CancellationToken cancellationToken = default)
    {
        if (request.Windows is null || request.Windows.Count > 28)
            throw InvalidWindows();

        var intervals = new List<(int Day, int Start, int End)>();
        foreach (var window in request.Windows)
        {
            if (window is null || window.DayOfWeek is < 0 or > 6)
                throw InvalidWindows();
            var start = ParseMinute(window.StartTime, false);
            var end = ParseMinute(window.EndTime, true);
            if (start >= end || intervals.Any(other =>
                    other.Day == window.DayOfWeek && start < other.End && end > other.Start))
                throw InvalidWindows();
            intervals.Add((window.DayOfWeek, start, end));
        }

        var settings = await dbContext.BookingAvailability.SingleAsync(cancellationToken);
        settings.ScheduleEnabled = request.ScheduleEnabled;
        settings.IsBusy = request.IsBusy;
        settings.WindowsJson = JsonSerializer.Serialize(request.Windows
            .OrderBy(window => window.DayOfWeek).ThenBy(window => window.StartTime).ToList());
        await dbContext.SaveChangesAsync(cancellationToken);
        return await GetAsync(cancellationToken);
    }

    public async Task EnsureCanBookAsync(CurrentUser user, CancellationToken cancellationToken = default)
    {
        if (user.IsAdmin) return;
        var availability = await GetAsync(cancellationToken);
        if (!availability.CanBook)
            throw new ConflictException(locale.Current == "en"
                ? "soFlott is currently busy or unavailable. Please try again during our booking hours."
                : "soFlott ist derzeit ausgelastet oder nicht verfügbar. Bitte versuchen Sie es während unserer Buchungszeiten erneut.");
    }

    private static int ParseMinute(string? value, bool allowMidnight)
    {
        if (allowMidnight && value == "24:00") return 1440;
        if (!TimeOnly.TryParseExact(value, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var time))
            throw InvalidWindows();
        return time.Hour * 60 + time.Minute;
    }

    private static ValidationException InvalidWindows() => new("Windows",
        "Use up to 28 non-overlapping windows with dayOfWeek 0 (Sunday) to 6 (Saturday), " +
        "HH:mm times and start before end. End may be 24:00; split overnight hours across two days.");
}
