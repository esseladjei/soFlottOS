// ---------------------------------------------------------------------------
// GERMAN legal pages: privacy policy, terms and cookie page.
//
// The privacy policy must describe what the system really does. When a new
// service, tracker or data flow is added, update the matching section here and
// the English twin in `legal-en.ts` in the same change. The 20 sections follow
// the order required by FeatureSpecs/Cookie_PrivacySpec.txt.
// ---------------------------------------------------------------------------

import type { MarketingContent } from "@/content/marketing/types";

export const legalPagesDe: Pick<MarketingContent["pages"], "legal/privacy" | "legal/terms" | "legal/cookies"> = {
  "legal/privacy": {
    label: "Datenschutz",
    meta: {
      title: "Datenschutzerklärung",
      description:
        "Wie die soFlott UG (haftungsbeschränkt) personenbezogene Daten auf der Website, im Kundenportal und bei der Auftragsabwicklung verarbeitet, und welche Rechte Sie haben.",
    },
    hero: {
      eyebrow: "Rechtliches",
      title: "Datenschutzerklärung",
      intro:
        "Hier erfahren Sie, welche personenbezogenen Daten wir zu welchem Zweck verarbeiten, auf welcher Rechtsgrundlage, wie lange wir sie speichern und wie Sie Ihre Rechte ausüben.",
    },
    blocks: [
      {
        kind: "text",
        toc: "Inhalt",
        numbered: true,
        paragraphs: [
          "Wir verarbeiten nur die personenbezogenen Daten, die wir für den jeweiligen Zweck brauchen. Für jede Verarbeitung nennen wir Datenkategorien, Zweck, Rechtsgrundlage, Empfänger, Speicherdauer und gegebenenfalls Übermittlungen in Drittländer. Optionale Technologien zur Reichweitenmessung und Werbung setzen wir erst nach Ihrer Einwilligung ein.",
        ],
        sections: [
          {
            title: "Verantwortlicher und Kontakt",
            paragraphs: [
              "Verantwortlich im Sinne der DSGVO ist die soFlott UG (haftungsbeschränkt), Mandichostr. 1a, 86504 Merching. soFlott Express und soFlott Digital sind Geschäftsbereiche dieser Gesellschaft. Weitere Angaben finden Sie im Impressum.",
              "Für Fragen zum Datenschutz und zur Ausübung Ihrer Rechte erreichen Sie uns unter info@soflott.de. Die Geschäftsbereiche erreichen Sie zusätzlich unter dispatch@soflott.de (Express) und digital@soflott.de (Digital).",
            ],
            links: [{ label: "Impressum", page: "legal/imprint" }],
          },
          {
            title: "Hosting und Server-Logdateien",
            paragraphs: [
              "Beim Aufruf unserer Website übermittelt Ihr Browser technische Daten an den Server. Sie sind erforderlich, um die Seiten auszuliefern und die Sicherheit und Stabilität zu gewährleisten.",
            ],
            items: [
              "Datenkategorien: IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse (URL), übertragene Datenmenge, Statuscode, Browser und Betriebssystem, Referrer-URL.",
              "Zweck: Bereitstellung der Website, Abwehr von Angriffen, Fehleranalyse.",
              "Rechtsgrundlage: berechtigtes Interesse an einem sicheren und funktionsfähigen Webauftritt (Art. 6 Abs. 1 lit. f DSGVO).",
              "Empfänger: Hosting-Anbieter der Website (Vercel Inc.) und des Backends (Render Services, Inc.) als Auftragsverarbeiter.",
              "Speicherdauer: Logdateien werden nur so lange gespeichert, wie es für Sicherheit und Fehleranalyse erforderlich ist, und danach gelöscht oder anonymisiert.",
              "Drittlandübermittlung: möglich, siehe Abschnitt „Internationale Datenübermittlungen“.",
            ],
          },
          {
            title: "Nutzung der Website und technische Informationen",
            paragraphs: [
              "Schriftarten liefern wir von unserem eigenen Server aus. Es werden dafür keine Inhalte externer Schriftarten-Dienste geladen.",
              "Ohne Ihre Einwilligung setzen wir auf der Website nur technisch notwendige Speichertechnologien ein (siehe Abschnitt „Cookies und Tracking-Technologien“). Reichweitenmessung, Conversion-Messung und Werbung finden erst statt, wenn Sie in die jeweilige Kategorie eingewilligt haben.",
              "Die Rechtsgrundlage für technisch notwendige Zugriffe auf Ihr Endgerät ist § 25 Abs. 2 Nr. 2 TDDDG, für die anschließende Verarbeitung Art. 6 Abs. 1 lit. f DSGVO. Für optionale Technologien ist es Ihre Einwilligung nach § 25 Abs. 1 TDDDG und Art. 6 Abs. 1 lit. a DSGVO.",
            ],
          },
          {
            title: "Kontaktformulare und Anfragen",
            paragraphs: [
              "Unsere Anfrage- und Kontaktformulare speichern keine Daten auf dieser Website. Beim Absenden öffnet sich Ihr E-Mail-Programm mit einer vorbereiteten Nachricht. Erst wenn Sie diese E-Mail senden, erhalten wir Ihre Angaben. Wenn Sie uns direkt schreiben oder anrufen, verarbeiten wir die Daten ebenso.",
            ],
            items: [
              "Datenkategorien: Name, Firma, E-Mail-Adresse, Telefonnummer, Inhalt Ihrer Anfrage.",
              "Zweck: Beantwortung der Anfrage, Angebotserstellung, Vertragsanbahnung.",
              "Rechtsgrundlage: vorvertragliche Maßnahmen auf Ihre Anfrage (Art. 6 Abs. 1 lit. b DSGVO), sonst berechtigtes Interesse an der Beantwortung von Anfragen (Art. 6 Abs. 1 lit. f DSGVO).",
              "Empfänger: E-Mail-Dienstleister, soweit wir Ihre Nachricht darüber empfangen und beantworten.",
              "Speicherdauer: Wir löschen Anfragen, wenn sie erledigt sind und kein Vertrag zustande kommt. Kommt ein Vertrag zustande, gelten die Aufbewahrungsfristen im Abschnitt „Speicherdauer und Löschung“.",
            ],
          },
          {
            title: "Registrierung und Kundenkonto",
            paragraphs: [
              "Für die Nutzung des Kundenportals legen Sie ein Konto an. Dabei verarbeiten wir die Daten, die für Anmeldung und Vertragsabwicklung nötig sind.",
            ],
            items: [
              "Datenkategorien: Name, Firma, E-Mail-Adresse, Telefonnummer, Passwort (nur als gesicherter Hash).",
              "Zweck: Bereitstellung des Kundenkontos, Authentifizierung, Passwort-Zurücksetzung per E-Mail, Kommunikation zum Konto.",
              "Rechtsgrundlage: Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO); Kontosicherheit auf Grundlage unseres berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO).",
              "Empfänger: Backend- und Datenbank-Hosting (Render), E-Mail-Versand (Resend) als Auftragsverarbeiter.",
              "Speicherdauer: bis zur Löschung des Kontos, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
              "Nach der Anmeldung wird ein Sitzungscookie gesetzt, das Sie angemeldet hält. Es ist technisch notwendig.",
            ],
          },
          {
            title: "Aufträge und Buchungen",
            paragraphs: [
              "Wenn Sie einen Transportauftrag erteilen, verarbeiten wir die Daten, die wir zur Durchführung der Leistung benötigen.",
            ],
            items: [
              "Datenkategorien: Auftraggeber- und Kontaktdaten, Frachtkategorie und Gewicht, Abhol- und Zieladresse, Ansprechpartner und Telefonnummern an beiden Adressen, Hinweise zur Zustellung, Zeitstempel und Status des Auftrags, Preis, Zahlungsart.",
              "Zweck: Annahme, Planung, Durchführung und Abrechnung des Auftrags, Information über den Auftragsstatus.",
              "Rechtsgrundlage: Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO); Aufbewahrung nach Handels- und Steuerrecht (Art. 6 Abs. 1 lit. c DSGVO).",
              "Empfänger: eingesetzte Fahrer, Backend- und Datenbank-Hosting (Render), E-Mail- und SMS-Versand, Routenberechnung (siehe Abschnitt „Externe Dienstleister“).",
              "Speicherdauer: siehe Abschnitt „Speicherdauer und Löschung“.",
            ],
          },
          {
            title: "Abholung und Zustellung",
            paragraphs: [
              "Für die Zustellung erhalten die eingesetzten Fahrer die Daten, die sie dafür brauchen. Bei der Übergabe erfassen wir einen digitalen Zustellnachweis.",
            ],
            items: [
              "Datenkategorien: Abhol- und Zieladresse, Ansprechpartner und Telefonnummer, Zustellhinweise, Name der empfangenden Person, Unterschrift, Standort des Fahrer-Geräts (GPS) zum Zeitpunkt der Unterschrift, Zeitpunkt der Zustellung.",
              "Zweck: Durchführung der Zustellung, Nachweis der ordnungsgemäßen Übergabe, Klärung von Reklamationen.",
              "Rechtsgrundlage: Vertragserfüllung gegenüber unserem Auftraggeber (Art. 6 Abs. 1 lit. b DSGVO) und berechtigtes Interesse an einem Zustellnachweis (Art. 6 Abs. 1 lit. f DSGVO).",
              "Empfänger: Auftraggeber (Zustellnachweis), Fahrer, Backend- und Datenbank-Hosting (Render).",
              "Speicherdauer: Zustellnachweise bewahren wir so lange auf, wie Reklamationen und Ansprüche aus dem Auftrag realistisch geltend gemacht werden können, höchstens jedoch bis zum Ablauf der gesetzlichen Aufbewahrungsfristen.",
              "Information der Empfänger (Art. 14 DSGVO): Empfängerinnen und Empfänger einer Sendung haben sich nicht bei uns registriert. Wir erhalten ihre Daten von unserem Auftraggeber. Sie werden ausschließlich zur Zustellung und zum Zustellnachweis verwendet. Verantwortlich ist die soFlott UG, die Kontaktdaten stehen oben. Empfänger haben dieselben Rechte wie alle betroffenen Personen.",
            ],
          },
          {
            title: "Geschäftskunden",
            paragraphs: [
              "Bei Geschäftskunden verarbeiten wir Angaben zum Unternehmen und zu den handelnden Personen.",
            ],
            items: [
              "Datenkategorien: Firmenname, Geschäftsadresse, Kontaktperson mit Geschäftskontaktdaten, Umsatzsteuer-Identifikationsnummer, soweit erforderlich, Vertrags-, Rechnungs- und Leistungsdaten.",
              "Zweck: Angebotserstellung, Vertragsdurchführung, Rechnungsstellung, Kundenbetreuung.",
              "Rechtsgrundlage: Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO), gesetzliche Pflichten (Art. 6 Abs. 1 lit. c DSGVO).",
              "Empfänger: Backend- und Datenbank-Hosting (Render), E-Mail-Versand (Resend); gegebenenfalls Steuerberater und Behörden.",
              "Speicherdauer: siehe Abschnitt „Speicherdauer und Löschung“.",
            ],
          },
          {
            title: "Zahlungsabwicklung",
            paragraphs: [
              "Die Rechnung erzeugen wir selbst. Bezahlen können Sie per Banküberweisung oder per PayPal. Wir binden derzeit keinen Zahlungsdienstleister in unsere Website ein, und Zahlungsdaten wie Kartennummern werden auf unseren Systemen nicht erfasst.",
            ],
            items: [
              "Datenkategorien: Rechnungsdaten, Rechnungsnummer, Zahlungsart, Zahlungsstatus und Zahlungsreferenz, bei Überweisung die auf dem Kontoauszug sichtbaren Angaben.",
              "Zweck: Rechnungsstellung, Zahlungsabgleich, Buchführung.",
              "Rechtsgrundlage: Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO), gesetzliche Pflichten (Art. 6 Abs. 1 lit. c DSGVO).",
              "Empfänger: Ihre und unsere Bank, bei Zahlung per PayPal PayPal (Europe) S.à r.l. et Cie, S.C.A. als eigener Verantwortlicher nach dessen Datenschutzerklärung; Steuerberater.",
              "Speicherdauer: Rechnungen und Buchungsbelege unterliegen den gesetzlichen Aufbewahrungsfristen.",
            ],
          },
          {
            title: "Google Analytics",
            paragraphs: [
              "Wenn wir Google Analytics 4 einsetzen, geschieht das nur nach Ihrer Einwilligung in die Kategorie „Statistik & Analyse“. Ohne diese Einwilligung wird das Skript weder geladen noch werden Daten an Google übertragen. Wir nutzen den Google Consent Mode v2: Vor Ihrer Entscheidung sind alle Einwilligungssignale auf „abgelehnt“ gesetzt.",
            ],
            items: [
              "Datenkategorien: pseudonyme Nutzerkennung (Cookies „_ga“ und „_ga_<ID>“), aufgerufene Seiten, Interaktionen, ungefährer Standort, Geräte- und Browserdaten. IP-Adressen werden in Google Analytics 4 nach Angaben von Google nicht protokolliert.",
              "Zweck: Reichweitenmessung und Verbesserung unseres Angebots.",
              "Rechtsgrundlage: Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Sie können sie jederzeit widerrufen.",
              "Empfänger: Google Ireland Limited; Daten können an Google LLC (USA) übermittelt werden.",
              "Speicherdauer: Cookies bis zu 2 Jahre, sofern Sie nicht vorher widerrufen. Ereignisdaten werden in Google Analytics höchstens 14 Monate aufbewahrt.",
            ],
          },
          {
            title: "Google Ads und weitere Werbe-Technologien",
            paragraphs: [
              "Wenn wir Werbung schalten, können wir den Erfolg messen. Dafür kommen Google Ads (Conversion-Messung und Remarketing), das Meta Pixel (Facebook und Instagram) und das LinkedIn Insight Tag in Betracht. Sie werden ausschließlich geladen, wenn sie technisch eingerichtet sind und Sie in die Kategorie „Marketing & Werbung“ eingewilligt haben.",
            ],
            items: [
              "Datenkategorien: Kennungen aus Cookies, aufgerufene Seiten, Zeitpunkt und Art einer Conversion (zum Beispiel eine Anfrage), Geräte- und Browserdaten, IP-Adresse.",
              "Zweck: Messung von Werbeerfolg und Ansprache von Besuchern, die sich bereits für uns interessiert haben.",
              "Rechtsgrundlage: Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Sie können sie jederzeit widerrufen.",
              "Empfänger: Google Ireland Limited, Meta Platforms Ireland Limited, LinkedIn Ireland Unlimited Company. Es kann zu Übermittlungen an Muttergesellschaften in den USA kommen.",
              "Speicherdauer: je nach Dienst bis zu 90 Tage (Google Ads, Meta) beziehungsweise bis zu 6 Monate (LinkedIn).",
              "Mit Google Consent Mode v2 übermitteln wir die Signale „ad_storage“, „ad_user_data“ und „ad_personalization“ erst nach Ihrer Einwilligung als „erteilt“.",
            ],
          },
          {
            title: "Externe Dienstleister",
            paragraphs: [
              "Wir setzen die folgenden Dienstleister ein, die in unserem Auftrag Daten verarbeiten oder Inhalte bereitstellen:",
            ],
            items: [
              "Vercel Inc. – Hosting der Website. Wenn Sie in die Kategorie „Statistik & Analyse“ eingewilligt haben, nutzen wir außerdem Vercel Web Analytics zur aggregierten Reichweitenmessung. Dabei werden keine Cookies gesetzt.",
              "Render Services, Inc. – Hosting der Programmierschnittstelle (API) und der PostgreSQL-Datenbank mit Konto-, Auftrags- und Rechnungsdaten.",
              "Resend – Versand von Transaktions-E-Mails, zum Beispiel Passwort-Zurücksetzung, Auftrags- und Rechnungsbenachrichtigungen. Dabei werden E-Mail-Adresse, Betreff und Inhalt der Nachricht verarbeitet.",
              "Twilio – optionaler Versand von SMS- oder WhatsApp-Benachrichtigungen zum Auftragsstatus, sofern aktiviert. Dabei werden Telefonnummer und Nachrichtentext verarbeitet.",
              "OpenRouteService (HeiGIT) und Nominatim (OpenStreetMap Foundation) – Umwandlung von Adressen in Koordinaten und Berechnung von Strecke und Fahrzeit für die Preisberechnung. Dabei werden die Abhol- und Zieladressen übermittelt.",
              "OpenStreetMap – Kartenkacheln für die Routenansicht im Kundenportal. Beim Laden einer Karte wird Ihre IP-Adresse an die Kachelserver von OpenStreetMap übertragen.",
              "Rechtsgrundlage ist jeweils Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) beziehungsweise Art. 6 Abs. 1 lit. f DSGVO (effizienter und sicherer Betrieb). Analysedienste setzen wir nur mit Einwilligung ein.",
            ],
          },
          {
            title: "Auftragsverarbeitungsverträge",
            paragraphs: [
              "Mit Dienstleistern, die personenbezogene Daten in unserem Auftrag verarbeiten, schließen wir Auftragsverarbeitungsverträge (AVV) nach Art. 28 DSGVO ab oder nutzen deren vertraglich zugesicherte Standardbedingungen. Das betrifft insbesondere Website-, Backend- und Datenbank-Hosting sowie E-Mail- und SMS-Versand. Wir prüfen vor dem Einsatz eines neuen Dienstleisters, ob ein AVV erforderlich ist, und überprüfen die Verträge regelmäßig.",
              "Werbe- und Analysedienste können nach der jeweiligen Vertragskonstellation eigenverantwortlich oder gemeinsam mit uns verantwortlich sein. Wir nutzen sie nur auf Basis Ihrer Einwilligung.",
            ],
          },
          {
            title: "Internationale Datenübermittlungen",
            paragraphs: [
              "Einige unserer Dienstleister haben ihren Sitz in den USA oder gehören zu Konzernen mit Sitz dort. Eine Übermittlung personenbezogener Daten in Drittländer ist deshalb nicht ausgeschlossen. Ein Server in der EU löst nicht automatisch alle Anforderungen, denn auch Zugriffe aus Drittländern können eine Übermittlung darstellen.",
              "Wir stützen Übermittlungen auf einen Angemessenheitsbeschluss der EU-Kommission, etwa das EU-US Data Privacy Framework, oder auf EU-Standardvertragsklauseln mit zusätzlichen Schutzmaßnahmen (Art. 45, 46 DSGVO). Eine Kopie der Garantien können Sie über die oben genannten Kontaktdaten anfordern. Übermittlungen im Rahmen von Analyse und Werbung erfolgen nur nach Ihrer Einwilligung (Art. 49 Abs. 1 lit. a DSGVO, soweit keine anderen Garantien greifen).",
            ],
          },
          {
            title: "Speicherdauer und Löschung",
            paragraphs: [
              "Wir speichern personenbezogene Daten nicht länger, als es für den jeweiligen Zweck nötig ist. Es gibt keine einheitliche Frist, sondern je nach Datenkategorie unterschiedliche Fristen:",
            ],
            items: [
              "Anfragen ohne Vertragsabschluss: Löschung nach Erledigung der Anfrage.",
              "Kundenkonto: bis zur Löschung des Kontos.",
              "Aufträge und Zustellnachweise: bis zum Ablauf der Fristen für Reklamationen und Ansprüche, höchstens bis zum Ende der gesetzlichen Aufbewahrungsfristen.",
              "Rechnungen und Buchungsbelege: je nach Dokumentart sechs, acht oder zehn Jahre nach den handels- und steuerrechtlichen Vorschriften (insbesondere § 147 AO und § 257 HGB). Diese Aufbewahrung gilt auch dann, wenn Sie die Löschung Ihres Kontos verlangen.",
              "Nachweise zu Ihrer Cookie-Auswahl: 3 Jahre, danach werden sie automatisch gelöscht.",
              "Datenschutzanfragen: nach Abschluss 3 Jahre als Nachweis, danach automatische Löschung.",
              "Sicherheitsprotokolle: nur so lange, wie es für die Sicherheit erforderlich ist.",
            ],
          },
          {
            title: "Datensicherheit",
            paragraphs: [
              "Wir treffen technische und organisatorische Maßnahmen, die dem Risiko angemessen sind. Dazu gehören unter anderem:",
            ],
            items: [
              "Verschlüsselte Übertragung (HTTPS) auf der gesamten Website und für alle Schnittstellen.",
              "Passwörter werden nur als gesicherter Hash gespeichert.",
              "Rollenbasierte Zugriffsrechte und Authentifizierung für alle geschützten Bereiche.",
              "Begrenzung der Anfragen (Rate Limiting) und Validierung von Eingaben.",
              "Zugriffsbeschränkungen auf die Produktionsdatenbank und geschützte Zugangsdaten.",
              "Wir protokollieren keine Passwörter, Zugriffstoken oder Zahlungskartendaten.",
              "Bei Datenschutzverletzungen prüfen wir unverzüglich die Meldepflichten (Art. 33, 34 DSGVO), einschließlich der Frist von 72 Stunden.",
            ],
          },
          {
            title: "Ihre Rechte",
            paragraphs: [
              "Sie haben uns gegenüber die folgenden Rechte in Bezug auf Ihre personenbezogenen Daten. Nutzen Sie zur Ausübung das Anfrageformular am Ende dieser Seite oder schreiben Sie uns an info@soflott.de. Wir beantworten Anfragen innerhalb eines Monats. Zur Absicherung können wir Sie bitten, Ihre Identität zu bestätigen. Das Formular verarbeitet Ihre E-Mail-Adresse, optional Ihren Namen und Ihre Nachricht ausschließlich zur Bearbeitung der Anfrage (Art. 6 Abs. 1 lit. c DSGVO).",
            ],
            items: [
              "Auskunft (Art. 15 DSGVO) und Kopie Ihrer Daten.",
              "Berichtigung unrichtiger Daten (Art. 16 DSGVO).",
              "Löschung (Art. 17 DSGVO), soweit keine Aufbewahrungspflichten entgegenstehen.",
              "Einschränkung der Verarbeitung (Art. 18 DSGVO).",
              "Datenübertragbarkeit (Art. 20 DSGVO).",
              "Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO).",
              "Widerruf einer Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).",
            ],
            links: [{ label: "Zum Anfrageformular", href: "#privacy-request" }],
          },
          {
            title: "Beschwerderecht bei einer Aufsichtsbehörde",
            paragraphs: [
              "Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Für uns zuständig ist das Bayerische Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach, www.lda.bayern.de. Sie können sich auch an die Aufsichtsbehörde an Ihrem Wohnort wenden.",
            ],
          },
          {
            title: "Cookies und Tracking-Technologien",
            paragraphs: [
              "Beim ersten Besuch der Website fragen wir Sie, welche Kategorien Sie zulassen möchten. Bis dahin werden nur technisch notwendige Speichertechnologien verwendet.",
            ],
            items: [
              "Notwendig (immer aktiv): „soflott_consent“ speichert Ihre Auswahl für 6 Monate; „soflott_session“ hält Sie im Kundenportal angemeldet.",
              "Komfort & Präferenzen (nur mit Einwilligung): „soflott_locale“ merkt sich Ihre Sprache für ein Jahr. Ohne Einwilligung gilt die Sprache nur für die aktuelle Sitzung.",
              "Statistik & Analyse (nur mit Einwilligung): Vercel Web Analytics (ohne Cookies) und, falls eingerichtet, Google Analytics 4.",
              "Marketing & Werbung (nur mit Einwilligung): Google Ads, Meta Pixel und LinkedIn Insight Tag, falls eingerichtet.",
              "Die genaue Liste mit Anbieter, Zweck und Laufzeit finden Sie auf der Seite Cookie-Einstellungen. Sie zeigt nur Technologien, die auf dieser Website tatsächlich vorkommen können.",
            ],
            links: [{ label: "Cookie-Einstellungen", page: "legal/cookies" }],
          },
          {
            title: "Einwilligungsverwaltung und Widerruf",
            paragraphs: [
              "Ihre Auswahl können Sie jederzeit ändern. Rufen Sie dafür im Fußbereich jeder Seite „Cookie-Einstellungen“ auf. Ablehnen ist genauso einfach wie Zustimmen, und die Einwilligung ist freiwillig. Die Nutzung der Website hängt nicht davon ab.",
              "Wenn Sie eine Einwilligung widerrufen, löschen wir die zugehörigen Cookies, soweit wir sie entfernen können, und laden die Seite neu, damit keine Skripte weiterlaufen. Cookies, die ein Drittanbieter auf dessen Domain gesetzt hat, kann nur der Anbieter selbst oder Ihr Browser löschen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt unberührt.",
              "Zum Nachweis Ihrer Entscheidung speichern wir einen Datensatz: zufällige Einwilligungs-ID, Version des Einwilligungstextes, Art der Entscheidung, Auswahl je Kategorie und Zeitpunkt. Wir speichern dabei weder Ihre IP-Adresse noch Ihren Browsertyp. Rechtsgrundlage ist unsere Pflicht, eine Einwilligung nachweisen zu können (Art. 6 Abs. 1 lit. c i. V. m. Art. 7 Abs. 1 DSGVO), sowie unser berechtigtes Interesse an der Beweissicherung (Art. 6 Abs. 1 lit. f DSGVO). Speicherdauer: 3 Jahre. Ändern wir die Einwilligungstexte wesentlich, fragen wir Sie erneut.",
            ],
            links: [{ label: "Cookie-Einstellungen öffnen", page: "legal/cookies" }],
          },
        ],
      },
      { kind: "privacyRequest" },
      {
        kind: "notice",
        title: "Stand und Änderungen",
        text: "Wir passen diese Erklärung an, wenn sich unsere Verarbeitungen ändern, zum Beispiel bei neuen Diensten oder Technologien. Es gilt die jeweils hier veröffentlichte Fassung. Ob die Angaben vollständig sind, prüfen wir vor dem Livegang rechtlich.",
      },
    ],
  },

  "legal/terms": {
    label: "AGB",
    meta: {
      title: "Allgemeine Geschäftsbedingungen",
      description:
        "Allgemeine Geschäftsbedingungen der soFlott UG (haftungsbeschränkt) für Kurier- und Transportleistungen sowie digitale Leistungen gegenüber Unternehmen.",
    },
    hero: {
      eyebrow: "Rechtliches",
      title: "Allgemeine Geschäftsbedingungen",
      intro:
        "Grundlage unserer Zusammenarbeit mit Geschäftskunden. Individuelle Vereinbarungen im Angebot oder Vertrag gehen diesen Bedingungen vor.",
    },
    blocks: [
      {
        kind: "notice",
        title: "Entwurf",
        text: "Diese Bedingungen sind ein Entwurf und werden vor der Veröffentlichung rechtlich geprüft. Maßgeblich sind immer das konkrete Angebot und der geschlossene Vertrag.",
      },
      {
        kind: "text",
        toc: "Inhalt",
        numbered: true,
        paragraphs: [
          "Diese Allgemeinen Geschäftsbedingungen gelten für die Leistungen der soFlott UG (haftungsbeschränkt), Mandichostr. 1a, 86504 Merching (nachfolgend „soFlott“), einschließlich der Geschäftsbereiche soFlott Express und soFlott Digital.",
        ],
        sections: [
          {
            title: "Geltungsbereich",
            paragraphs: [
              "Unsere Leistungen richten sich an Unternehmer im Sinne von § 14 BGB. Entgegenstehende oder abweichende Bedingungen des Kunden gelten nur, wenn wir ihnen ausdrücklich zugestimmt haben.",
              "Schließen wir im Einzelfall einen Vertrag mit einem Verbraucher, informieren wir gesondert über bestehende Rechte, einschließlich eines etwaigen Widerrufsrechts.",
            ],
          },
          {
            title: "Vertragsschluss",
            paragraphs: [
              "Unsere Darstellungen auf der Website sind unverbindlich. Ein Vertrag kommt zustande, wenn wir ein Angebot schriftlich oder in Textform bestätigen oder die Leistung mit Zustimmung des Kunden beginnen. Aufträge, die über das Kundenportal erteilt werden, werden erst mit unserer Bestätigung verbindlich.",
            ],
          },
          {
            title: "Leistungen",
            paragraphs: [
              "Art, Umfang und Zeitrahmen der Leistung ergeben sich aus dem Angebot oder der Auftragsbestätigung. Fristen und Zeitfenster gelten nur, wenn wir sie ausdrücklich als verbindlich bestätigt haben. Wir dürfen Subunternehmer einsetzen.",
            ],
          },
          {
            title: "Mitwirkungspflichten des Kunden",
            paragraphs: [
              "Der Kunde stellt vollständige und richtige Angaben bereit, insbesondere zu Abhol- und Zieladresse, Ansprechpartnern, Gewicht und Art der Sendung sowie besonderen Anforderungen. Er sorgt für eine ordnungsgemäße und transportsichere Verpackung und stellt sicher, dass die Sendung zum Transport zulässig ist. Gefahrgut und andere besonders regulierte Güter sind nur nach vorheriger Vereinbarung zulässig.",
            ],
          },
          {
            title: "Preise und Zahlung",
            paragraphs: [
              "Es gelten die im Angebot oder in der Auftragsbestätigung genannten Preise zuzüglich der gesetzlichen Umsatzsteuer. Wir stellen eine Rechnung aus. Sofern nichts anderes vereinbart ist, ist sie innerhalb von 14 Tagen nach Rechnungsdatum ohne Abzug zu zahlen, per Banküberweisung oder per PayPal.",
            ],
          },
          {
            title: "Haftung",
            paragraphs: [
              "Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von Leben, Körper oder Gesundheit. Bei der Verletzung wesentlicher Vertragspflichten durch leichte Fahrlässigkeit haften wir begrenzt auf den vorhersehbaren, vertragstypischen Schaden. Im Übrigen ist die Haftung ausgeschlossen, soweit gesetzlich zulässig.",
              "Für Transportleistungen gelten ergänzend die gesetzlichen Vorschriften, insbesondere §§ 407 ff. HGB, soweit im Einzelvertrag nichts anderes vereinbart ist. Zwingende gesetzliche Haftungsregelungen bleiben unberührt.",
            ],
          },
          {
            title: "Datenschutz",
            paragraphs: [
              "Wie wir personenbezogene Daten verarbeiten, steht in unserer Datenschutzerklärung.",
            ],
            links: [{ label: "Datenschutzerklärung", page: "legal/privacy" }],
          },
          {
            title: "Schlussbestimmungen",
            paragraphs: [
              "Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand der Sitz von soFlott, soweit gesetzlich zulässig. Sollte eine Bestimmung unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.",
            ],
          },
        ],
      },
    ],
  },

  "legal/cookies": {
    label: "Cookie-Einstellungen",
    meta: {
      title: "Cookie-Einstellungen",
      description:
        "Verwalten Sie, welche Cookies und Tracking-Technologien die soFlott-Website nutzen darf, und ändern oder widerrufen Sie Ihre Einwilligung jederzeit.",
    },
    hero: {
      eyebrow: "Datenschutz",
      title: "Cookie-Einstellungen",
      intro:
        "Entscheiden Sie selbst, welche optionalen Technologien wir nutzen dürfen. Sie können Ihre Auswahl hier jederzeit ändern.",
    },
    blocks: [
      { kind: "cookieSettings" },
      {
        kind: "text",
        title: "Mehr zum Thema",
        paragraphs: [
          "Technisch notwendige Cookies setzen wir immer, weil die Website ohne sie nicht sicher funktioniert. Alle anderen Kategorien sind aus, bis Sie sie aktivieren. Ihre Auswahl wird sechs Monate lang gespeichert, danach fragen wir erneut.",
        ],
        sections: [
          {
            title: "Wie wir damit umgehen",
            paragraphs: [
              "Alle Informationen zu Zweck, Rechtsgrundlage, Empfängern und Speicherdauer stehen in der Datenschutzerklärung. Sie können außerdem Auskunft über die zu Ihrer Entscheidung gespeicherten Daten verlangen.",
            ],
            links: [{ label: "Datenschutzerklärung", page: "legal/privacy" }],
          },
        ],
      },
    ],
  },
};
