namespace soFlottOS.Api.Common;

public static class BusinessTime
{
    public const string ZoneId = "Europe/Berlin";
    private static readonly TimeZoneInfo Zone = TimeZoneInfo.FindSystemTimeZoneById(ZoneId);

    public static DateTimeOffset ToLocal(DateTimeOffset instant) => TimeZoneInfo.ConvertTime(instant, Zone);
}
