// ---------------------------------------------------------------------------
// GERMAN marketing copy (default language).
//
// Must contain exactly the same pages and fields as `en.ts` - TypeScript
// enforces this. Read the content rules at the top of `types.ts` before
// editing: no invented numbers, clients, certifications or service promises.
// ---------------------------------------------------------------------------

import type { MarketingContent } from "@/content/marketing/types";

export const de: MarketingContent = {
  common: {
    skipToContent: "Zum Inhalt springen",
    languageLabel: "Sprache wählen",
    breadcrumbLabel: "Brotkrumennavigation",
    phone: "Telefon",
    email: "E-Mail",
    address: "Adresse",
    divisionOf: "Ein Geschäftsbereich der soFlott UG (haftungsbeschränkt)",
    legalDraft:
      "Entwurf – diese Seite wird vor dem Livegang rechtlich geprüft und finalisiert.",
    toBeCompleted: "wird ergänzt",
  },

  nav: {
    ariaLabel: "Hauptnavigation",
    menuLabel: "Menü öffnen",
    items: ["express", "digital", "about", "contact"],
    login: "Kunden-Login",
    cta: { label: "Kontakt aufnehmen", page: "contact" },
  },

  divisions: {
    express: {
      name: "soFlott Express",
      tagline: "Kurier & Logistik",
      ariaLabel: "Navigation soFlott Express",
      items: [
        "express",
        "express/direct-b2b-delivery",
        "express/logistics-subcontracting",
        "express/contracted-delivery-routes",
        "express/service-areas",
        "express/how-it-works",
        "express/contact",
      ],
      cta: { label: "Angebot anfragen", page: "express/request-a-quote" },
    },
    digital: {
      name: "soFlott Digital",
      tagline: "IT-Beratung & Softwareentwicklung",
      ariaLabel: "Navigation soFlott Digital",
      items: [
        "digital",
        "digital/it-consulting",
        "digital/software-development",
        "digital/api-integration",
        "digital/application-modernisation",
        "digital/contract-software-engineering",
        "digital/support-and-maintenance",
        "digital/case-studies",
        "digital/contact",
      ],
      cta: { label: "Projektanfrage stellen", page: "digital/request-a-proposal" },
    },
  },

  pages: {
    // ----------------------------------------------------------------------
    // Unternehmen
    // ----------------------------------------------------------------------
    home: {
      label: "Startseite",
      meta: {
        title: "soFlott UG – Kurier & Logistik sowie IT & Softwareentwicklung",
        description:
          "Die soFlott UG (haftungsbeschränkt) ist ein deutsches Unternehmen mit zwei Geschäftsbereichen: soFlott Express für B2B-Kurier- und Logistikleistungen und soFlott Digital für IT-Beratung und Softwareentwicklung.",
      },
      hero: {
        eyebrow: "soFlott UG (haftungsbeschränkt)",
        title: "Ein Unternehmen. Zwei spezialisierte Geschäftsbereiche für Geschäftskunden.",
        intro:
          "soFlott bewegt Waren für Unternehmen und entwickelt Software für Unternehmen. Wählen Sie den Bereich, der zu Ihrem Anliegen passt – beide gehören zum selben Unternehmen und arbeiten nach denselben Standards.",
        primaryCta: { label: "soFlott Express", page: "express" },
        secondaryCta: { label: "soFlott Digital", page: "digital" },
      },
      blocks: [
        {
          kind: "divisions",
          eyebrow: "Unsere Geschäftsbereiche",
          title: "Was suchen Sie?",
          intro:
            "Jeder Geschäftsbereich hat eigene Leistungen, eigene Ansprechpartner und eine eigene Arbeitsweise.",
          items: [
            {
              division: "express",
              name: "soFlott Express",
              summary:
                "Kurier- und Logistikleistungen für Unternehmen – einzelne B2B-Zustellungen, wiederkehrende vertragliche Touren und Zustellkapazität für Logistikunternehmen.",
              points: [
                "Direkte B2B-Kurierzustellungen",
                "Vertragliche, wiederkehrende Touren für Ihre eigenen regelmäßigen Zustellungen",
                "Subunternehmerleistungen für Logistiker und Paketdienste",
                "Digitaler Zustellnachweis und B2B-Rechnungen",
              ],
              cta: { label: "Zu soFlott Express", page: "express" },
            },
            {
              division: "digital",
              name: "soFlott Digital",
              summary:
                "IT-Beratung und Softwareentwicklung für Unternehmen – von der Architekturberatung bis zu Entwicklung, Integration und Wartung von Anwendungen.",
              points: [
                "IT-Beratung und technische Architektur",
                "Individualsoftware und Full-Stack-Webanwendungen",
                "API-Entwicklung und Systemintegration",
                "Modernisierung und laufende Betreuung von Anwendungen",
              ],
              cta: { label: "Zu soFlott Digital", page: "digital" },
            },
          ],
        },
        {
          kind: "cards",
          eyebrow: "Arbeitsweise",
          title: "Was beide Bereiche verbindet",
          items: [
            {
              icon: "building",
              title: "Ein verantwortliches Unternehmen",
              description:
                "Jeder Vertrag und jede Rechnung kommt von der soFlott UG (haftungsbeschränkt). Sie wissen immer, mit wem Sie Geschäfte machen.",
            },
            {
              icon: "file",
              title: "Klare Vereinbarungen",
              description:
                "Umfang, Preise und Leistungsniveau werden vor Beginn schriftlich vereinbart – pro Zustellung, pro Tour oder pro Projekt.",
            },
            {
              icon: "shield",
              title: "Dokumentierte Arbeit",
              description:
                "Zustellungen werden mit Zustellnachweis erfasst, Projekte mit vereinbarten Meilensteinen und Abnahmen.",
            },
          ],
        },
      ],
      cta: {
        title: "Nicht sicher, welcher Bereich der richtige ist?",
        description: "Beschreiben Sie kurz Ihr Vorhaben – wir verbinden Sie mit der richtigen Ansprechperson.",
        primaryCta: { label: "Kontakt aufnehmen", page: "contact" },
        secondaryCta: { label: "Über soFlott", page: "about" },
      },
    },

    about: {
      label: "Über uns",
      meta: {
        title: "Über die soFlott UG – Unternehmen und Geschäftsbereiche",
        description:
          "Wer hinter soFlott steht: die soFlott UG (haftungsbeschränkt), ein in Deutschland eingetragenes Unternehmen mit den Geschäftsbereichen soFlott Express und soFlott Digital.",
      },
      hero: {
        eyebrow: "Über uns",
        title: "soFlott UG (haftungsbeschränkt)",
        intro:
          "Ein deutsches Unternehmen für Geschäftskunden in zwei Bereichen: Kurier und Logistik sowie IT-Beratung und Softwareentwicklung.",
      },
      blocks: [
        {
          kind: "text",
          title: "Eine Gesellschaft, zwei Geschäftsbereiche",
          paragraphs: [
            "soFlott Express und soFlott Digital sind Geschäftsbereiche – Marken – der soFlott UG (haftungsbeschränkt), keine eigenständigen Gesellschaften. Alle Verträge, Rechnungen und Registrierungen laufen über die soFlott UG.",
            "Wir trennen die beiden Bereiche, weil ihre Kunden unterschiedliche Bedürfnisse haben: Ein Unternehmen mit einer Sendung, ein Logistikunternehmen auf der Suche nach einem Zustellpartner und eine Organisation mit einem Softwareprojekt verdienen jeweils ein klares, fokussiertes Angebot.",
          ],
        },
        {
          kind: "text",
          title: "Warum Logistik und Software?",
          paragraphs: [
            "Wir betreiben unseren eigenen Kurierdienst mit selbst entwickelter Software: Buchung, Disposition, Fahrer-App, Zustellnachweis und Rechnungsstellung. Diese Arbeit ist die Grundlage von soFlott Digital – wir wissen, was es braucht, um Geschäftssoftware zu entwerfen, zu entwickeln und zu betreiben, auf die sich Menschen täglich verlassen.",
          ],
        },
        {
          kind: "links",
          title: "Die Geschäftsbereiche",
          items: [
            {
              icon: "truck",
              title: "soFlott Express",
              description: "Direkte B2B-Kurierzustellungen und Logistik-Subunternehmerleistungen.",
              page: "express",
            },
            {
              icon: "code",
              title: "soFlott Digital",
              description: "IT-Beratung, Softwareentwicklung, Integration und Modernisierung.",
              page: "digital",
            },
          ],
        },
      ],
      cta: {
        title: "Unternehmensangaben",
        description: "Registerangaben und Kontaktdaten finden Sie in unserem Impressum.",
        primaryCta: { label: "Impressum", page: "legal/imprint" },
        secondaryCta: { label: "Kontakt", page: "contact" },
      },
    },

    contact: {
      label: "Kontakt",
      meta: {
        title: "Kontakt soFlott – Express und Digital",
        description:
          "Kontakt zur soFlott UG: Kurier- und Logistikanfragen an soFlott Express, IT- und Softwareanfragen an soFlott Digital.",
      },
      hero: {
        eyebrow: "Kontakt",
        title: "Wie können wir helfen?",
        intro:
          "Am schnellsten erreichen Sie uns über die Kontaktseite des passenden Geschäftsbereichs. Für alles andere schreiben Sie uns hier.",
      },
      blocks: [
        {
          kind: "links",
          title: "Direkt an einen Geschäftsbereich",
          items: [
            {
              icon: "truck",
              title: "soFlott Express",
              description: "Zustellungen, Angebote, Subunternehmer- und Tourenanfragen.",
              page: "express/contact",
            },
            {
              icon: "code",
              title: "soFlott Digital",
              description: "Beratung, Softwareprojekte, Angebote und Vertragseinsätze.",
              page: "digital/contact",
            },
          ],
        },
        { kind: "contact", title: "Kontakt Unternehmen" },
        { kind: "form", form: "contact", title: "Nachricht senden" },
      ],
    },

    "legal/imprint": {
      label: "Impressum",
      meta: {
        title: "Impressum",
        description: "Angaben zur soFlott UG (haftungsbeschränkt) gemäß § 5 DDG.",
      },
      hero: {
        eyebrow: "Rechtliches",
        title: "Impressum",
        intro: "Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz).",
      },
      blocks: [
        { kind: "imprint", title: "Anbieter" },
        {
          kind: "text",
          title: "Geschäftsbereiche",
          paragraphs: [
            "soFlott Express und soFlott Digital sind Geschäftsbereiche (Geschäftsbezeichnungen) der soFlott UG (haftungsbeschränkt) und keine eigenständigen juristischen Personen.",
          ],
        },
      ],
    },

    "legal/privacy": {
      label: "Datenschutz",
      meta: {
        title: "Datenschutzerklärung",
        description:
          "Wie die soFlott UG (haftungsbeschränkt) personenbezogene Daten auf dieser Website und im Kundenportal verarbeitet.",
      },
      hero: {
        eyebrow: "Rechtliches",
        title: "Datenschutzerklärung",
        intro:
          "Wie wir mit personenbezogenen Daten umgehen, wenn Sie diese Website besuchen, uns kontaktieren oder das Kundenportal nutzen.",
      },
      blocks: [
        {
          kind: "text",
          paragraphs: [
            "Verantwortlich für die Datenverarbeitung auf dieser Website ist die soFlott UG (haftungsbeschränkt). Die Kontaktdaten finden Sie im Impressum.",
          ],
          sections: [
            {
              title: "Besuch der Website",
              paragraphs: [
                "Beim Aufruf einer Seite übermittelt Ihr Browser technische Daten wie IP-Adresse, Datum und Uhrzeit, die aufgerufene Seite und den Browsertyp. Diese Daten sind für die sichere Bereitstellung der Website erforderlich und werden auf Grundlage unseres berechtigten Interesses verarbeitet (Art. 6 Abs. 1 lit. f DSGVO). Server-Logdateien werden nur so lange gespeichert, wie es aus Sicherheitsgründen erforderlich ist.",
                "Schriftarten werden von unserem eigenen Server ausgeliefert. Beim Besuch dieser Website werden keine Inhalte von externen Schriftarten-Diensten geladen.",
              ],
            },
            {
              title: "Cookies",
              paragraphs: [
                "Wir verwenden nur Cookies, die für den Betrieb der Website erforderlich sind. Das Cookie „soflott_locale“ speichert Ihre Sprachauswahl für bis zu ein Jahr. Wenn Sie sich im Kundenportal anmelden, hält das Cookie „soflott_session“ Sie angemeldet. Werbe- oder Tracking-Cookies setzen wir nicht ein.",
              ],
            },
            {
              title: "Anfrage- und Angebotsformulare",
              paragraphs: [
                "Unsere Anfrageformulare speichern keine Daten auf dieser Website. Beim Absenden öffnet sich Ihr eigenes E-Mail-Programm mit einer vorbereiteten Nachricht. Erst wenn Sie diese E-Mail senden, erhalten wir Ihre Angaben. Wir verwenden sie zur Beantwortung Ihrer Anfrage und zur Angebotserstellung (Art. 6 Abs. 1 lit. b DSGVO) und löschen sie, wenn sie nicht mehr benötigt werden, vorbehaltlich gesetzlicher Aufbewahrungsfristen.",
              ],
            },
            {
              title: "Kundenportal",
              paragraphs: [
                "Wenn Sie ein Geschäftskundenkonto anlegen, verarbeiten wir Konto-, Auftrags-, Zustell- und Rechnungsdaten zur Erfüllung unseres Vertrags mit Ihnen (Art. 6 Abs. 1 lit. b DSGVO) und zur Erfüllung gesetzlicher Buchführungs- und Aufbewahrungspflichten (Art. 6 Abs. 1 lit. c DSGVO).",
              ],
            },
            {
              title: "Ihre Rechte",
              paragraphs: [
                "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit sowie das Recht, einer auf berechtigtem Interesse beruhenden Verarbeitung zu widersprechen. Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren.",
              ],
            },
          ],
        },
      ],
    },

    // ----------------------------------------------------------------------
    // soFlott Express
    // ----------------------------------------------------------------------
    express: {
      label: "Überblick",
      meta: {
        title: "soFlott Express – B2B-Kurierdienst und Logistik-Subunternehmer",
        description:
          "soFlott Express bietet direkte B2B-Kurierzustellungen, vertragliche wiederkehrende Zustelltouren für Unternehmen und Zustellkapazität für Logistikunternehmen, Paketdienste und Distributoren.",
        keywords: [
          "B2B Kurierdienst",
          "Expresszustellung für Unternehmen",
          "Logistik Subunternehmer",
          "Zustellpartner für Logistikunternehmen",
        ],
      },
      hero: {
        eyebrow: "soFlott Express",
        title: "Kurier- und Logistikleistungen für Unternehmen.",
        intro:
          "Wir transportieren einzelne Sendungen für Unternehmen, fahren feste wiederkehrende Touren für Unternehmen mit regelmäßigen Zustellungen – und stellen Zustellkapazität für Logistikunternehmen bereit, die einen verlässlichen Partner brauchen. Jede Leistung hat ihre eigene Arbeitsweise.",
        primaryCta: { label: "Ich brauche eine Zustellung", page: "express/direct-b2b-delivery" },
        secondaryCta: { label: "Ich bin ein Logistikunternehmen", page: "express/logistics-subcontracting" },
      },
      blocks: [
        {
          kind: "compare",
          eyebrow: "Welche Leistung passt?",
          title: "Eine Zustellung, eine feste Tour oder Zustellkapazität?",
          intro:
            "Die drei Leistungen decken drei unterschiedliche Bedarfe ab. Sie unterscheiden sich darin, wer beauftragt, wessen Sendungen transportiert werden, wie Preise vereinbart und wie abgerechnet wird.",
          columns: ["Direkte B2B-Kurierzustellung", "Vertragliche Zustelltouren", "B2B-Logistik-Subunternehmerleistung"],
          rows: [
            {
              label: "Für",
              values: [
                "Unternehmen, die eine einzelne Sendung abholen und zustellen lassen möchten",
                "Unternehmen, deren eigene Zustellungen einem regelmäßigen, planbaren Muster folgen",
                "Logistikunternehmen, Paketdienste und Distributoren, die Zustellkapazität benötigen",
              ],
            },
            {
              label: "Wessen Sendungen",
              values: [
                "Ihre eigenen Waren oder Dokumente",
                "Ihre eigenen Waren – zwischen Ihren Standorten, Lieferanten oder Stammkunden",
                "Pakete Ihrer Kunden, zugestellt im Auftrag Ihres Logistiknetzes",
              ],
            },
            {
              label: "Beauftragung",
              values: [
                "Einzelner Zustellauftrag",
                "Tourenvereinbarung – Stopps, Tage und Zeitfenster einmal festgelegt",
                "Rahmenvertrag oder Dienstleistungsvertrag",
              ],
            },
            {
              label: "Preisgrundlage",
              values: [
                "Angebot pro Zustellung, nach Entfernung, Dringlichkeit, Wartezeit und Handling",
                "Feste Pauschale pro Tourfahrt oder pro Stopp, im Voraus vereinbart",
                "Wie vereinbart: pro Stopp, pro Paket, feste Tourenpauschale oder kombiniert",
              ],
            },
            {
              label: "Nachweis",
              values: [
                "Zustellnachweis für jeden Auftrag",
                "Zustellnachweis für jeden Stopp und Protokoll jeder Fahrt",
                "Tourenprotokolle, Zustellnachweise und Mengenabgleich",
              ],
            },
            {
              label: "Abrechnung",
              values: [
                "Pro Auftrag oder monatliche Sammelrechnung",
                "Monatliche Rechnung mit Aufstellung der gefahrenen Touren",
                "Periodische Rechnung mit Leistungsnachweis",
              ],
            },
          ],
          ctas: [
            { label: "Zustellangebot anfragen", page: "express/request-a-quote" },
            { label: "Tourenangebot anfragen", page: "express/request-a-quote", query: "type=routes" },
            {
              label: "Subunternehmer-Angebot anfragen",
              page: "express/request-a-quote",
              query: "type=subcontracting",
            },
          ],
        },
        {
          kind: "links",
          eyebrow: "Leistungen",
          title: "soFlott Express im Überblick",
          items: [
            {
              icon: "package",
              title: "Direkte B2B-Zustellung",
              description: "Einzelne Zustellungen zwischen Geschäftsstandorten, mit Statusverfolgung und Zustellnachweis.",
              page: "express/direct-b2b-delivery",
            },
            {
              icon: "handshake",
              title: "Logistik-Subunternehmer",
              description: "Zustellkapazität und -betrieb für Logistikunternehmen im Rahmen eines Rahmenvertrags.",
              page: "express/logistics-subcontracting",
            },
            {
              icon: "route",
              title: "Vertragliche Touren",
              description: "Wiederkehrende Fahrten für Ihre eigenen regelmäßigen Zustellungen, an vereinbarten Tagen und Zeitfenstern.",
              page: "express/contracted-delivery-routes",
            },
            {
              icon: "map",
              title: "Einsatzgebiete",
              description: "Wo wir derzeit tätig sind und wie wir mit Strecken außerhalb der Region umgehen.",
              page: "express/service-areas",
            },
            {
              icon: "clipboard",
              title: "So funktioniert’s",
              description: "Von der Anfrage bis zu Zustellnachweis und Rechnung – Schritt für Schritt.",
              page: "express/how-it-works",
            },
          ],
        },
      ],
      cta: {
        title: "Sagen Sie uns, was transportiert werden soll.",
        description: "Senden Sie eine Zustellanfrage, planen Sie eine wiederkehrende Tour oder sprechen Sie mit uns über einen Subunternehmervertrag.",
        primaryCta: { label: "Angebot anfragen", page: "express/request-a-quote" },
        secondaryCta: { label: "soFlott Express kontaktieren", page: "express/contact" },
      },
    },

    "express/direct-b2b-delivery": {
      label: "Direkte B2B-Zustellung",
      meta: {
        title: "Direkte B2B-Kurierzustellung für Unternehmen",
        description:
          "Geschäftskurier von soFlott Express: Abholung und Zustellung zwischen Geschäftsstandorten, Preis vor der Buchung, Statusverfolgung, digitaler Zustellnachweis und B2B-Rechnungen.",
        keywords: ["B2B Kurierdienst", "Geschäftskurier", "Expresszustellung für Unternehmen", "Kurier für Firmen"],
      },
      hero: {
        eyebrow: "soFlott Express · Direktzustellung",
        title: "Direkte B2B-Kurierzustellungen.",
        intro:
          "Sie möchten eine Sendung an einem Geschäftsstandort abholen und an einen anderen zustellen lassen. Wir erstellen das Angebot, holen ab, stellen zu, dokumentieren – und senden Ihnen eine ordentliche B2B-Rechnung.",
        primaryCta: { label: "Zustellangebot anfragen", page: "express/request-a-quote" },
        secondaryCta: { label: "Geschäftskundenkonto eröffnen", href: "/register" },
        points: [
          "Preis vor der Buchung",
          "Statusverfolgung im Kundenportal",
          "Digitaler Zustellnachweis",
          "Rechnung pro Auftrag oder monatlich",
        ],
      },
      blocks: [
        {
          kind: "cards",
          title: "Was enthalten ist",
          items: [
            {
              icon: "package",
              title: "Abholung und Zustellung",
              description:
                "Abhol- und Zustelladresse, gewünschte Zeitfenster und Sendungsdetails werden mit jedem Auftrag vereinbart.",
            },
            {
              icon: "receipt",
              title: "Transparente Preise",
              description:
                "Der Preis richtet sich nach Entfernung, Dringlichkeit, Wartezeit und Handling. Sie erhalten ihn vor der Auftragsbestätigung, mit gesondert ausgewiesener Umsatzsteuer.",
            },
            {
              icon: "search",
              title: "Statusverfolgung",
              description: "Verfolgen Sie den Status jedes Auftrags im Kundenportal, statt nachzutelefonieren.",
            },
            {
              icon: "signature",
              title: "Zustellnachweis",
              description:
                "Jede Zustellung wird mit Name des Empfängers und Übergabezeit erfasst, bei Bedarf zusätzlich mit Unterschrift.",
            },
            {
              icon: "file",
              title: "B2B-Rechnungen",
              description:
                "Rechnung pro Auftrag oder Sammelrechnung für den Abrechnungszeitraum, zusammen mit Ihrer Auftragsübersicht.",
            },
            {
              icon: "users",
              title: "Geschäftskundenkonten",
              description:
                "Mehrere Ansprechpartner und gespeicherte Adressen pro Unternehmen, damit Ihr Team ohne erneute Dateneingabe bestellen kann.",
            },
          ],
        },
        {
          kind: "notice",
          title: "Dringende und zeitkritische Zustellungen",
          text:
            "Nennen Sie uns bei der Anfrage Ihr gewünschtes Abhol- und Zustellzeitfenster. Wir bestätigen vor der Buchung das früheste Zeitfenster, das wir verlässlich einhalten können – wir versprechen keine Zustellzeiten, die wir nicht bestätigt haben.",
        },
        {
          kind: "checklist",
          title: "Typische Anfragen",
          items: [
            "Bauteile oder Ersatzteile zwischen Produktionsstandorten, Lieferanten und Werkstätten",
            "Dokumente und Originale, die persönlich übergeben werden müssen",
            "Muster und Waren zwischen Filialen, Laboren und Kunden",
            "Einzelzustellungen, die nicht in ein Paketnetz passen",
          ],
        },
        {
          kind: "faq",
          title: "Fragen zur Direktzustellung",
          items: [
            {
              question: "Wie wird der Preis berechnet?",
              answer:
                "Der Preis hängt von Entfernung, Dringlichkeit, erwarteter Wartezeit und besonderem Handling ab. Sie erhalten ihn vor der Auftragsbestätigung, und genau dieser vereinbarte Preis erscheint auf der Rechnung.",
            },
            {
              question: "Brauche ich ein Konto, um zu bestellen?",
              answer:
                "Nein. Sie können ein Angebot auch ohne Konto anfragen. Stammkunden eröffnen in der Regel ein Geschäftskundenkonto, um im Kundenportal zu buchen, Aufträge zu verfolgen und Rechnungen herunterzuladen.",
            },
            {
              question: "Was passiert, wenn eine Zustellung nicht möglich ist?",
              answer:
                "Fehlgeschlagene Zustellungen, Verzögerungen und andere Abweichungen werden erfasst und an Sie gemeldet, sodass Sie immer wissen, was passiert ist und was als Nächstes vereinbart wurde.",
            },
          ],
        },
      ],
      cta: {
        title: "Etwas muss zugestellt werden?",
        description: "Senden Sie uns Adressen, Zeitfenster und Sendungsdetails – wir antworten mit einem Angebot.",
        primaryCta: { label: "Zustellangebot anfragen", page: "express/request-a-quote" },
        secondaryCta: { label: "Kunden-Login", href: "/login" },
      },
    },

    "express/logistics-subcontracting": {
      label: "Logistik-Subunternehmer",
      meta: {
        title: "Logistik-Subunternehmer – Zustellpartner für Logistikunternehmen",
        description:
          "soFlott Express als Zustell-Subunternehmer für Logistikunternehmen, Paketdienste und Distributoren: vertragliche Kapazität, feste Touren, Zustellgebiete, Zustellnachweis und abgeglichene periodische Abrechnung.",
        keywords: [
          "Logistik Subunternehmer",
          "Subunternehmer Paketzustellung",
          "Zustellpartner für Logistikunternehmen",
          "Subunternehmer letzte Meile",
        ],
      },
      hero: {
        eyebrow: "soFlott Express · Subunternehmer",
        title: "Ein Zustellpartner für Logistikunternehmen.",
        intro:
          "Logistikunternehmen, Paketdienste und Distributoren beauftragen soFlott mit Zustellkapazität oder dem Betrieb definierter Zustellabläufe in ihrem Netz – zugestellt werden die Pakete ihrer Kunden. Wir arbeiten auf Basis eines Rahmenvertrags, dokumentieren jede Tour und rechnen genau das ab, was vereinbart wurde.",
        primaryCta: {
          label: "Subunternehmer-Angebot anfragen",
          page: "express/request-a-quote",
          query: "type=subcontracting",
        },
        secondaryCta: { label: "Rahmenvertrag besprechen", page: "express/contact" },
      },
      blocks: [
        {
          kind: "cards",
          title: "Einsatzmodelle",
          intro:
            "Jeder Einsatz wird in einer eigenen Vereinbarung festgelegt und als Teil Ihres Logistiknetzes betrieben. Typische Modelle sind:",
          items: [
            {
              icon: "route",
              title: "Feste Touren",
              description: "Eine Tour aus Ihrem Netz, von uns an vereinbarten Wochentagen und Zeitfenstern gefahren.",
            },
            {
              icon: "map",
              title: "Zustellgebiete",
              description: "Verantwortung für ein definiertes Zustellgebiet oder eine Servicezone.",
            },
            {
              icon: "package",
              title: "Tägliche Touren mit variabler Menge",
              description: "Tägliche Zustelltouren, bei denen die Paketmenge von Tag zu Tag schwankt.",
            },
            {
              icon: "scale",
              title: "Flexible Abrechnung",
              description:
                "Pro erledigtem Stopp oder Paket, feste Tourenpauschale oder Grundpauschale plus variable Menge – wie vertraglich vereinbart.",
            },
          ],
        },
        {
          kind: "steps",
          title: "So läuft eine Subunternehmer-Zusammenarbeit ab",
          steps: [
            {
              title: "Anforderungen und Angebot",
              description:
                "Sie beschreiben Touren, Gebiete, Mengen und Leistungsniveau. Wir antworten mit einem schriftlichen Angebot.",
            },
            {
              title: "Rahmenvertrag",
              description:
                "Preise, Abrechnungseinheiten, Leistungsniveau und Regeln für Abweichungen werden vor Betriebsbeginn vertraglich festgelegt.",
            },
            {
              title: "Tourenplanung und Zuweisung",
              description: "Touren und Fahrzeuge werden nach dem vereinbarten Plan disponiert und zugewiesen.",
            },
            {
              title: "Betrieb und Zustellnachweis",
              description: "Ladelisten, Stopps, Zustellungen und Abweichungen werden für jede Tour erfasst.",
            },
            {
              title: "Abgleich und Rechnung",
              description:
                "Zugestellte Mengen werden vor der periodischen Rechnung mit Ihren Daten abgeglichen; die Rechnung enthält einen Leistungsnachweis.",
            },
          ],
        },
        {
          kind: "checklist",
          title: "Was Sie erwarten können",
          items: [
            "Ein Vertragspartner: die soFlott UG (haftungsbeschränkt)",
            "Schriftliche Vereinbarungen zu Preisen, Abrechnungseinheiten und Leistungsniveau",
            "Berichte je Tour über erfolgreiche, fehlgeschlagene und zurückgeführte Zustellungen",
            "Mengenabgleich vor der Rechnung – keine Überraschungen",
          ],
        },
        {
          kind: "notice",
          title: "Kein Logistikunternehmen?",
          text:
            "Wenn Ihr Unternehmen eigene Waren nach festem Plan versendet – zum Beispiel zwischen Ihren Filialen oder jede Woche an dieselben Kunden –, ist eine vertragliche Zustelltour die passendere Leistung.",
        },
      ],
      cta: {
        title: "Sie suchen zusätzliche Zustellkapazität?",
        description: "Beschreiben Sie Ihre Touren, Gebiete und Mengen. Wir erstellen ein Subunternehmer-Angebot.",
        primaryCta: {
          label: "Subunternehmer-Angebot anfragen",
          page: "express/request-a-quote",
          query: "type=subcontracting",
        },
        secondaryCta: { label: "Rahmenvertrag besprechen", page: "express/contact" },
      },
    },

    "express/contracted-delivery-routes": {
      label: "Vertragliche Touren",
      meta: {
        title: "Vertragliche Zustelltouren und wiederkehrende Fahrten",
        description:
          "Feste, wiederkehrende Zustelltouren für Unternehmen mit regelmäßigen Zustellungen: soFlott Express fährt Ihre Tour an vereinbarten Tagen und Zeitfenstern, mit Zustellnachweis für jeden Stopp und einer monatlichen Rechnung.",
        keywords: ["vertragliche Zustelltouren", "wiederkehrende Tour", "Festtour Kurier", "regelmäßige B2B-Zustellung"],
      },
      hero: {
        eyebrow: "soFlott Express · Vertragliche Touren",
        title: "Ihre regelmäßigen Zustellungen, auf fester Tour.",
        intro:
          "Wenn Ihr Unternehmen regelmäßig gleichartige Zustellungen hat, ersetzt eine vertragliche Tour wiederholte Einzelaufträge. Stopps, Tage, Zeitfenster und Preise werden einmal vereinbart – und die Tour wird konsequent gefahren, ohne dass Sie jede Zustellung einzeln beauftragen.",
        primaryCta: {
          label: "Tourenangebot anfragen",
          page: "express/request-a-quote",
          query: "type=routes",
        },
        secondaryCta: { label: "So funktioniert’s", page: "express/how-it-works" },
      },
      blocks: [
        {
          kind: "cards",
          title: "Typische vertragliche Touren",
          intro: "Eine vertragliche Tour passt zu Unternehmen, deren eigene Zustellungen sich an bekannten Tagen wiederholen. Zum Beispiel:",
          items: [
            {
              icon: "building",
              title: "Zwischen Ihren Standorten",
              description: "Regelmäßige Fahrten zwischen Filialen, Lagern, Büros oder Produktionsstandorten.",
            },
            {
              icon: "package",
              title: "Zu Stammkunden",
              description: "Planmäßige Zustellungen an dieselben Kunden oder Verkaufsstellen jede Woche.",
            },
            {
              icon: "route",
              title: "Von Lieferanten oder Partnern",
              description: "Wiederkehrende Abholungen bei Lieferanten oder Partnerunternehmen an vereinbarten Tagen.",
            },
            {
              icon: "calendar",
              title: "Feste Fahrpläne",
              description: "Vereinbarte Wochentage und Zeitfenster, im Voraus geplant und jedes Mal dokumentiert.",
            },
          ],
        },
        {
          kind: "checklist",
          title: "Schriftlich vereinbart",
          items: [
            "Stopps, Reihenfolge und Einsatztage",
            "Zeitfenster und Handling-Anweisungen",
            "Preisgrundlage: feste Pauschale pro Tourfahrt oder pro Stopp",
            "Umgang mit und Berechnung von Abweichungen, fehlgeschlagenen Zustellungen und Retouren",
          ],
        },
        {
          kind: "notice",
          title: "Welche Leistung ist die richtige?",
          text:
            "Nur eine gelegentliche oder einmalige Sendung? Dann ist die direkte B2B-Zustellung richtig. Sie sind ein Logistikunternehmen, Paketdienst oder Distributor und brauchen Kapazität für die Pakete Ihrer Kunden? Das ist die Logistik-Subunternehmerleistung.",
        },
      ],
      cta: {
        title: "Eine vertragliche Tour planen.",
        description: "Beschreiben Sie Stopps, Tage und Mengen – wir erstellen ein Angebot.",
        primaryCta: {
          label: "Tourenangebot anfragen",
          page: "express/request-a-quote",
          query: "type=routes",
        },
        secondaryCta: { label: "soFlott Express kontaktieren", page: "express/contact" },
      },
    },

    "express/service-areas": {
      label: "Einsatzgebiete",
      meta: {
        title: "Einsatzgebiete – Kurierdienst in Augsburg, Mering und München",
        description:
          "Wo soFlott Express tätig ist: B2B-Kurierzustellungen und vertragliche Touren im Raum Augsburg, Mering und München, Strecken außerhalb der Region auf Anfrage.",
        keywords: ["Kurier Augsburg", "Kurier Mering", "Kurier München", "B2B Kurier Bayern"],
      },
      hero: {
        eyebrow: "soFlott Express · Einsatzgebiete",
        title: "Wo wir tätig sind.",
        intro:
          "soFlott Express konzentriert sich auf den Raum Augsburg, Mering und München. Die Konzentration auf eine Region ermöglicht realistische Tourenplanung und verlässliche Zusagen.",
        primaryCta: { label: "Strecke anfragen", page: "express/request-a-quote" },
      },
      blocks: [
        {
          kind: "cards",
          title: "Unsere Kernregion",
          items: [
            {
              icon: "map",
              title: "Augsburg",
              description:
                "Zustellungen in Augsburg und zu umliegenden Geschäftsstandorten sowie Strecken zwischen Augsburg und München.",
            },
            {
              icon: "map",
              title: "Mering",
              description: "Mering und Umgebung, einschließlich Verbindungen Richtung Augsburg und München.",
            },
            {
              icon: "map",
              title: "München",
              description: "Zustellungen von und nach München im Rahmen von Direktaufträgen und vertraglichen Touren.",
            },
          ],
        },
        {
          kind: "text",
          title: "Außerhalb der Region",
          paragraphs: [
            "Für Direktzustellungen außerhalb dieses Gebiets senden Sie uns die Strecke – wir sagen Ihnen ehrlich, ob und wann wir sie fahren können. Bei Subunternehmerleistungen werden Zustellgebiete in jedem Vertrag individuell festgelegt.",
          ],
        },
      ],
      cta: {
        title: "Wird Ihre Strecke abgedeckt?",
        description: "Senden Sie Abhol- und Zustellorte – wir bestätigen die Verfügbarkeit mit dem Angebot.",
        primaryCta: { label: "Angebot anfragen", page: "express/request-a-quote" },
        secondaryCta: { label: "soFlott Express kontaktieren", page: "express/contact" },
      },
    },

    "express/how-it-works": {
      label: "So funktioniert’s",
      meta: {
        title: "So funktioniert soFlott Express – von der Anfrage bis zur Rechnung",
        description:
          "Ablauf von direkten B2B-Zustellungen, vertraglichen Zustelltouren und Subunternehmer-Einsätzen bei soFlott Express: Anfrage, Angebot, Disposition, Zustellnachweis, Abgleich und Rechnung.",
      },
      hero: {
        eyebrow: "soFlott Express · Ablauf",
        title: "Von der Anfrage bis zur Rechnung.",
        intro:
          "Direktzustellungen, vertragliche Touren und Subunternehmerleistungen folgen unterschiedlichen Abläufen. Alle drei enden mit einer dokumentierten Zustellung und einer Rechnung, die dem Vereinbarten entspricht.",
      },
      blocks: [
        {
          kind: "steps",
          eyebrow: "Direkte B2B-Zustellung",
          title: "Eine einzelne Zustellung",
          steps: [
            {
              title: "Anfrage",
              description:
                "Senden Sie Abhol- und Zustelladresse, gewünschtes Zeitfenster und Sendungsdetails – per Formular, Telefon oder im Kundenportal.",
            },
            {
              title: "Angebot und Bestätigung",
              description:
                "Sie erhalten Preis und bestätigtes Zeitfenster. Mit Ihrer Zusage ist der Auftrag gebucht.",
            },
            {
              title: "Abholung und Zustellung",
              description:
                "Ein Fahrer wird zugewiesen, holt die Sendung ab und stellt sie zu. Den Status verfolgen Sie im Portal.",
            },
            {
              title: "Zustellnachweis",
              description:
                "Die Übergabe wird mit Empfängername und Uhrzeit erfasst; Abweichungen werden dokumentiert und gemeldet.",
            },
            {
              title: "Rechnung",
              description:
                "Der erledigte Auftrag wird einzeln berechnet oder in Ihre Sammelrechnung für den Zeitraum aufgenommen.",
            },
          ],
        },
        {
          kind: "steps",
          eyebrow: "Vertragliche Zustelltouren",
          title: "Eine wiederkehrende Tour für Ihr Unternehmen",
          steps: [
            {
              title: "Tourenaufnahme",
              description:
                "Sie beschreiben Stopps, Einsatztage, Zeitfenster und übliche Mengen Ihrer regelmäßigen Zustellungen.",
            },
            {
              title: "Tourenvereinbarung",
              description: "Fahrplan, Stopps, Preisgrundlage und der Umgang mit Abweichungen werden einmal schriftlich vereinbart.",
            },
            {
              title: "Planmäßiger Betrieb",
              description: "Die Tour wird an den vereinbarten Tagen gefahren, ohne dass Sie jede Zustellung einzeln beauftragen.",
            },
            {
              title: "Zustellnachweis je Stopp",
              description: "Jeder Stopp wird dokumentiert; ausgelassene Stopps und Abweichungen werden je Fahrt gemeldet.",
            },
            {
              title: "Monatliche Rechnung",
              description: "Gefahrene Touren werden monatlich zum vereinbarten Touren- oder Stopppreis abgerechnet.",
            },
          ],
        },
        {
          kind: "steps",
          eyebrow: "Logistik-Subunternehmer",
          title: "Ein Subunternehmer-Einsatz",
          steps: [
            {
              title: "Angebot",
              description:
                "Wir prüfen Touren, Gebiete, Mengen und Leistungsniveau und senden ein schriftliches Angebot.",
            },
            {
              title: "Vertrag",
              description:
                "Preise, Abrechnungseinheiten, Leistungsniveau und Regeln für Abweichungen werden im Rahmenvertrag festgelegt.",
            },
            {
              title: "Betrieb",
              description: "Touren werden geplant und zugewiesen; Ladelisten, Zustellungen und Abweichungen werden erfasst.",
            },
            {
              title: "Abgleich",
              description: "Erledigte Mengen werden mit Ihren Daten verglichen und Differenzen geklärt.",
            },
            {
              title: "Periodische Rechnung",
              description: "Wir rechnen den vereinbarten Zeitraum mit Leistungsnachweis ab.",
            },
          ],
        },
      ],
      cta: {
        title: "Bereit zu starten?",
        description: "Fragen Sie ein Zustellangebot, ein Tourenangebot oder ein Subunternehmer-Angebot an – im Formular wählen Sie aus.",
        primaryCta: { label: "Angebot anfragen", page: "express/request-a-quote" },
        secondaryCta: { label: "soFlott Express kontaktieren", page: "express/contact" },
      },
    },

    "express/request-a-quote": {
      label: "Angebot anfragen",
      meta: {
        title: "Kurierangebot, Tourenangebot oder Subunternehmer-Angebot anfragen",
        description:
          "Fragen Sie bei soFlott Express ein Angebot für eine direkte B2B-Kurierzustellung, eine vertragliche Zustelltour oder Logistik-Subunternehmerleistungen an.",
      },
      hero: {
        eyebrow: "soFlott Express · Angebot anfragen",
        title: "Angebot anfragen.",
        intro:
          "Wählen Sie, ob Sie eine einzelne Zustellung, eine wiederkehrende Tour für Ihre regelmäßigen Zustellungen oder einen Subunternehmer für Ihr Logistiknetz suchen. Wir antworten mit einem Preis oder einem schriftlichen Angebot.",
      },
      blocks: [
        {
          kind: "form",
          form: "express-quote",
          title: "Ihre Anfrage",
          intro: "Optionale Felder können leer bleiben. Je mehr wir wissen, desto genauer unsere Antwort.",
        },
      ],
    },

    "express/contact": {
      label: "Kontakt",
      meta: {
        title: "Kontakt soFlott Express – Kurier & Logistik",
        description:
          "Kontakt zu soFlott Express für B2B-Kurierzustellungen, Angebote, Logistik-Subunternehmerleistungen und vertragliche Touren.",
      },
      hero: {
        eyebrow: "soFlott Express · Kontakt",
        title: "Sprechen Sie mit soFlott Express.",
        intro: "Fragen zu einer Zustellung, einem Angebot oder einem Rahmenvertrag? Melden Sie sich direkt.",
        primaryCta: { label: "Angebot anfragen", page: "express/request-a-quote" },
      },
      blocks: [
        { kind: "contact", title: "Kontakt soFlott Express" },
        { kind: "form", form: "contact", title: "Nachricht senden" },
      ],
    },

    // ----------------------------------------------------------------------
    // soFlott Digital
    // ----------------------------------------------------------------------
    digital: {
      label: "Überblick",
      meta: {
        title: "soFlott Digital – IT-Beratung und Softwareentwicklung",
        description:
          "soFlott Digital bietet IT-Beratung, individuelle Softwareentwicklung, API-Integration, Anwendungsmodernisierung und Software-Engineering auf Vertragsbasis für Unternehmen in Deutschland und international.",
        keywords: [
          "IT-Beratung",
          "Softwareentwicklung für Unternehmen",
          "B2B Softwareentwicklung",
          "Full-Stack-Entwicklung",
        ],
      },
      hero: {
        eyebrow: "soFlott Digital",
        title: "IT-Beratung und Softwareentwicklung für Unternehmen.",
        intro:
          "Wir unterstützen Unternehmen dabei, Software zu planen, zu entwickeln, zu integrieren und zu betreuen – als Projekt, als laufende Betreuung oder als Engineering-Kapazität in Ihrem Team. Wir arbeiten auf Deutsch und Englisch.",
        primaryCta: { label: "Projekt besprechen", page: "digital/request-a-proposal" },
        secondaryCta: { label: "Vertragseinsatz besprechen", page: "digital/contract-software-engineering" },
      },
      blocks: [
        {
          kind: "links",
          eyebrow: "Leistungen",
          title: "Was wir tun",
          items: [
            {
              icon: "search",
              title: "IT-Beratung",
              description: "Technische Beratung, Architektur-Reviews und Planung vor der Investition.",
              page: "digital/it-consulting",
            },
            {
              icon: "code",
              title: "Softwareentwicklung",
              description: "Individuelle Geschäftsanwendungen und Full-Stack-Webentwicklung.",
              page: "digital/software-development",
            },
            {
              icon: "plug",
              title: "API & Systemintegration",
              description: "APIs und Schnittstellen, die Ihre Systeme und Partner verbinden.",
              page: "digital/api-integration",
            },
            {
              icon: "refresh",
              title: "Anwendungsmodernisierung",
              description: "Schrittweise Modernisierung von Altanwendungen.",
              page: "digital/application-modernisation",
            },
            {
              icon: "users",
              title: "Software-Engineering auf Vertragsbasis",
              description: "Erfahrene Engineering-Kapazität für Ihr Team und Ihre Projekte.",
              page: "digital/contract-software-engineering",
            },
            {
              icon: "lifebuoy",
              title: "Support & Wartung",
              description: "Laufende Wartung, Fehlerbehebung und Verbesserungen für produktive Anwendungen.",
              page: "digital/support-and-maintenance",
            },
          ],
        },
        {
          kind: "compare",
          eyebrow: "Zusammenarbeitsmodelle",
          title: "Wie wir zusammenarbeiten können",
          columns: ["Einsatz", "Abrechnungsgrundlage"],
          rows: [
            { label: "Beratung", values: ["Beratung, Reviews, Workshops", "Stunden- oder Tagessatz"] },
            { label: "Nach Aufwand", values: ["Flexible Entwicklungsarbeit", "Freigegebene Zeit × vereinbarter Satz"] },
            { label: "Festpreisprojekt", values: ["Klar definierter Umfang", "Vertraglicher Projektpreis"] },
            {
              label: "Meilensteinprojekt",
              values: ["Größere Projekte in Phasen", "Vereinbarte Beträge je abgenommenem Meilenstein"],
            },
            { label: "Retainer / Support", values: ["Laufende Wartung und Betreuung", "Wiederkehrende Monatspauschale"] },
          ],
        },
        {
          kind: "text",
          title: "Aus dem echten Betrieb heraus",
          paragraphs: [
            "soFlott betreibt seinen eigenen Kurierdienst auf einer selbst entworfenen und entwickelten Plattform: eine ASP.NET-Core-API, Next.js-Webanwendungen, eine Fahrer-App, Zustellnachweis und Rechnungsstellung. Diesen praxisnahen, betriebsorientierten Ansatz bringen wir in Kundenprojekte ein.",
            "Wir arbeiten mit Kunden in Deutschland und sind offen für Projekte mit Unternehmen in Großbritannien, Irland, den VAE und anderswo – remote und auf Englisch.",
          ],
        },
      ],
      cta: {
        title: "Sie haben ein Projekt im Kopf?",
        description: "Beschreiben Sie, was Sie erreichen möchten. Wir antworten mit Rückfragen oder einem Angebot.",
        primaryCta: { label: "Projektanfrage stellen", page: "digital/request-a-proposal" },
        secondaryCta: { label: "soFlott Digital kontaktieren", page: "digital/contact" },
      },
    },

    "digital/it-consulting": {
      label: "IT-Beratung",
      meta: {
        title: "IT-Beratung und technische Architektur",
        description:
          "IT-Beratung von soFlott Digital: technische Beratung, Architektur- und Code-Reviews, Technologieauswahl und Projektplanung für Unternehmen.",
        keywords: ["IT-Beratung", "Architekturberatung", "Software-Architektur-Review"],
      },
      hero: {
        eyebrow: "soFlott Digital · IT-Beratung",
        title: "Technische Entscheidungen mit Sicherheit treffen.",
        intro:
          "Bevor Sie entwickeln, kaufen oder neu schreiben: Holen Sie sich eine unabhängige technische Einschätzung. Wir prüfen den Bestand, klären den Bedarf und empfehlen einen realistischen Weg.",
        primaryCta: { label: "Projekt besprechen", page: "digital/request-a-proposal" },
      },
      blocks: [
        {
          kind: "cards",
          title: "Typische Beratungsthemen",
          items: [
            {
              icon: "layers",
              title: "Architektur",
              description: "Entwurf oder Review von Anwendungs- und Systemarchitektur.",
            },
            {
              icon: "search",
              title: "Code- und System-Reviews",
              description: "Bewertung von Qualität, Risiken und Wartbarkeit bestehender Software.",
            },
            {
              icon: "clipboard",
              title: "Projektplanung",
              description: "Umfang, Prioritäten, Phasen und realistische Aufwandsschätzungen.",
            },
            {
              icon: "scale",
              title: "Technologieauswahl",
              description: "Vergleich der Optionen – entwickeln, kaufen oder integrieren – für Ihre Situation.",
            },
          ],
        },
        {
          kind: "text",
          title: "Abrechnung der Beratung",
          paragraphs: [
            "Beratung wird zu einem vereinbarten Stunden- oder Tagessatz abgerechnet. Umfangreichere Analysen können zum Festpreis mit definiertem Ergebnis angeboten werden, etwa als schriftliches Review oder Architekturvorschlag.",
          ],
        },
      ],
      cta: {
        title: "Sie brauchen eine zweite Meinung?",
        description: "Beschreiben Sie Ihre Situation und die anstehende Entscheidung.",
        primaryCta: { label: "Projektanfrage stellen", page: "digital/request-a-proposal" },
        secondaryCta: { label: "Softwareentwicklung", page: "digital/software-development" },
      },
    },

    "digital/software-development": {
      label: "Softwareentwicklung",
      meta: {
        title: "Individuelle Softwareentwicklung und Full-Stack-Webanwendungen",
        description:
          "Individuelle B2B-Softwareentwicklung von soFlott Digital: Full-Stack-Webanwendungen mit ASP.NET Core / .NET und modernen Webtechnologien – als Festpreis-, Meilenstein- oder Aufwandsprojekt.",
        keywords: [
          "Softwareentwicklung",
          "Individualsoftware",
          "B2B Softwareentwicklung",
          "ASP.NET Core Entwicklung",
        ],
      },
      hero: {
        eyebrow: "soFlott Digital · Softwareentwicklung",
        title: "Individuelle Software für die Arbeitsweise Ihres Unternehmens.",
        intro:
          "Wir konzipieren und entwickeln Geschäftsanwendungen – Webportale, interne Werkzeuge und Workflow-Systeme –, die zu Ihren Prozessen passen, statt Sie an Standardsoftware anzupassen.",
        primaryCta: { label: "Projekt besprechen", page: "digital/request-a-proposal" },
      },
      blocks: [
        {
          kind: "cards",
          title: "Was wir entwickeln",
          items: [
            {
              icon: "code",
              title: "Webanwendungen",
              description: "Full-Stack-Geschäftsanwendungen sowie Kunden- und Partnerportale.",
            },
            {
              icon: "layers",
              title: "Backend-Services",
              description: "APIs und Services mit ASP.NET Core / .NET und relationalen Datenbanken.",
            },
            {
              icon: "clipboard",
              title: "Interne Werkzeuge",
              description: "Verwaltungs-, Betriebs- und Reporting-Werkzeuge für Ihr Team.",
            },
            {
              icon: "lock",
              title: "Sicherheit von Anfang an",
              description: "Authentifizierung, Rollen und Berechtigungen sowie Audit-Trails, wo es darauf ankommt.",
            },
          ],
        },
        {
          kind: "steps",
          title: "So läuft ein Projekt ab",
          steps: [
            {
              title: "Anfrage und Angebot",
              description: "Wir klären Ziele und Umfang und senden ein schriftliches Angebot.",
            },
            {
              title: "Vertrag und Umfang",
              description: "Leistungen, Abnahmekriterien, Meilensteine und Preise werden vereinbart.",
            },
            {
              title: "Iterative Umsetzung",
              description: "Arbeit in kurzen Iterationen mit regelmäßigen Demos und Feedback.",
            },
            {
              title: "Abnahme und Übergabe",
              description:
                "Meilensteine werden anhand der vereinbarten Kriterien abgenommen; Code und Dokumentation werden übergeben.",
            },
          ],
        },
      ],
      cta: {
        title: "Sprechen wir über Ihre Anwendung.",
        description: "Senden Sie eine kurze Beschreibung des Problems, das Sie lösen möchten.",
        primaryCta: { label: "Projektanfrage stellen", page: "digital/request-a-proposal" },
        secondaryCta: { label: "Projektbeispiele", page: "digital/case-studies" },
      },
    },

    "digital/api-integration": {
      label: "API-Integration",
      meta: {
        title: "API-Entwicklung und Systemintegration",
        description:
          "API-Integration von soFlott Digital: Konzeption und Entwicklung von REST-APIs und Schnittstellen zwischen Geschäftssystemen, Partnern und Drittanbietern.",
        keywords: ["API-Integration", "Systemintegration", "REST-API-Entwicklung", "Schnittstellenentwicklung"],
      },
      hero: {
        eyebrow: "soFlott Digital · API & Integration",
        title: "Verbinden Sie die Systeme, auf die Ihr Unternehmen angewiesen ist.",
        intro:
          "Daten, die von Hand zwischen Systemen übertragen werden, kosten Zeit und verursachen Fehler. Wir konzipieren und entwickeln APIs und Schnittstellen, damit Ihre Systeme, Partner und Dienste zusammenarbeiten.",
        primaryCta: { label: "Projekt besprechen", page: "digital/request-a-proposal" },
      },
      blocks: [
        {
          kind: "cards",
          title: "Integrationsleistungen",
          items: [
            {
              icon: "plug",
              title: "API-Design und -Entwicklung",
              description: "Gut dokumentierte REST-APIs für Ihre Anwendungen und Partner.",
            },
            {
              icon: "refresh",
              title: "System-zu-System-Integration",
              description: "Anbindung von Geschäftssoftware, Datenbanken und Drittanbieterdiensten.",
            },
            {
              icon: "shield",
              title: "Sicherer Zugriff",
              description: "Authentifizierung, Autorisierung und Validierung für jede Schnittstelle.",
            },
            {
              icon: "file",
              title: "Dokumentation",
              description: "Klare Dokumentation, damit Ihr Team und Ihre Partner mit der API arbeiten können.",
            },
          ],
        },
      ],
      cta: {
        title: "Welche Systeme sollen miteinander sprechen?",
        description: "Beschreiben Sie die beteiligten Systeme und Datenflüsse.",
        primaryCta: { label: "Projektanfrage stellen", page: "digital/request-a-proposal" },
        secondaryCta: { label: "Anwendungsmodernisierung", page: "digital/application-modernisation" },
      },
    },

    "digital/application-modernisation": {
      label: "Modernisierung",
      meta: {
        title: "Modernisierung von Altanwendungen",
        description:
          "Modernisierung von Legacy-Anwendungen durch soFlott Digital: Analyse, schrittweise Migration und Neuentwicklung alternder Geschäftssoftware ohne Unterbrechung des Tagesgeschäfts.",
        keywords: ["Legacy-Modernisierung", "Softwaremodernisierung", ".NET-Migration"],
      },
      hero: {
        eyebrow: "soFlott Digital · Modernisierung",
        title: "Altanwendungen modernisieren – Schritt für Schritt.",
        intro:
          "Ältere Software ist oft geschäftskritisch und schwer zu ändern. Wir analysieren sie, definieren einen realistischen Migrationspfad und modernisieren in Etappen, während Ihr Geschäft weiterläuft.",
        primaryCta: { label: "Projekt besprechen", page: "digital/request-a-proposal" },
      },
      blocks: [
        {
          kind: "steps",
          title: "Unser Vorgehen",
          steps: [
            {
              title: "Analyse",
              description: "Bestehendes System, Risiken, Abhängigkeiten und Geschäftsregeln verstehen.",
            },
            {
              title: "Zielbild und Fahrplan",
              description: "Zielarchitektur und einen etappenweisen Migrationsplan vereinbaren.",
            },
            {
              title: "Schrittweise Migration",
              description: "Teile einzeln ersetzen oder neu entwickeln, abgesichert durch Tests für das bestehende Verhalten.",
            },
            {
              title: "Übergabe und Betreuung",
              description: "Ergebnis dokumentieren und bei Bedarf im Betrieb betreuen.",
            },
          ],
        },
      ],
      cta: {
        title: "Bremst Sie ein altes System?",
        description: "Beschreiben Sie, was es tut und was schwierig geworden ist.",
        primaryCta: { label: "Projektanfrage stellen", page: "digital/request-a-proposal" },
        secondaryCta: { label: "IT-Beratung", page: "digital/it-consulting" },
      },
    },

    "digital/contract-software-engineering": {
      label: "Vertragseinsätze",
      meta: {
        title: "Software-Engineering auf Vertragsbasis – Kapazität für Ihr Team",
        description:
          "Software-Engineering auf Vertragsbasis von soFlott Digital: erfahrene Full-Stack-Kapazität für Ihre Projekte, beauftragt über die soFlott UG und nach Aufwand abgerechnet.",
        keywords: [
          "Softwareentwickler auf Vertragsbasis",
          "externer Entwickler",
          "Full-Stack-Entwickler extern",
          "Software-Engineering Dienstleister",
        ],
      },
      hero: {
        eyebrow: "soFlott Digital · Vertragseinsätze",
        title: "Engineering-Kapazität für Ihr Team.",
        intro:
          "Wenn Ihr Team für ein Projekt oder einen Zeitraum zusätzliche erfahrene Entwickler braucht, bietet soFlott Digital Software-Engineering auf Vertragsbasis – als B2B-Vertrag mit der soFlott UG.",
        primaryCta: { label: "Vertragseinsatz besprechen", page: "digital/request-a-proposal" },
      },
      blocks: [
        {
          kind: "checklist",
          title: "So sieht ein Vertragseinsatz aus",
          items: [
            "B2B-Vertrag mit der soFlott UG (haftungsbeschränkt)",
            "Definierter Umfang, Laufzeit und Arbeitsweise",
            "Abrechnung freigegebener Zeit zum vereinbarten Stunden- oder Tagessatz",
            "Remote auf Deutsch oder Englisch; vor Ort nach Absprache",
          ],
        },
        {
          kind: "cards",
          title: "Typische Bereiche",
          items: [
            {
              icon: "code",
              title: "Full-Stack-Entwicklung",
              description: "Web-Frontends und Backend-Services in Ihrer bestehenden Codebasis.",
            },
            { icon: "layers", title: ".NET-Backends", description: "ASP.NET-Core-APIs, Services und Datenzugriff." },
            {
              icon: "plug",
              title: "Integrationen",
              description: "APIs und Anbindungen an interne und externe Systeme.",
            },
          ],
        },
      ],
      cta: {
        title: "Sie brauchen zusätzliche Entwickler?",
        description: "Beschreiben Sie Rolle, Technologie und voraussichtliche Dauer.",
        primaryCta: { label: "Vertragseinsatz besprechen", page: "digital/request-a-proposal" },
        secondaryCta: { label: "soFlott Digital kontaktieren", page: "digital/contact" },
      },
    },

    "digital/support-and-maintenance": {
      label: "Support & Wartung",
      meta: {
        title: "Software-Support und Wartung",
        description:
          "Laufender Software-Support und Wartung von soFlott Digital: Fehlerbehebung, Updates, Sicherheitspatches und kontinuierliche Verbesserung für Geschäftsanwendungen, auf Retainer-Basis.",
        keywords: ["Softwarewartung", "Anwendungsbetreuung", "Software-Support"],
      },
      hero: {
        eyebrow: "soFlott Digital · Support",
        title: "Damit Ihre Anwendungen gesund bleiben.",
        intro:
          "Software braucht auch nach dem Livegang Pflege: Updates, Korrekturen und kleine Verbesserungen. Wir betreuen von uns entwickelte Anwendungen und – nach einer Analyse – auch Anwendungen anderer Entwickler.",
        primaryCta: { label: "Projektanfrage stellen", page: "digital/request-a-proposal" },
      },
      blocks: [
        {
          kind: "cards",
          title: "Was Support umfasst",
          items: [
            { icon: "wrench", title: "Fehlerbehebung", description: "Analyse und Korrektur von Fehlern." },
            {
              icon: "shield",
              title: "Updates und Sicherheit",
              description: "Framework- und Abhängigkeits-Updates sowie Sicherheitspatches.",
            },
            {
              icon: "refresh",
              title: "Verbesserungen",
              description: "Kleine Erweiterungen im Rahmen eines vereinbarten Monatsbudgets.",
            },
          ],
        },
        {
          kind: "text",
          title: "Retainer-Vereinbarungen",
          paragraphs: [
            "Support wird in der Regel als monatlicher Retainer mit definiertem Umfang und Reaktionsregeln vereinbart. Arbeiten außerhalb des vereinbarten Umfangs werden als Änderungsanfrage behandelt.",
          ],
        },
      ],
      cta: {
        title: "Sie brauchen laufende Betreuung?",
        description: "Beschreiben Sie die Anwendung und den benötigten Support.",
        primaryCta: { label: "Projektanfrage stellen", page: "digital/request-a-proposal" },
        secondaryCta: { label: "soFlott Digital kontaktieren", page: "digital/contact" },
      },
    },

    "digital/case-studies": {
      label: "Projektbeispiele",
      meta: {
        title: "Projektbeispiele und Referenzen",
        description: "Projektbeispiele von soFlott Digital, veröffentlicht nur mit Freigabe.",
      },
      hero: {
        eyebrow: "soFlott Digital · Projektbeispiele",
        title: "Projektbeispiele.",
        intro:
          "Kundenprojekte veröffentlichen wir nur mit Zustimmung des Kunden. Bis dahin zeigen wir das Projekt, das wir am besten kennen: unsere eigene Plattform.",
      },
      blocks: [
        {
          kind: "text",
          title: "soFlottOS – die Plattform hinter soFlott Express",
          paragraphs: [
            "soFlott Express arbeitet mit soFlottOS, einer von soFlott selbst entwickelten Plattform. Sie deckt den Kurierablauf von der Kundenbuchung bis zur Rechnung ab.",
          ],
          sections: [
            {
              title: "Umfang",
              paragraphs: [
                "Ein Kundenportal für Geschäftskundenkonten, Aufträge und Rechnungen; eine mobile Web-App für Fahrer; digitaler Zustellnachweis; und eine separate interne Verwaltungsanwendung.",
              ],
            },
            {
              title: "Technologie",
              paragraphs: [
                "Eine ASP.NET-Core-REST-API mit MySQL-Datenbank sowie Next.js-/React-Webanwendungen für die öffentliche Website, das Kunden- und Fahrerportal und die Verwaltungskonsole.",
              ],
            },
          ],
        },
        {
          kind: "notice",
          title: "Referenzen",
          text: "Weitere Referenzen besprechen wir gern persönlich, vorbehaltlich der Zustimmung unserer Kunden.",
        },
      ],
      cta: {
        title: "Sie möchten etwas Ähnliches umsetzen?",
        description: "Sprechen wir über Ihr Projekt.",
        primaryCta: { label: "Projekt besprechen", page: "digital/request-a-proposal" },
      },
    },

    "digital/request-a-proposal": {
      label: "Projektanfrage",
      meta: {
        title: "Projektanfrage – Softwareprojekt oder Vertragseinsatz",
        description:
          "Fragen Sie bei soFlott Digital ein Angebot für IT-Beratung, ein Softwareprojekt, API-Integration, Modernisierung, Support oder einen Vertragseinsatz an.",
      },
      hero: {
        eyebrow: "soFlott Digital · Projektanfrage",
        title: "Erzählen Sie uns von Ihrem Projekt.",
        intro:
          "Beschreiben Sie, was Sie erreichen möchten. Wir antworten mit Rückfragen oder einem Angebot, meist inklusive eines Vorschlags für das passende Zusammenarbeitsmodell.",
      },
      blocks: [
        {
          kind: "form",
          form: "digital-proposal",
          title: "Ihr Projekt",
          intro: "Grobe Angaben genügen – die Details klären wir gemeinsam.",
        },
      ],
    },

    "digital/contact": {
      label: "Kontakt",
      meta: {
        title: "Kontakt soFlott Digital – IT-Beratung & Software",
        description:
          "Kontakt zu soFlott Digital zu IT-Beratung, Softwareprojekten, Angeboten und Vertragseinsätzen.",
      },
      hero: {
        eyebrow: "soFlott Digital · Kontakt",
        title: "Sprechen Sie mit soFlott Digital.",
        intro: "Fragen zu einem Projekt, einem Angebot oder einem Vertragseinsatz? Melden Sie sich.",
        primaryCta: { label: "Projektanfrage stellen", page: "digital/request-a-proposal" },
      },
      blocks: [
        { kind: "contact", title: "Kontakt soFlott Digital" },
        { kind: "form", form: "contact", title: "Nachricht senden" },
      ],
    },
  },

  forms: {
    required: "Pflichtfeld",
    optional: "optional",
    submit: "E-Mail vorbereiten",
    submitting: "Wird vorbereitet…",
    successTitle: "Ihre E-Mail ist bereit zum Senden",
    successText:
      "Ihr E-Mail-Programm sollte jetzt die vorbereitete Nachricht anzeigen. Bitte senden Sie sie ab, um Ihre Anfrage abzuschließen. Falls sich nichts geöffnet hat, schreiben Sie uns direkt an {email}.",
    privacyConsent: "Ich bin einverstanden, dass die soFlott UG meine Angaben zur Beantwortung dieser Anfrage verwendet.",
    privacyLink: "Datenschutzerklärung",
    errors: {
      required: "Bitte füllen Sie dieses Feld aus.",
      email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      consent: "Bitte bestätigen Sie, damit wir Ihre Anfrage beantworten können.",
      summary: "Bitte prüfen Sie die markierten Felder.",
    },
    fields: {
      company: { label: "Unternehmen" },
      name: { label: "Ihr Name" },
      email: { label: "E-Mail" },
      phone: { label: "Telefon" },
      country: { label: "Land" },
      message: { label: "Nachricht" },
      topic: { label: "Thema" },
      pickup: { label: "Abholort", hint: "PLZ und Ort oder vollständige Adresse" },
      delivery: { label: "Zustellort", hint: "PLZ und Ort oder vollständige Adresse" },
      date: { label: "Gewünschtes Datum und Zeitfenster" },
      shipment: { label: "Sendung", hint: "Was wird versendet, Anzahl, ungefähre Größe und Gewicht" },
      area: { label: "Touren oder Zustellgebiet", hint: "Wo die Zustellungen stattfinden" },
      volume: { label: "Erwartete Menge", hint: "z. B. Stopps oder Pakete pro Tag, Tage pro Woche" },
      startDate: { label: "Geplanter Start" },
      engagement: { label: "Art des Einsatzes" },
      timeline: { label: "Zeitrahmen" },
      budget: { label: "Budget oder Satzvorstellung" },
      stops: {
        label: "Stopps",
        hint: "Abhol- und Zustelladressen der Tour, in der üblichen Reihenfolge",
      },
      schedule: { label: "Einsatztage und Zeitfenster", hint: "z. B. Mo, Mi, Fr, 8–10 Uhr" },
    },
    expressQuote: {
      typeLegend: "Was benötigen Sie?",
      types: {
        direct: "Eine einzelne Zustellung für mein Unternehmen",
        routes: "Eine wiederkehrende Tour für die regelmäßigen Zustellungen meines Unternehmens",
        subcontracting: "Zustellkapazität für mein Logistiknetz (Logistikunternehmen)",
      },
      engagementOptions: ["Feste Tour", "Zustellgebiet", "Tägliche Touren mit variabler Menge", "Noch offen"],
      subject: {
        direct: "Anfrage Zustellangebot",
        routes: "Anfrage Tourenangebot",
        subcontracting: "Anfrage Subunternehmer-Angebot",
      },
    },
    digitalProposal: {
      engagementOptions: [
        "IT-Beratung",
        "Softwareprojekt",
        "API / Systemintegration",
        "Anwendungsmodernisierung",
        "Vertragseinsatz",
        "Support und Wartung",
        "Noch offen",
      ],
      subject: "Projektanfrage",
    },
    contact: {
      topicOptions: {
        express: "soFlott Express – Kurier & Logistik",
        digital: "soFlott Digital – IT & Software",
        general: "Allgemeine Anfrage",
      },
      subject: "Anfrage über die Website",
    },
  },

  imprint: {
    company: "Unternehmen",
    address: "Anschrift",
    managingDirectors: "Geschäftsführung",
    register: "Handelsregister",
    vatId: "Umsatzsteuer-Identifikationsnummer",
    contact: "Kontakt",
    divisions: "Geschäftsbereiche",
  },

  footer: {
    tagline:
      "Kurier & Logistik sowie IT & Softwareentwicklung für Geschäftskunden – aus einem verantwortlichen Unternehmen.",
    columns: [
      {
        title: "soFlott Express",
        links: [
          "express",
          "express/direct-b2b-delivery",
          "express/logistics-subcontracting",
          "express/contracted-delivery-routes",
          "express/service-areas",
          "express/request-a-quote",
        ],
      },
      {
        title: "soFlott Digital",
        links: [
          "digital",
          "digital/it-consulting",
          "digital/software-development",
          "digital/api-integration",
          "digital/application-modernisation",
          "digital/request-a-proposal",
        ],
      },
      {
        title: "Unternehmen",
        links: ["about", "contact", "legal/imprint", "legal/privacy"],
      },
    ],
    contactTitle: "Kontakt",
    legalNote: "soFlott Express und soFlott Digital sind Geschäftsbereiche der soFlott UG (haftungsbeschränkt).",
    copyright: (year, company) => `© ${year} ${company}. Alle Rechte vorbehalten.`,
  },
};
