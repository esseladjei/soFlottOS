namespace soFlottOS.Api.Domain;

/// <summary>
/// Single source of truth for the three-letter invoice code and the human label of each service.
/// The code is embedded in every invoice number (SOFLOTT-DLV-2026-1001) so the service can be read
/// straight from the reference.
/// </summary>
public static class ServiceTypes
{
    public static string InvoiceCode(this ServiceType serviceType) => serviceType switch
    {
        ServiceType.OnDemandDelivery => "DLV",
        ServiceType.ContractedRoute => "RTE",
        ServiceType.Subcontracting => "SUB",
        ServiceType.RecurringB2BAgreement => "REC",
        ServiceType.SoftwareDevelopment => "SWD",
        ServiceType.ApiIntegration => "API",
        ServiceType.ItConsulting => "CON",
        ServiceType.DigitalTransformation => "DTX",
        ServiceType.MaintenanceSupport => "SUP",
        _ => "GEN",
    };

    public static string Label(this ServiceType serviceType) => serviceType switch
    {
        ServiceType.OnDemandDelivery => "On-demand B2B delivery",
        ServiceType.ContractedRoute => "Contracted route",
        ServiceType.Subcontracting => "Subcontracting (last mile)",
        ServiceType.RecurringB2BAgreement => "Recurring B2B agreement",
        ServiceType.SoftwareDevelopment => "Software development",
        ServiceType.ApiIntegration => "API & systems integration",
        ServiceType.ItConsulting => "IT consulting",
        ServiceType.DigitalTransformation => "Digital transformation",
        ServiceType.MaintenanceSupport => "Maintenance & support",
        _ => serviceType.ToString(),
    };

    public static BusinessUnit BusinessUnit(this ServiceType serviceType) =>
        (int)serviceType >= (int)ServiceType.SoftwareDevelopment ? Domain.BusinessUnit.Digital : Domain.BusinessUnit.Express;

    public static IReadOnlyList<ServiceType> All { get; } = Enum.GetValues<ServiceType>();
}
