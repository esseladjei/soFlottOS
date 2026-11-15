// ---------------------------------------------------------------------------
// GERMAN marketing copy (default language).
//
// Must contain exactly the same pages and fields as `en.ts` - TypeScript
// enforces this. Read the content rules at the top of `types.ts` before
// editing: no invented numbers, clients, certifications or service promises.
// ---------------------------------------------------------------------------

import { legalPagesDe } from "@/content/marketing/legal-de";
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
      "Entwurf: Diese Seite wird vor dem Livegang rechtlich geprüft und finalisiert.",
    toBeCompleted: "wird ergänzt",
  },

  nav: {
    ariaLabel: "Hauptnavigation",
    menuLabel: "Menü öffnen",
    items: ["express", "digital", "about", "contact"],
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
      tagline: "Digitale Lösungen & IT-Beratung",
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
      cta: { label: "Angebot anfragen", page: "digital/request-a-proposal" },
    },
  },

  pages: {
    // ----------------------------------------------------------------------
    // Unternehmen
    // ----------------------------------------------------------------------
    home: {
      label: "Startseite",
      meta: {
        title: "Kurierdienst und digitale Lösungen für Unternehmen",
        description:
          "soFlott Express bietet B2B-Kurier- und Logistikleistungen. soFlott Digital bietet digitale Lösungen und IT-Beratung für Unternehmen.",
      },
      hero: {
        eyebrow: "soFlott UG (haftungsbeschränkt)",
        title: "Kurierdienst und digitale Lösungen für Unternehmen",
        intro:
          "soFlott Express übernimmt Zustellungen und Logistik für Unternehmen. soFlott Digital bietet digitale Lösungen und IT-Beratung. Beide sind Geschäftsbereiche der soFlott UG.",
        primaryCta: { label: "soFlott Express", page: "express" },
        secondaryCta: { label: "soFlott Digital", page: "digital" },
      },
      blocks: [
        {
          kind: "divisions",
          eyebrow: "Unsere Geschäftsbereiche",
          title: "Finden Sie die passende Leistung",
          intro:
            "Informieren Sie sich über unsere Leistungen und kontaktieren Sie das passende Team für Ihr Anliegen.",
          items: [
            {
              division: "express",
              name: "soFlott Express",
              summary:
                "Kurier- und Logistikleistungen für Unternehmen, von einzelnen Zustellungen über regelmäßige Touren bis zur Unterstützung von Logistikunternehmen.",
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
                "Digital Engineering, Systemintegration, Softwaremodernisierung und Technologieberatung für Unternehmen.",
              points: [
                "IT-Beratung und technische Architektur",
                "Digital Engineering und Vertragseinsätze",
                "API-Entwicklung und Systemintegration",
                "Softwaremodernisierung und laufende technische Betreuung",
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
                "Umfang, Preise und Leistungsniveau vereinbaren wir vor Beginn jeder Zustellung, Tour oder jedes Projekts schriftlich.",
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
        description: "Beschreiben Sie kurz Ihr Vorhaben. Wir verbinden Sie mit der richtigen Ansprechperson.",
        primaryCta: { label: "Kontakt aufnehmen", page: "contact" },
        secondaryCta: { label: "Über soFlott", page: "about" },
      },
    },

    about: {
      label: "Über uns",
      meta: {
        title: "Über die soFlott UG und ihre Geschäftsbereiche",
        description:
          "Wer hinter soFlott steht: die soFlott UG (haftungsbeschränkt), ein in Deutschland eingetragenes Unternehmen mit den Geschäftsbereichen soFlott Express und soFlott Digital.",
      },
      hero: {
        eyebrow: "Über uns",
        title: "soFlott UG (haftungsbeschränkt)",
        intro:
          "Ein deutsches Unternehmen für Geschäftskunden in den Bereichen Kurier und Logistik sowie digitale Lösungen und IT-Beratung.",
      },
      blocks: [
        {
          kind: "text",
          title: "Eine Gesellschaft, zwei Geschäftsbereiche",
          paragraphs: [
            "soFlott Express und soFlott Digital sind Geschäftsbereiche der soFlott UG (haftungsbeschränkt), keine eigenständigen Gesellschaften. Verträge, Rechnungen und Registrierungen laufen über die soFlott UG.",
            "Die beiden Geschäftsbereiche erfüllen unterschiedliche Anforderungen: von einer einzelnen Zustellung oder der Suche nach einem Logistikpartner bis hin zu technischer Beratung und Engineering-Unterstützung.",
          ],
        },
        {
          kind: "text",
          title: "Warum Logistik und Software?",
          paragraphs: [
            "Für unseren Kurierdienst haben wir die Software selbst entwickelt. Sie umfasst Buchung, Disposition, Fahrer-App, Zustellnachweis und Rechnungsstellung. Diese Erfahrung ist die Grundlage von soFlott Digital.",
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
              description: "Digital Engineering, IT-Beratung, Integration, Modernisierung und technische Betreuung.",
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
        title: "Kontakt zu soFlott Express und Digital",
        description:
          "Kontakt zur soFlott UG für Kurier- und Logistikleistungen, digitale Lösungen und IT-Beratung.",
      },
      hero: {
        eyebrow: "Kontakt",
        title: "Wie können wir helfen?",
        intro:
          "Für Fragen zu Zustellungen oder technischen Anliegen kontaktieren Sie den passenden Geschäftsbereich. Für allgemeine Anliegen schreiben Sie uns hier.",
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
              description: "IT-Beratung, Integration, Engineering-Einsätze und technische Betreuung.",
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

    // Privacy policy, terms and cookie page: see `legal-de.ts`.
    ...legalPagesDe,

    // ----------------------------------------------------------------------
    // soFlott Express
    // ----------------------------------------------------------------------
    express: {
      label: "Überblick",
      meta: {
        title: "soFlott Express | B2B-Kurier und Logistik",
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
          "Wir stellen einzelne Sendungen zu, fahren regelmäßige Touren für Unternehmen und bieten Logistikunternehmen zusätzliche Zustellkapazität.",
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
                "Ihre eigenen Waren zwischen Ihren Standorten, Lieferanten oder Stammkunden",
                "Pakete Ihrer Kunden, zugestellt im Auftrag Ihres Logistiknetzes",
              ],
            },
            {
              label: "Beauftragung",
              values: [
                "Einzelner Zustellauftrag",
                "Tourenvereinbarung mit festgelegten Stopps, Tagen und Zeitfenstern",
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
              description: "Von Ihrer Anfrage bis zum Zustellnachweis und zur Rechnung.",
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
          "Wir holen Sendungen an einem Geschäftsstandort ab und stellen sie an einem anderen zu. Sie erhalten ein Angebot, einen Zustellnachweis und eine B2B-Rechnung.",
        primaryCta: { label: "Zustellangebot anfragen", page: "express/request-a-quote" },
        secondaryCta: { label: "B2B-Zustellkonto erstellen", href: "/register" },
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
            "Nennen Sie uns bei der Anfrage Ihr gewünschtes Abhol- und Zustellzeitfenster. Vor der Buchung bestätigen wir das früheste Zeitfenster, das wir einhalten können.",
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
                "Sie können ein Angebot auch ohne Konto anfragen. Das Kundenportal ist für Geschäftskunden von soFlott Express vorgesehen, um Zustellungen zu buchen, Aufträge zu verfolgen und Rechnungen herunterzuladen.",
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
        description: "Senden Sie uns Adressen, Zeitfenster und Sendungsdetails. Wir antworten mit einem Angebot.",
        primaryCta: { label: "Zustellangebot anfragen", page: "express/request-a-quote" },
        secondaryCta: { label: "Beim B2B-Zustellkonto anmelden", href: "/login" },
      },
    },

    "express/logistics-subcontracting": {
      label: "Logistik-Subunternehmer",
      meta: {
        title: "Logistik-Subunternehmer für Zustellunternehmen",
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
          "Logistikunternehmen, Paketdienste und Distributoren beauftragen soFlott mit Zustellkapazität oder dem Betrieb von Zustellabläufen in ihrem Netz. Wir stellen die Pakete ihrer Kunden auf Basis eines Rahmenvertrags zu, dokumentieren jede Tour und rechnen wie vereinbart ab.",
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
                "Pro erledigtem Stopp oder Paket, feste Tourenpauschale oder Grundpauschale plus variable Menge, wie vertraglich vereinbart.",
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
            "Mengenabgleich vor der Rechnungsstellung",
          ],
        },
        {
          kind: "notice",
          title: "Kein Logistikunternehmen?",
          text:
            "Eine vertragliche Zustelltour passt, wenn Ihr Unternehmen eigene Waren regelmäßig versendet, zum Beispiel zwischen Filialen oder jede Woche an dieselben Kunden.",
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
          "Eine vertragliche Tour ersetzt wiederholte Einzelaufträge, wenn Ihr Unternehmen regelmäßig zustellt. Stopps, Tage, Zeitfenster und Preise vereinbaren wir im Voraus. Sie müssen die Zustellungen nicht einzeln beauftragen.",
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
        description: "Beschreiben Sie Stopps, Tage und Mengen. Wir erstellen ein Angebot.",
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
        title: "Kurierdienst in Augsburg, Mering und München",
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
            "Für Direktzustellungen außerhalb dieses Gebiets senden Sie uns die Strecke. Wir bestätigen, ob und wann wir sie fahren können. Bei Subunternehmerleistungen werden Zustellgebiete im Vertrag festgelegt.",
          ],
        },
      ],
      cta: {
        title: "Wird Ihre Strecke abgedeckt?",
        description: "Senden Sie Abhol- und Zustellorte. Wir bestätigen die Verfügbarkeit mit dem Angebot.",
        primaryCta: { label: "Angebot anfragen", page: "express/request-a-quote" },
        secondaryCta: { label: "soFlott Express kontaktieren", page: "express/contact" },
      },
    },

    "express/how-it-works": {
      label: "So funktioniert’s",
      meta: {
        title: "soFlott Express: Von der Anfrage bis zur Rechnung",
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
                "Senden Sie Abhol- und Zustelladresse, gewünschtes Zeitfenster und Sendungsdetails per Formular, Telefon oder im Kundenportal.",
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
        description: "Wählen Sie im Formular, ob Sie ein Zustellangebot, ein Tourenangebot oder ein Subunternehmer-Angebot anfragen möchten.",
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
        title: "Kontakt zu soFlott Express für Kurier und Logistik",
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
        title: "soFlott Digital | Digitale Lösungen & IT-Beratung",
        description:
          "Digital Engineering, Systemintegration, Softwaremodernisierung und Technologieberatung für Unternehmen.",
        keywords: [
          "IT-Beratung",
          "digitale Lösungen",
          "Systemintegration",
          "Softwaremodernisierung",
          "Engineering auf Vertragsbasis",
        ],
      },
      hero: {
        eyebrow: "soFlott Digital",
        descriptor: "Digitale Lösungen & IT-Beratung",
        title: "Technologie, die Ihr Unternehmen voranbringt.",
        intro:
          "Digital Engineering, Systemintegration, Softwaremodernisierung und Technologieberatung für Unternehmen.",
        primaryCta: { label: "Anliegen besprechen", page: "digital/request-a-proposal" },
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
            { label: "Nach Aufwand", values: ["Engineering und technische Leistungen", "Freigegebene Zeit × vereinbarter Satz"] },
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
            "Wir arbeiten mit Kunden in Deutschland und sind offen für Projekte mit Unternehmen in Großbritannien, Irland, den VAE und anderswo. Diese Projekte betreuen wir remote und auf Englisch.",
          ],
        },
      ],
      cta: {
        title: "Sprechen wir über Ihr technisches Anliegen",
        description: "Beschreiben Sie Ihr Projekt, Ihren Engineering-Einsatz oder Ihren Betreuungsbedarf. Wir antworten mit Rückfragen oder einem Angebot.",
        primaryCta: { label: "Angebot anfragen", page: "digital/request-a-proposal" },
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
              description: "Vergleich der Optionen Entwickeln, Kaufen und Integrieren für Ihre Situation.",
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
        primaryCta: { label: "Angebot anfragen", page: "digital/request-a-proposal" },
        secondaryCta: { label: "Softwareentwicklung", page: "digital/software-development" },
      },
    },

    "digital/software-development": {
      label: "Softwareentwicklung",
      meta: {
        title: "Individuelle Softwareentwicklung und Full-Stack-Webanwendungen",
        description:
          "Individuelle B2B-Softwareentwicklung von soFlott Digital: Full-Stack-Webanwendungen mit ASP.NET Core / .NET und modernen Webtechnologien als Festpreis-, Meilenstein- oder Aufwandsprojekt.",
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
          "Wir konzipieren und entwickeln Geschäftsanwendungen für Ihre Prozesse, darunter Webportale, interne Werkzeuge und Workflow-Systeme.",
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
        primaryCta: { label: "Angebot anfragen", page: "digital/request-a-proposal" },
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
        primaryCta: { label: "Angebot anfragen", page: "digital/request-a-proposal" },
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
        title: "Altanwendungen schrittweise modernisieren.",
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
        primaryCta: { label: "Angebot anfragen", page: "digital/request-a-proposal" },
        secondaryCta: { label: "IT-Beratung", page: "digital/it-consulting" },
      },
    },

    "digital/contract-software-engineering": {
      label: "Vertragseinsätze",
      meta: {
        title: "Software-Engineering auf Vertragsbasis für Ihr Team",
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
          "Wenn Ihr Team für ein Projekt oder einen Zeitraum zusätzliche erfahrene Entwickler braucht, bietet soFlott Digital Software-Engineering auf Basis eines B2B-Vertrags mit der soFlott UG.",
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
          "Software braucht auch nach dem Livegang Pflege: Updates, Korrekturen und kleine Verbesserungen. Wir betreuen von uns entwickelte Anwendungen und nach einer Analyse auch Anwendungen anderer Entwickler.",
        primaryCta: { label: "Angebot anfragen", page: "digital/request-a-proposal" },
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
        primaryCta: { label: "Angebot anfragen", page: "digital/request-a-proposal" },
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
          title: "soFlottOS, die Plattform hinter soFlott Express",
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
      label: "Angebot anfragen",
      meta: {
        title: "Angebot für digitale Lösungen und IT-Beratung anfragen",
        description:
          "Fragen Sie bei soFlott Digital ein Angebot für IT-Beratung, ein Softwareprojekt, API-Integration, Modernisierung, Support oder einen Vertragseinsatz an.",
      },
      hero: {
        eyebrow: "soFlott Digital · Angebotsanfrage",
        title: "Erzählen Sie uns von Ihrem Anliegen.",
        intro:
          "Beschreiben Sie, was Sie erreichen möchten. Wir antworten mit Rückfragen oder einem Angebot, meist inklusive eines Vorschlags für das passende Zusammenarbeitsmodell.",
      },
      blocks: [
        {
          kind: "form",
          form: "digital-proposal",
          title: "Ihre Anfrage",
          intro: "Teilen Sie uns mit, was Sie bereits wissen. Die Details klären wir gemeinsam.",
        },
      ],
    },

    "digital/contact": {
      label: "Kontakt",
      meta: {
        title: "Kontakt zu soFlott Digital für digitale Lösungen und IT",
        description:
          "Kontakt zu soFlott Digital für IT-Beratung, Systemintegration, Engineering-Einsätze und technische Betreuung.",
      },
      hero: {
        eyebrow: "soFlott Digital · Kontakt",
        title: "Sprechen Sie mit soFlott Digital.",
        intro: "Kontaktieren Sie uns zu Beratung, Engineering-Einsätzen, Integration oder laufender Betreuung.",
        primaryCta: { label: "Angebot anfragen", page: "digital/request-a-proposal" },
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
      schedule: { label: "Einsatztage und Zeitfenster", hint: "z. B. Mo, Mi, Fr, 8 bis 10 Uhr" },
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
      subject: "Angebotsanfrage",
    },
    contact: {
      topicOptions: {
        express: "soFlott Express: Kurier und Logistik",
        digital: "soFlott Digital: IT und Software",
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
      "Kurier- und Logistikleistungen, digitale Lösungen und IT-Beratung für Unternehmen.",
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
        links: ["about", "contact"],
      },
    ],
    contactTitle: "Kontakt",
    legalNote: "soFlott Express und soFlott Digital sind Geschäftsbereiche der soFlott UG (haftungsbeschränkt).",
    copyright: (year, company) => `© ${year} ${company}. Alle Rechte vorbehalten.`,
  },
};
