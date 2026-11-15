import type { Locale } from "@/i18n/config";

interface GuideSection {
  id: string;
  title: string;
  paragraphs?: string[];
  entries?: { title: string; text: string; href?: string }[];
  table?: { headers: string[]; rows: string[][] };
}

interface PricingHelp {
  title: string;
  description: string;
  contents: string;
  openPage: string;
  simulator: string;
  principle: string;
  sections: GuideSection[];
}

export const pricingHelp: Record<Locale, PricingHelp> = {
  en: {
    title: "Costing & pricing guide",
    description: "From your business expenses to a customer quote. Follow the setup once, then calculate each job using its own quantities.",
    contents: "In this guide",
    openPage: "Open this page",
    simulator: "Open price simulator",
    principle: "Cost is what your business spends. Price is what the customer pays. Profit is the selling price before VAT minus your estimated cost.",
    sections: [
      {
        id: "building-blocks",
        title: "What each menu means",
        entries: [
          { title: "Cost items: other business expenses", text: "Not just overhead. Record shared expenses such as rent, accounting and software, or direct expenses such as subcontractor fees and project licences. Fixed and semi-variable items are shown as overhead; variable and one-time items are shown as direct costs. Categories organise the items; a category alone does not add a cost.", href: "/pricing/costs" },
          { title: "Vehicles: the cost of using a vehicle", text: "Enter purchase and residual value, expected mileage, fuel, tyres, servicing, insurance, tax and financing. The engine converts these into distance and time costs, then applies the job's kilometres and/or days. These are your costs, not the customer rate per kilometre.", href: "/pricing/vehicles" },
          { title: "Labour: the cost of productive working time", text: "Enter gross salary, employer contributions and additional annual costs. Paid hours, leave, holidays, absence and billable utilisation determine productive hours. Annual employer cost divided by productive hours gives the internal hourly cost. Lower utilisation means a higher cost per billable hour.", href: "/pricing/labour" },
          { title: "Cost profiles: a reusable bundle of resources", text: "Select the cost items, one vehicle profile if needed, one labour profile if needed, and an optional risk allowance. For example, 'B2B van delivery costs' combines a van, a driver and allocated office costs. 'API integration costs' combines developer time, software and overhead. The bundle needs job quantities before it can produce a job cost.", href: "/pricing/cost-profiles" },
          { title: "Pricing profiles: your selling-price rules", text: "Choose the service, link its cost profile and choose how to charge: cost plus, target margin, fixed price or rate card. Optionally select a client for an agreed deal. The 'Customer pays' indicator shows the fixed net amount, customer rates or cost-based rule; it is not always a final quote.", href: "/pricing/profiles" },
          { title: "Simulator and change log", text: "The simulator combines a profile with job quantities and shows estimated cost, customer price and profit. Saved scenarios are estimates, not booked orders, contracts or invoices. The change log records configuration changes, not actual expenses or payments.", href: "/pricing/simulator" },
        ],
      },
      {
        id: "workflow",
        title: "Setup and quote workflow",
        entries: [
          { title: "1. Replace the sample assumptions", text: "Start with your own expenses, vehicle data and salaries. Seeded sample profiles demonstrate the system; their rates and costs are not a recommendation for your business." },
          { title: "2. Allocate shared expenses", text: "For monthly or annual costs, choose how they are shared and enter an annual allocation denominator. Example: €200/month accounting = €2,400/year. Spread over 1,200 deliveries/year, this allocates €2 per delivery. A job with 3 deliveries gets €6. Use a realistic capacity and avoid allocating the full annual expense to every job.", href: "/pricing/costs" },
          { title: "3. Build the service's cost bundle", text: "Select only the resources the service uses. Do not enter salary again as a cost item if labour already covers it, or insurance again if the vehicle already includes it. If the same overhead is shared across services, choose denominators that reflect the shared capacity; do not recover the entire expense independently in every service.", href: "/pricing/cost-profiles" },
          { title: "4. Set how the customer is charged", text: "Create a pricing profile, select the service and cost bundle, then enter your target profit margin, markup, agreed fixed price or customer unit rates. Set a minimum price if needed. Minimum margin is an alert only; it does not raise the price.", href: "/pricing/profiles" },
          { title: "5. Calculate a real job or contract estimate", text: "Save the profile and click 'Calculate customer total', or select it in the simulator. Choose the client for the right tax treatment. Enter distance, time and other quantities for one clear scope: one delivery, one route, the whole project or one month. Add job-only expenses, discounts or surcharges.", href: "/pricing/simulator" },
          { title: "6. Review before agreeing the price", text: "Check total estimated cost, selling price before VAT, VAT, customer total, expected profit and margin. Resolve warnings and check every cost line. A manually selected profile takes precedence. Automatic selection uses an active, in-date client/service profile, then a general service profile, then a business-unit profile. Defaults are preferred among general profiles." },
        ],
      },
      {
        id: "profit",
        title: "Where to set your profit",
        paragraphs: ["Open Pricing profiles, edit a profile and choose the strategy. All calculations below are before VAT and before job-specific adjustments."],
        table: {
          headers: ["Strategy", "What you enter", "Example with €100 cost"],
          rows: [
            ["Cost plus", "Markup % added on top of cost", "25% markup: €125 selling price; €25 profit; 20% margin."],
            ["Target margin", "Profit as a percentage of the selling price", "25% margin: €100 ÷ 0.75 = €133.33 selling price; €33.33 profit."],
            ["Fixed price", "Customer's agreed net amount", "€120 fixed price: €20 profit; 16.67% margin."],
            ["Rate card", "Customer rates per hour, km, route or other unit", "Base fee + quantities × rates. Profit is the resulting net price minus cost."],
          ],
        },
        entries: [
          { title: "Minimum price is not minimum margin", text: "Minimum price raises the calculated price to a currency amount before job adjustments. Minimum margin only warns when profit as a percentage of the net price falls below your threshold. Discounts or a manual override can still reduce the final price." },
          { title: "Risk allowance is not profit", text: "A risk allowance adds a contingency to the estimated cost base before the selling-price strategy is applied. Your desired profit is configured separately. Expected profit is an estimate based on that cost base, not realised accounting profit." },
        ],
      },
      {
        id: "quantities",
        title: "Which job quantities to enter",
        paragraphs: ["A service name is not enough to determine its cost. One delivery could take 10 minutes or 3 hours. One API project could take 8 hours or 200 hours. The engine does not infer effort from '1 delivery' or '1 project'."],
        table: {
          headers: ["Resource", "Required quantities", "Important detail"],
          rows: [
            ["Vehicle", "Kilometres for distance costs; days if allocating time costs by day", "With km only, insurance/tax/financing are allocated per km. With days too, those time costs use days instead."],
            ["Labour", "Hours OR working days", "Hours take precedence; days are converted to hours using the labour profile. Do not expect both to be added."],
            ["Cost items", "Quantity matching the allocation unit", "A per-delivery item needs deliveries; a per-hour item needs hours. Whole amount applies once."],
            ["Rate card", "Quantity for every applicable rate line", "Every line is added. If hourly and daily rates are alternatives, avoid entering both quantities or use separate profiles."],
            ["Recurring contract", "Expected quantities for the period you are quoting", "For a monthly quote, enter one month's hours, routes and costs. 'Months = 1' alone does not infer labour hours."],
          ],
        },
      },
      {
        id: "delivery-example",
        title: "Worked example: B2B delivery",
        paragraphs: ["Illustrative figures only, not your configured rates. Scope: one delivery, 40 km and 2 working hours. Create a van/driver cost profile and link it to a delivery pricing profile with 20% target margin. Enter kilometres = 40, hours = 2 and deliveries = 1 in the simulator."],
        table: {
          headers: ["Part", "Calculation", "Amount"],
          rows: [
            ["Vehicle", "40 km × €0.50 assumed total vehicle cost/km", "€20"],
            ["Driver", "2 hours × €25 internal cost/hour", "€50"],
            ["Allocated overhead", "Share of business expenses for this job", "€10"],
            ["Total estimated cost", "€20 + €50 + €10", "€80"],
            ["Customer price before VAT", "€80 ÷ (1 − 20%)", "€100"],
            ["Expected profit", "€100 − €80", "€20"],
            ["Customer total with 19% German VAT", "€100 + €19", "€119"],
          ],
        },
        entries: [{ title: "Contracted routes and subcontracting", text: "For a route, enter the whole route's kilometres and working time, not just one stop. If buying a subcontractor's service, include their fee as a direct cost and only add your own vehicle/labour if you also incur those costs. For a monthly contract, use the expected monthly route totals." }],
      },
      {
        id: "api-example",
        title: "Worked example: API integration contract",
        paragraphs: ["Illustrative figures only. Scope: the entire project, estimated at 40 developer hours. Create an API integration cost profile with developer labour and allocated overhead. Link a pricing profile using 25% target margin. Enter hours = 40 and projects = 1; add the €100 project licence as an extra cost if it is not already in the cost profile."],
        table: {
          headers: ["Part", "Calculation", "Amount"],
          rows: [
            ["Developer", "40 hours × €40 internal cost/hour", "€1,600"],
            ["Project licence", "One-off project expense", "€100"],
            ["Allocated overhead", "Share of software, administration and office costs", "€300"],
            ["Total estimated project cost", "€1,600 + €100 + €300", "€2,000"],
            ["Customer price before VAT", "€2,000 ÷ (1 − 25%)", "€2,666.67"],
            ["Expected profit", "Net selling price − estimated cost", "€666.67"],
          ],
        },
        entries: [{ title: "Hourly work versus fixed project scope", text: "Use a rate card when billing agreed hours at an agreed rate. Use a fixed price when the contract amount is already negotiated; the engine then checks estimated profitability. Use target margin to build an offer from estimated cost. Separate implementation and recurring support into separate calculations with clearly defined scopes." }],
      },
      {
        id: "warnings",
        title: "Understanding warnings",
        entries: [
          { title: "No labour cost added", text: "A labour profile is linked but hours and days are zero. Enter estimated working time, or remove that labour profile if the service does not use it. A missing labour cost makes estimated profit look better than it really is." },
          { title: "No vehicle cost added", text: "A vehicle is linked but kilometres and days are zero. Enter the job's actual distance and any relevant day allocation. Days alone do not add fuel or other distance costs." },
          { title: "Margin below the minimum, or negative margin", text: "The price is too low for the configured costs. Margin = (net price − cost) ÷ net price × 100. For example, €100 price with €288.60 cost gives −188.6% margin: a €188.60 loss. Check the costs, raise fixed prices/rates, or use cost plus/target margin. Raising only the warning threshold does not fix a loss." },
          { title: "Cost item skipped: missing denominator", text: "A recurring expense needs the annual quantity over which it is allocated, such as annual kilometres or productive hours. Enter a realistic denominator; otherwise that expense is excluded." },
          { title: "No cost profile or zero cost data", text: "A rate card can calculate a customer price without a cost bundle, but the profit figure is incomplete. Cost-plus and target-margin pricing require cost data. Link the correct resources and enter job quantities." },
          { title: "EU customer without VAT ID", text: "Check the client's billing country, business status and VAT ID before relying on reverse charge. The country-based treatment does not validate the VAT ID or establish legal eligibility." },
        ],
      },
      {
        id: "tax-and-records",
        title: "VAT, invoices and limits",
        paragraphs: [
          "The current country-based rule applies German VAT for Germany (normally 19%), reverse charge for other EU countries such as Ireland, and no German VAT for third countries such as the UK and UAE. A client tax-treatment override takes precedence. No selected client or an empty country defaults to German VAT. Verify the legal treatment of each service and customer; this is not a complete tax determination engine.",
          "VAT is added after the net selling price. It is not profit. The simulator shows the legal tax note and customer total for the selected client.",
          "Invoice numbers include a service code, for example SOFLOTT-DLV-2026-0007 for delivery. Other codes distinguish routes, subcontracting and digital services. Calculating or saving a scenario does not itself generate an invoice or activate a contract.",
          "Only the on-demand booking flow is currently wired to automatically price orders with the engine. Other services can be configured and estimated, but this guide does not imply a complete contract creation or recurring billing workflow. The legacy delivery tariff remains a fallback when no applicable engine profile exists.",
          "These are estimated costs and profit, not actual job accounting. Review assumptions regularly. A shared cost profile is reused by all linked pricing profiles; changing it can affect future calculations. Historical calculation results store their breakdown, while the change log records configuration edits.",
        ],
      },
    ],
  },
  de: {
    title: "Kosten & Preise verstehen",
    description: "Von Ihren Betriebsausgaben zum Kundenangebot. Einmal einrichten, dann jeden Auftrag mit seinen eigenen Mengen berechnen.",
    contents: "In diesem Leitfaden",
    openPage: "Diese Seite öffnen",
    simulator: "Preissimulator öffnen",
    principle: "Kosten sind Ihre Ausgaben. Der Preis ist der Betrag für den Kunden. Gewinn ist der Verkaufspreis ohne Umsatzsteuer minus geschätzte Kosten.",
    sections: [
      {
        id: "building-blocks",
        title: "Was die Menüpunkte bedeuten",
        entries: [
          { title: "Kostenpositionen: weitere Betriebsausgaben", text: "Nicht nur Gemeinkosten. Erfassen Sie gemeinsame Ausgaben wie Miete, Buchhaltung und Software oder direkte Kosten wie Subunternehmerhonorare und Projektlizenzen. Fixe und teilvariable Positionen erscheinen als Gemeinkosten, variable und einmalige Positionen als direkte Kosten. Kategorien ordnen die Positionen; eine Kategorie allein erzeugt keine Kosten.", href: "/pricing/costs" },
          { title: "Fahrzeuge: Kosten des Fahrzeugeinsatzes", text: "Erfassen Sie Anschaffungs- und Restwert, Laufleistung, Kraftstoff, Reifen, Wartung, Versicherung, Steuer und Finanzierung. Daraus entstehen strecken- und zeitabhängige Kosten, die mit Kilometern bzw. Tagen des Auftrags verrechnet werden. Das sind Ihre Kosten, nicht der Kilometerpreis für den Kunden.", href: "/pricing/vehicles" },
          { title: "Personal: Kosten produktiver Arbeitszeit", text: "Bruttogehalt, Arbeitgeberbeiträge und weitere Jahreskosten ergeben die Arbeitgeberkosten. Bezahlte Stunden, Urlaub, Feiertage, Ausfälle und abrechenbare Auslastung bestimmen die produktiven Stunden. Jahreskosten geteilt durch produktive Stunden ergeben den internen Stundensatz. Weniger Auslastung erhöht die Kosten je abrechenbarer Stunde.", href: "/pricing/labour" },
          { title: "Kostenprofile: wiederverwendbare Ressourcenpakete", text: "Wählen Sie Kostenpositionen, bei Bedarf ein Fahrzeug- und ein Personalprofil sowie eine optionale Risikoreserve. 'B2B-Transporterkosten' kombiniert etwa Transporter, Fahrer und anteilige Bürokosten. 'API-Integrationskosten' kombiniert Entwicklerzeit, Software und Gemeinkosten. Erst die Auftragsmengen ergeben daraus einen Auftragskostenbetrag.", href: "/pricing/cost-profiles" },
          { title: "Preisprofile: Regeln für den Verkaufspreis", text: "Wählen Sie Leistung und Kostenprofil sowie Kosten plus, Zielmarge, Festpreis oder Preisliste als Strategie. Für Sondervereinbarungen wählen Sie einen Kunden. 'Der Kunde zahlt' zeigt Festpreis, Kundensätze oder kostenbasierte Regel; das ist nicht immer bereits ein vollständiges Angebot.", href: "/pricing/profiles" },
          { title: "Simulator und Änderungsprotokoll", text: "Der Simulator kombiniert Profil und Auftragsmengen und zeigt geschätzte Kosten, Kundenpreis und Gewinn. Gespeicherte Szenarien sind Kalkulationen, keine gebuchten Aufträge, Verträge oder Rechnungen. Das Änderungsprotokoll zeigt Konfigurationsänderungen, keine tatsächlichen Ausgaben oder Zahlungen.", href: "/pricing/simulator" },
        ],
      },
      {
        id: "workflow",
        title: "Einrichten und Angebot berechnen",
        entries: [
          { title: "1. Beispieldaten ersetzen", text: "Tragen Sie Ihre echten Ausgaben, Fahrzeugdaten und Gehälter ein. Die mitgelieferten Beispielprofile erklären das System; ihre Kosten und Preise sind keine Empfehlung für Ihren Betrieb." },
          { title: "2. Gemeinsame Ausgaben verteilen", text: "Wählen Sie für monatliche oder jährliche Kosten einen Verteilungsschlüssel und einen jährlichen Umlage-Nenner. Beispiel: 200 €/Monat Buchhaltung = 2.400 €/Jahr. Bei 1.200 Lieferungen/Jahr sind das 2 € je Lieferung. Ein Auftrag mit 3 Lieferungen erhält 6 €. Verwenden Sie realistische Kapazitäten, nicht die gesamte Jahresausgabe pro Auftrag.", href: "/pricing/costs" },
          { title: "3. Kostenpaket der Leistung zusammenstellen", text: "Nur tatsächlich benötigte Ressourcen wählen. Gehalt nicht zusätzlich als Kostenposition erfassen, wenn es im Personalprofil steckt; Versicherung nicht doppelt zum Fahrzeug erfassen. Bei leistung übergreifenden Gemeinkosten muss die gemeinsame Kapazität im Nenner berücksichtigt werden, statt dieselbe Ausgabe in jeder Leistung vollständig umzulegen.", href: "/pricing/cost-profiles" },
          { title: "4. Kundenpreis festlegen", text: "Preisprofil erstellen, Leistung und Kostenpaket wählen, dann Zielmarge, Aufschlag, vereinbarten Festpreis oder Kundensätze eintragen. Bei Bedarf einen Mindestpreis setzen. Die Mindestmarge ist nur eine Warnschwelle und erhöht den Preis nicht.", href: "/pricing/profiles" },
          { title: "5. Auftrag oder Vertrag kalkulieren", text: "Profil speichern und 'Kundengesamtpreis berechnen' wählen oder im Simulator auswählen. Kunden für die Steuerbehandlung wählen. Strecke, Zeit und Mengen für einen klaren Umfang eintragen: eine Lieferung, eine Tour, das ganze Projekt oder einen Monat. Auftragsspezifische Kosten, Rabatte und Zuschläge ergänzen.", href: "/pricing/simulator" },
          { title: "6. Preis vor Vereinbarung prüfen", text: "Gesamtkosten, Nettopreis, Umsatzsteuer, Kundengesamtbetrag, Gewinn und Marge prüfen. Warnungen klären und Kostenzeilen kontrollieren. Manuelle Profilwahl hat Vorrang. Automatisch wird ein aktives, zeitlich gültiges Kundenprofil für die Leistung gewählt, dann ein allgemeines Leistungsprofil, dann ein Geschäftsbereichsprofil. Bei allgemeinen Profilen werden Standardprofile bevorzugt." },
        ],
      },
      {
        id: "profit",
        title: "Wo Sie den Gewinn einstellen",
        paragraphs: ["Unter Preisprofile ein Profil bearbeiten und die Strategie wählen. Alle folgenden Beträge verstehen sich ohne Umsatzsteuer und vor auftragsspezifischen Anpassungen."],
        table: {
          headers: ["Strategie", "Ihre Eingabe", "Beispiel mit 100 € Kosten"],
          rows: [
            ["Kosten plus", "Aufschlag in % auf die Kosten", "25% Aufschlag: 125 € Preis, 25 € Gewinn, 20% Marge."],
            ["Zielmarge", "Gewinn als Anteil des Verkaufspreises", "25% Marge: 100 € ÷ 0,75 = 133,33 € Preis, 33,33 € Gewinn."],
            ["Festpreis", "Vereinbarter Nettobetrag für den Kunden", "120 € Festpreis: 20 € Gewinn, 16,67% Marge."],
            ["Preisliste", "Kundensätze je Stunde, km, Tour oder anderer Einheit", "Grundgebühr + Mengen × Sätze. Gewinn = resultierender Nettopreis minus Kosten."],
          ],
        },
        entries: [
          { title: "Mindestpreis ist nicht Mindestmarge", text: "Der Mindestpreis hebt den berechneten Preis vor Auftragsanpassungen auf einen Geldbetrag an. Die Mindestmarge warnt nur, wenn der Gewinnanteil am Nettopreis zu niedrig ist. Rabatte oder manuelle Preisänderungen können den Endpreis weiter reduzieren." },
          { title: "Risikoreserve ist nicht Gewinn", text: "Die Reserve erhöht die geschätzte Kostenbasis vor Anwendung der Preisstrategie. Den gewünschten Gewinn stellen Sie getrennt ein. Erwarteter Gewinn ist eine Kalkulation auf dieser Kostenbasis, kein realisierter Buchhaltungsgewinn." },
        ],
      },
      {
        id: "quantities",
        title: "Welche Auftragsmengen nötig sind",
        paragraphs: ["Der Leistungsname allein bestimmt die Kosten nicht. Eine Lieferung kann 10 Minuten oder 3 Stunden dauern, ein API-Projekt 8 oder 200 Stunden. Das System leitet aus '1 Lieferung' oder '1 Projekt' keine Arbeitszeit ab."],
        table: {
          headers: ["Ressource", "Benötigte Mengen", "Wichtig"],
          rows: [
            ["Fahrzeug", "Kilometer für Streckenkosten, ggf. Tage für Zeitkosten", "Nur km: Versicherung, Steuer und Finanzierung werden je km umgelegt. Mit Tagen verwenden diese Zeitkosten stattdessen Tage."],
            ["Personal", "Stunden ODER Arbeitstage", "Stunden haben Vorrang. Tage werden laut Personalprofil in Stunden umgerechnet; beides wird nicht addiert."],
            ["Kostenpositionen", "Menge passend zur Umlageeinheit", "Je Lieferung benötigt Lieferungen, je Stunde benötigt Stunden. Gesamtbetrag wird einmal angesetzt."],
            ["Preisliste", "Menge für jede zutreffende Preiszeile", "Alle Zeilen werden addiert. Sind Stunden- und Tagessatz Alternativen, nicht beide Mengen eingeben oder getrennte Profile verwenden."],
            ["Wiederkehrender Vertrag", "Erwartete Mengen für den kalkulierten Zeitraum", "Für einen Monat dessen Stunden, Touren und Kosten eingeben. 'Monate = 1' leitet keine Personalstunden ab."],
          ],
        },
      },
      {
        id: "delivery-example",
        title: "Rechenbeispiel: B2B-Lieferung",
        paragraphs: ["Nur Beispielwerte, nicht Ihre konfigurierten Sätze. Umfang: eine Lieferung, 40 km und 2 Arbeitsstunden. Transporter-/Fahrerkostenprofil erstellen und mit einem Lieferpreisprofil mit 20% Zielmarge verknüpfen. Im Simulator Kilometer = 40, Stunden = 2 und Lieferungen = 1 eintragen."],
        table: {
          headers: ["Bestandteil", "Berechnung", "Betrag"],
          rows: [
            ["Fahrzeug", "40 km × angenommene 0,50 € Gesamtkosten/km", "20 €"],
            ["Fahrer", "2 Stunden × 25 € interne Kosten/Stunde", "50 €"],
            ["Gemeinkostenanteil", "Betriebsausgaben für diesen Auftrag", "10 €"],
            ["Geschätzte Gesamtkosten", "20 € + 50 € + 10 €", "80 €"],
            ["Kundenpreis ohne Umsatzsteuer", "80 € ÷ (1 − 20%)", "100 €"],
            ["Erwarteter Gewinn", "100 € − 80 €", "20 €"],
            ["Kundengesamtbetrag bei 19% deutscher USt", "100 € + 19 €", "119 €"],
          ],
        },
        entries: [{ title: "Vertragstouren und Subunternehmer", text: "Für eine Tour die gesamte Strecke und Arbeitszeit eingeben, nicht nur einen Stopp. Kaufen Sie eine Fremdleistung ein, deren Honorar als direkte Kosten aufnehmen. Eigene Fahrzeug- und Personalkosten nur ergänzen, wenn sie zusätzlich anfallen. Bei Monatsverträgen die erwarteten Monatssummen der Touren verwenden." }],
      },
      {
        id: "api-example",
        title: "Rechenbeispiel: API-Integrationsvertrag",
        paragraphs: ["Nur Beispielwerte. Umfang: das ganze Projekt mit geschätzten 40 Entwicklerstunden. API-Kostenprofil mit Entwicklerpersonal und Gemeinkosten erstellen, Preisprofil mit 25% Zielmarge verknüpfen. Stunden = 40, Projekte = 1 eintragen. Die Projektlizenz von 100 € als Zusatzkosten ergänzen, falls sie nicht bereits im Kostenprofil enthalten ist."],
        table: {
          headers: ["Bestandteil", "Berechnung", "Betrag"],
          rows: [
            ["Entwickler", "40 Stunden × 40 € interne Kosten/Stunde", "1.600 €"],
            ["Projektlizenz", "Einmalige Projektausgabe", "100 €"],
            ["Gemeinkostenanteil", "Software, Verwaltung und Büro", "300 €"],
            ["Geschätzte Projektkosten", "1.600 € + 100 € + 300 €", "2.000 €"],
            ["Kundenpreis ohne Umsatzsteuer", "2.000 € ÷ (1 − 25%)", "2.666,67 €"],
            ["Erwarteter Gewinn", "Nettopreis − geschätzte Kosten", "666,67 €"],
          ],
        },
        entries: [{ title: "Stundenabrechnung oder fester Projektumfang", text: "Preisliste für vereinbarte Stunden zu vereinbartem Satz nutzen. Festpreis wählen, wenn der Vertragsbetrag feststeht; dann prüft das System die geschätzte Rentabilität. Zielmarge verwenden, um ein Angebot aus den Kosten aufzubauen. Umsetzung und laufenden Support getrennt mit klar definiertem Umfang kalkulieren." }],
      },
      {
        id: "warnings",
        title: "Warnungen verstehen",
        entries: [
          { title: "Keine Personalkosten hinzugefügt", text: "Ein Personalprofil ist verknüpft, aber Stunden und Tage sind null. Arbeitszeit eintragen oder das Personalprofil entfernen, wenn es nicht benötigt wird. Fehlende Personalkosten lassen den Gewinn zu hoch erscheinen." },
          { title: "Keine Fahrzeugkosten hinzugefügt", text: "Ein Fahrzeug ist verknüpft, aber Kilometer und Tage sind null. Strecke und ggf. Tage eintragen. Tage allein erzeugen keine Kraftstoff- oder anderen Streckenkosten." },
          { title: "Marge unter Minimum oder negative Marge", text: "Der Preis ist im Verhältnis zu den Kosten zu niedrig. Marge = (Nettopreis − Kosten) ÷ Nettopreis × 100. Beispiel: 100 € Preis bei 288,60 € Kosten ergeben −188,6% Marge, also 188,60 € Verlust. Kosten prüfen, Festpreis/Sätze erhöhen oder Kosten plus/Zielmarge verwenden. Die Warnschwelle zu erhöhen beseitigt keinen Verlust." },
          { title: "Kostenposition übersprungen: Nenner fehlt", text: "Eine wiederkehrende Ausgabe benötigt die jährliche Verteilungsmenge, etwa Kilometer oder produktive Stunden pro Jahr. Einen realistischen Nenner eintragen; sonst bleibt die Ausgabe unberücksichtigt." },
          { title: "Kein Kostenprofil oder keine Kostendaten", text: "Eine Preisliste kann ohne Kostenpaket einen Kundenpreis liefern, der Gewinn ist dann aber unvollständig. Kosten plus und Zielmarge benötigen Kostendaten. Ressourcen verknüpfen und Auftragsmengen eintragen." },
          { title: "EU-Kunde ohne USt-ID", text: "Rechnungsland, Unternehmereigenschaft und USt-ID prüfen, bevor Sie Reverse Charge anwenden. Die Länderregel validiert weder die USt-ID noch die rechtliche Berechtigung." },
        ],
      },
      {
        id: "tax-and-records",
        title: "Umsatzsteuer, Rechnungen und Grenzen",
        paragraphs: [
          "Die aktuelle Länderregel wendet für Deutschland deutsche Umsatzsteuer an (normalerweise 19%), für andere EU-Länder wie Irland Reverse Charge und für Drittländer wie UK und VAE keine deutsche Umsatzsteuer. Eine manuelle Steuerbehandlung am Kunden hat Vorrang. Ohne Kunden oder bei leerem Land gilt deutsche Umsatzsteuer. Prüfen Sie die rechtliche Behandlung je Leistung und Kunde; dies ist keine vollständige Steuerprüfung.",
          "Umsatzsteuer kommt nach dem Nettopreis hinzu und ist kein Gewinn. Der Simulator zeigt Steuerhinweis und Kundengesamtbetrag für den gewählten Kunden.",
          "Rechnungsnummern enthalten ein Leistungskürzel, etwa SOFLOTT-DLV-2026-0007 für Lieferungen. Andere Kürzel unterscheiden Touren, Subunternehmertätigkeit und digitale Leistungen. Eine Berechnung oder ein gespeichertes Szenario erzeugt keine Rechnung und aktiviert keinen Vertrag.",
          "Derzeit verwendet nur der Direktlieferungs-Buchungsablauf die Engine automatisch zur Auftragspreisberechnung. Andere Leistungen lassen sich konfigurieren und kalkulieren; daraus folgt noch kein vollständiger Vertrags- oder wiederkehrender Abrechnungsablauf. Der bisherige Liefertarif bleibt Rückfalloption ohne passendes Engine-Profil.",
          "Kosten und Gewinn sind Schätzungen, keine Ist-Kostenrechnung. Annahmen regelmäßig prüfen. Ein Kostenprofil wird von allen verknüpften Preisprofilen gemeinsam genutzt; Änderungen können künftige Berechnungen beeinflussen. Historische Kalkulationen speichern ihre Aufschlüsselung, das Änderungsprotokoll dokumentiert Konfigurationsänderungen.",
        ],
      },
    ],
  },
};
