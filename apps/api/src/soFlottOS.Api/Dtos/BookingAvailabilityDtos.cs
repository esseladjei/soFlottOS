using System.ComponentModel.DataAnnotations;

namespace soFlottOS.Api.Dtos;

public sealed record BookingWindow(int DayOfWeek, string StartTime, string EndTime);

public sealed record SaveBookingAvailabilityRequest
{
    public bool ScheduleEnabled { get; init; }
    public bool IsBusy { get; init; }

    [Required, MaxLength(28)]
    public List<BookingWindow> Windows { get; init; } = [];
}

public sealed record BookingAvailabilityResponse(
    bool ScheduleEnabled,
    bool IsBusy,
    IReadOnlyList<BookingWindow> Windows,
    string TimeZone,
    bool CanBook,
    string? UnavailableReason,
    DateTimeOffset EvaluatedAt);
