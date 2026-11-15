using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Services.Pricing;

/// <summary>
/// Decides how German VAT applies to a customer (spec: Ireland, UK, UAE must not be charged 19%).
/// <list type="bullet">
///   <item>Germany → 19% standard VAT.</item>
///   <item>Other EU country with a business customer → 0%, reverse charge §13b UStG / Art. 196 EU VAT Directive.</item>
///   <item>Outside the EU (UK, UAE, Switzerland...) → 0%, service not taxable in Germany §3a Abs. 2 UStG.</item>
/// </list>
/// A client may carry a manual override which always wins.
/// </summary>
public static class TaxTreatmentResolver
{
    public const string ReverseChargeNote =
        "Reverse Charge – Tax liability of the recipient according to § 13b UStG / Art. 196 EU VAT Directive.";

    public const string NonTaxableNote =
        "Service non-taxable in Germany according to § 3a Abs. 2 UStG.";

    private static readonly HashSet<string> GermanyNames = new(StringComparer.OrdinalIgnoreCase)
    {
        "DE", "DEU", "Germany", "Deutschland", "Bundesrepublik Deutschland",
    };

    // EU member states (without Germany) by ISO code and common English/German names.
    private static readonly HashSet<string> EuNames = new(StringComparer.OrdinalIgnoreCase)
    {
        "AT", "Austria", "Österreich", "Oesterreich",
        "BE", "Belgium", "Belgien",
        "BG", "Bulgaria", "Bulgarien",
        "HR", "Croatia", "Kroatien",
        "CY", "Cyprus", "Zypern",
        "CZ", "Czechia", "Czech Republic", "Tschechien",
        "DK", "Denmark", "Dänemark",
        "EE", "Estonia", "Estland",
        "FI", "Finland", "Finnland",
        "FR", "France", "Frankreich",
        "GR", "EL", "Greece", "Griechenland",
        "HU", "Hungary", "Ungarn",
        "IE", "Ireland", "Irland", "Republic of Ireland",
        "IT", "Italy", "Italien",
        "LV", "Latvia", "Lettland",
        "LT", "Lithuania", "Litauen",
        "LU", "Luxembourg", "Luxemburg",
        "MT", "Malta",
        "NL", "Netherlands", "The Netherlands", "Niederlande", "Holland",
        "PL", "Poland", "Polen",
        "PT", "Portugal",
        "RO", "Romania", "Rumänien",
        "SK", "Slovakia", "Slowakei",
        "SI", "Slovenia", "Slowenien",
        "ES", "Spain", "Spanien",
        "SE", "Sweden", "Schweden",
    };

    public static TaxTreatment Resolve(Client? client)
    {
        if (client is null)
        {
            return TaxTreatment.StandardGermanVat;
        }

        return client.TaxTreatmentOverride ?? ResolveFromCountry(client.Country);
    }

    public static TaxTreatment ResolveFromCountry(string? country)
    {
        var value = (country ?? string.Empty).Trim();
        if (value.Length == 0 || GermanyNames.Contains(value))
        {
            return TaxTreatment.StandardGermanVat;
        }

        return EuNames.Contains(value) ? TaxTreatment.ReverseChargeEu : TaxTreatment.NonTaxableThirdCountry;
    }

    /// <summary>Returns the VAT rate to apply: the configured German rate for domestic, otherwise 0.</summary>
    public static decimal VatRateFor(TaxTreatment treatment, decimal standardRate) =>
        treatment == TaxTreatment.StandardGermanVat ? standardRate : 0m;

    /// <summary>Mandatory legal wording for 0% invoices; null for domestic invoices.</summary>
    public static string? NoteFor(TaxTreatment treatment) => treatment switch
    {
        TaxTreatment.ReverseChargeEu => ReverseChargeNote,
        TaxTreatment.NonTaxableThirdCountry => NonTaxableNote,
        _ => null,
    };

    /// <summary>Warnings the admin should see, e.g. EU customer without a VAT id.</summary>
    public static IEnumerable<string> Warnings(Client? client, TaxTreatment treatment)
    {
        if (treatment == TaxTreatment.ReverseChargeEu && string.IsNullOrWhiteSpace(client?.TaxIdNumber))
        {
            yield return "EU customer without VAT identification number: reverse charge requires the customer's VAT ID on the invoice.";
        }
    }
}
