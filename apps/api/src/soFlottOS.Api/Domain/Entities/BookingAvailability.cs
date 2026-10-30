namespace soFlottOS.Api.Domain.Entities;

public sealed class BookingAvailability
{
    public int Id { get; set; } = 1;
    public bool ScheduleEnabled { get; set; }
    public bool IsBusy { get; set; }
    public string WindowsJson { get; set; } = "[]";
}
