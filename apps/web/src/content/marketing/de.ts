// ---------------------------------------------------------------------------
// GERMAN marketing copy (the default language of the site).
//
// This file holds every word a visitor reads on the public pages. Edit the text
// here - you never need to touch a React component to change the wording.
//
// Phone number, e-mail and company address come from `src/lib/site.ts`.
// ---------------------------------------------------------------------------

import type { MarketingContent } from "@/content/marketing/types";

export const de: MarketingContent = {
  common: {
    skipToContent: "Zum Inhalt springen",
    languageLabel: "Sprache wählen",
    phone: "Telefon",
    email: "E-Mail",
    callNow: "Jetzt anrufen",
    moreInfo: "Mehr erfahren",
    vatNote: "Alle Preise zzgl. 19 % MwSt.",
  },

  nav: {
    ariaLabel: "Hauptnavigation",
    items: [
      { page: "services", label: "Leistungen" },
      { page: "industries", label: "Branchen" },
      { page: "pricing", label: "Preise" },
      { page: "platform", label: "Technologie" },
      { page: "security", label: "Sicherheit" },
      { page: "contact", label: "Kontakt" },
    ],
    login: "Kundenlogin",
    cta: "Direktfahrt anfragen",
  },

  home: {
    meta: {
      title: "Kurierdienst Augsburg & München | Eiltransport für Gewerbe",
      description:
        "soFlott ist Ihr regionaler Direktkurier für Gewerbekunden in Augsburg, Mering und München: Eiltransporte ohne Umladung, Abholung in 15 Minuten, digitale Unterschrift in Echtzeit und transparente Festpreise zzgl. 19 % MwSt.",
      keywords: [
        "Kurierdienst Augsburg",
        "Kurierdienst Mering",
        "Kurierdienst München",
        "Eiltransport Augsburg",
        "Direktfahrt buchen",
        "Expresskurier Gewerbe",
        "Kurierdienst Notfall",
        "Direktkurier Augsburg",
        "Sonderfahrt München",
        "B2B Kurier",
        "Ersatzteile Kurier Werkstatt",
        "Kurier Kanzlei Gerichtsunterlagen",
        "Dentallabor Kurier",
        "Medizinischer Kurierdienst",
      ],
    },
    hero: {
      eyebrow: "soFlott. Schnell für Unternehmen.",
      headlineLead: "Ihr regionaler Direktkurier",
      headlineHighlight: "für Gewerbe.",
      subheadline:
        "Wenn ein Ersatzteil fehlt, eine Frist läuft oder ein Kunde wartet, zählt jede Minute. soFlott fährt Ihre Sendung ohne Zwischenstopp und ohne Sortierzentrum direkt von A nach B – mit digitaler Empfangsunterschrift, Live-Status und B2B-Rechnung per E-Mail.",
      primaryCta: { label: "Direktfahrt anfragen", href: "/register" },
      secondaryCta: { label: "Preise ansehen", page: "pricing" },
      bullets: [
        "Abholung in 15 Minuten startklar",
        "Keine Umladung, kein Sortierzentrum",
        "Digitale Unterschrift & GPS-Nachweis",
        "Festpreis zzgl. 19 % MwSt.",
      ],
      note: "Erstkunden erhalten 20 % Rabatt auf die erste Direktfahrt.",
      panel: {
        eyebrow: "Heute bei soFlott",
        title: "Ihre Sendung im Blick",
        stats: [
          { label: "Direktfahrten heute", value: "24", caption: "alle im Zeitfenster" },
          { label: "Pünktlichkeit", value: "98,7 %", caption: "letzte 30 Tage" },
        ],
        liveLabel: "Nächste Abholung",
        liveValue: "in 18 Min.",
        routeFrom: "Werkstatt Mering",
        routeTo: "Augsburg",
        routeSeparator: "nach",
      },
    },

    trustBar: [
      { icon: "route", label: "0 Umladungen" },
      { icon: "signature", label: "Digitale Übergabebestätigung" },
      { icon: "euro", label: "Transparente Festpreise" },
      { icon: "receipt", label: "B2B-Rechnung per E-Mail" },
      { icon: "clock", label: "Sofortdisposition" },
    ],

    comparison: {
      eyebrow: "Der Unterschied",
      title: "Paketdienst oder Direktfahrt? Der Unterschied kostet Sie Stunden.",
      intro:
        "Klassische Paketdienste sind für Masse gebaut, nicht für Dringlichkeit. Ihre Sendung läuft über Sammelstellen, Sortierzentren und wechselnde Fahrer. Eine Direktfahrt kennt nur einen Fahrer, ein Fahrzeug und zwei Adressen.",
      columnOther: "Klassischer Paketdienst",
      columnSoFlott: "soFlott Direktfahrt",
      rows: [
        {
          label: "Transportweg",
          other: "Sammelstelle, Sortierzentrum, mehrere Umladungen",
          soFlott: "Direkt vom Absender zum Empfänger, ohne Zwischenstopp",
        },
        {
          label: "Laufzeit",
          other: "1 bis 3 Werktage, ohne feste Zusage",
          soFlott: "Noch heute – oft innerhalb von 40 bis 90 Minuten",
        },
        {
          label: "Abholung",
          other: "Feste Tour, einmal täglich",
          soFlott: "Auf Abruf, in der Regel in 15 Minuten startklar",
        },
        {
          label: "Nachweis",
          other: "Sammelunterschrift oder Ablage ohne Beleg",
          soFlott: "Namentliche digitale Unterschrift mit Zeitstempel und GPS",
        },
        {
          label: "Risiko",
          other: "Sortierschäden, Fehlleitungen, verlorene Sendungen",
          soFlott: "Die Fracht verlässt das Fahrzeug nur beim Empfänger",
        },
        {
          label: "Abrechnung",
          other: "Pauschaltarife, Zuschläge im Kleingedruckten",
          soFlott: "Festpreis vorab, GoBD-konforme Rechnung per E-Mail",
        },
      ],
    },

    usps: {
      eyebrow: "Warum soFlott",
      title: "Drei Gründe, warum Betriebe zu uns wechseln.",
      intro:
        "Wir sind kein weiterer Paketdienst. soFlott ist für den Moment gebaut, in dem etwas sofort ankommen muss – und in dem Sie hinterher beweisen können müssen, dass es angekommen ist.",
      items: [
        {
          icon: "route",
          title: "Null Sortierzentren",
          description:
            "Ihre Fracht geht direkt vom Absenderfahrzeug an die Empfängeradresse, ohne Umschlaglager und ohne Fahrerwechsel. Was eingeladen wird, wird genau so wieder ausgeladen.",
          proof: "0 % Sortierschäden, 0 % Fehlleitungen",
        },
        {
          icon: "smartphone",
          title: "Digitale Transparenz",
          description:
            "Sie sehen den Status jeder Sendung in Echtzeit im Kundenportal. Bei der Übergabe unterschreibt der Empfänger digital auf dem Fahrergerät – inklusive Name, Uhrzeit und GPS-Position.",
          proof: "Unterschrift, Zeitstempel und Standort in einem Beleg",
        },
        {
          icon: "clock",
          title: "Regionale Geschwindigkeit",
          description:
            "Wir disponieren sofort statt am nächsten Werktag. Für die gewerblichen Korridore im Raum Augsburg, Mering und München sagen wir Ihnen verbindlich zu, wann der Fahrer bei Ihnen ist.",
          proof: "In der Regel in 15 Minuten abholbereit",
        },
      ],
    },

    segments: {
      eyebrow: "Für wen wir fahren",
      title: "Spezialisiert auf Branchen, in denen Verspätung richtig teuer wird.",
      intro:
        "Ein stehender Hebebühnenplatz, eine versäumte Gerichtsfrist oder ein zerbrochenes Zahnmodell kosten weit mehr als eine Direktfahrt. Genau dafür gibt es soFlott.",
      painLabel: "Das Problem",
      cargoLabel: "Typische Fracht",
      items: [
        {
          icon: "wrench",
          name: "Werkstätten & Industrie",
          pain:
            "Jede Stunde, in der ein Fahrzeug auf der Hebebühne auf ein Teil wartet, kostet Sie abrechenbare Zeit und einen wartenden Kunden.",
          cargo: "Lichtmaschinen, Dichtungen, Not-Ersatzteile, Diagnosegeräte, Werkzeuge",
          hook:
            "Schluss mit toter Hebebühnenzeit: Wir bringen Ihr Ersatzteil in unter 40 Minuten quer durch die Stadt.",
        },
        {
          icon: "gavel",
          name: "Kanzleien & Steuerberater",
          pain:
            "Fristen kennen keine Kulanz, und für Originale und beglaubigte Dokumente brauchen Sie eine lückenlose Übergabekette.",
          cargo: "Originalverträge, Schriftsätze, notarielle Urkunden, Prüfungsakten",
          hook:
            "E-Mail ersetzt kein Original bei Gericht. Fristgerechte Zustellung mit beweisfähiger Unterschrift in Echtzeit.",
        },
        {
          icon: "hospital",
          name: "Dentallabore & Medizin",
          pain:
            "Unzuverlässige Fahrer verlieren empfindliche Einzelanfertigungen oder reißen das Zeitfenster für Proben.",
          cargo: "Kronen, Abformungen, Prothetik, Laborproben, eilige Medizinprodukte",
          hook:
            "Medizintransport mit Fingerspitzengefühl – inklusive sofortiger Signaturbenachrichtigung an Ihre Laborleitung.",
        },
        {
          icon: "printer",
          name: "Druckereien & Eventagenturen",
          pain:
            "Nachdrucke in letzter Minute oder fehlendes Material vor Ort gefährden den gesamten Auftritt.",
          cargo: "Baupläne, Messebanner, Eventbadges, Andrucke, Musterstücke",
          hook:
            "Notfall-Lieferungen für Druck und Event – direkt an den Messestand oder die Baustelle.",
        },
      ],
      cta: { label: "Alle Branchenlösungen ansehen", page: "industries" },
    },

    cargo: {
      eyebrow: "Was wir transportieren",
      title: "Vom Dichtungssatz bis zur Gerichtsakte.",
      intro:
        "Wenn es in ein Fahrzeug passt, zeitkritisch ist und in der Region bleibt, ist es ein Fall für soFlott. Pro Fahrt kalkulieren wir bis 10 kg Standardfracht, größere Sendungen auf Anfrage.",
      groups: [
        {
          icon: "wrench",
          title: "Auto- & Ersatzteile",
          items: [
            "Werkstatt-Direktfahrt vom Großhändler zur Hebebühne",
            "Not-Ersatzteile für stehende Fahrzeuge",
            "Diagnosegeräte und Leihwerkzeug zwischen Filialen",
          ],
        },
        {
          icon: "gavel",
          title: "Kanzlei- & Gerichtsunterlagen",
          items: [
            "Fristgebundene Schriftsätze an Gericht und Behörden",
            "Originalverträge und beglaubigte Urkunden",
            "Mandanten- und Prüfungsakten mit Übergabebestätigung",
          ],
        },
        {
          icon: "hospital",
          title: "Medizin & Dentallabor",
          items: [
            "Kronen, Brücken und Abformungen zwischen Praxis und Labor",
            "Eilige Laborproben im festen Zeitfenster",
            "Dringend benötigte Medizin- und Praxisartikel",
          ],
        },
        {
          icon: "printer",
          title: "Druck, Bau & Event",
          items: [
            "Baupläne und Revisionsunterlagen zur Baustelle",
            "Messebanner, Badges und Eventmaterial",
            "Muster, Andrucke und Farbabstimmungen",
          ],
        },
      ],
      note: "Gefahrgut, Lebendtiere und Wertsachen über 5.000 € transportieren wir nicht.",
    },

    process: {
      eyebrow: "So läuft eine Direktfahrt",
      title: "Von der Anfrage bis zur Rechnung in fünf Schritten.",
      intro:
        "Sie brauchen keine Schulung und keine Software-Einführung. Anfrage stellen, Festpreis bestätigen, fertig – den Rest erledigen Fahrer und System.",
      steps: [
        {
          title: "Anfrage in zwei Minuten",
          description:
            "Abhol- und Zieladresse im Kundenportal eingeben oder anrufen. Sie sehen sofort Entfernung, geschätzte Fahrzeit und den Preis.",
        },
        {
          title: "Festpreis bestätigen",
          description:
            "Netto, 19 % MwSt. und Bruttobetrag stehen vor der Buchung fest. Keine Treibstoffzuschläge, keine Überraschungen auf der Rechnung.",
        },
        {
          title: "Abholung in der Regel in 15 Minuten",
          description:
            "Der nächste verfügbare Fahrer wird sofort disponiert und fährt direkt zu Ihnen. Sie sehen Name und Fahrzeug im Portal.",
        },
        {
          title: "Direktfahrt ohne Zwischenstopp",
          description:
            "Ihre Sendung bleibt im Fahrzeug, bis sie beim Empfänger ist. Den Status verfolgen Sie live, ohne anzurufen.",
        },
        {
          title: "Digitale Übergabe & Rechnung",
          description:
            "Der Empfänger unterschreibt digital. Sie erhalten die Bestätigung mit Name, Uhrzeit und GPS-Position – und die Rechnung automatisch per E-Mail.",
        },
      ],
    },

    platform: {
      eyebrow: "Technologie",
      title: "Jede Fahrt dokumentiert. Jede Rechnung automatisch.",
      intro:
        "soFlott ist ein Kurierdienst mit eigener Software. Das merken Sie nicht an der Fahrt, sondern an allem, was danach kommt: Nachweise, Historie und Buchhaltung sind fertig, bevor Sie danach fragen.",
      items: [
        {
          icon: "map",
          title: "Live-Status statt Rückrufe",
          description:
            "Angenommen, unterwegs, zugestellt: Jeder Schritt ist im Kundenportal sichtbar. Ihr Team muss nicht in der Disposition nachfragen.",
        },
        {
          icon: "signature",
          title: "Digitale Übergabebestätigung",
          description:
            "Unterschrift auf dem Fahrergerät, Name des Empfängers, Zeitstempel und GPS-Position – als beweisfähiger Beleg zu jedem Auftrag.",
        },
        {
          icon: "receipt",
          title: "Automatische B2B-Rechnung",
          description:
            "Zu jedem Auftrag entsteht automatisch eine fortlaufend nummerierte Rechnung mit ausgewiesener Umsatzsteuer – bereit für Ihre Buchhaltung.",
        },
        {
          icon: "building",
          title: "Kundenkonto mit Historie",
          description:
            "Alle Fahrten, Nachweise und Rechnungen Ihres Unternehmens an einem Ort. Ideal für Monatsabschluss und Prüfungen.",
        },
      ],
      cta: { label: "Technologie im Detail", page: "platform" },
    },

    pricing: {
      eyebrow: "Preise",
      title: "Ein Festpreis. Vorab. Ohne Kleingedrucktes.",
      intro:
        "Unser Preis besteht aus einer Grundpauschale und einem Kilometersatz. Sie sehen den Betrag, bevor Sie buchen – und auf der Rechnung steht exakt derselbe.",
      points: [
        {
          icon: "euro",
          title: "Grundpreis plus Kilometer",
          description:
            "Eine transparente Pauschale pro Fahrt zuzüglich eines festen Kilometersatzes für die tatsächliche Strecke.",
        },
        {
          icon: "check",
          title: "Mindestpreis statt Zuschlagstabelle",
          description:
            "Sehr kurze Fahrten rechnen wir zum Mindestpreis ab. Keine Treibstoff-, Innenstadt- oder Wartezuschläge im Kleingedruckten.",
        },
        {
          icon: "receipt",
          title: "19 % MwSt. klar ausgewiesen",
          description:
            "Netto, Steuer und Brutto stehen auf Angebot und Rechnung getrennt – vorsteuerabzugsfähig und prüfungssicher.",
        },
        {
          icon: "calendar",
          title: "Rahmenverträge für Stammkunden",
          description:
            "Bei wiederkehrenden Strecken vereinbaren wir individuelle Konditionen und feste Zeitfenster.",
        },
      ],
      example: {
        title: "Beispielrechnung: 12 km Direktfahrt",
        rows: [
          { label: "Grundpreis", value: "19,50 €" },
          { label: "12 km × 1,35 €", value: "16,20 €" },
          { label: "Nettobetrag", value: "35,70 €" },
          { label: "19 % MwSt.", value: "6,78 €" },
        ],
        totalLabel: "Gesamt brutto",
        totalValue: "42,48 €",
        note: "Beispielkonditionen zur Orientierung. Ihr verbindlicher Festpreis erscheint vor der Buchung im Portal.",
      },
      cta: { label: "Preise und Konditionen", page: "pricing" },
    },

    offer: {
      eyebrow: "Erstkunden-Angebot",
      title: "Testen Sie uns bei Ihrer nächsten dringenden Fahrt – mit 20 % Rabatt.",
      description:
        "Kein Vertrag, keine Mindestmenge, keine Einrichtungsgebühr. Sie buchen eine einzelne Direktfahrt, prüfen Tempo und Nachweis und entscheiden danach, ob wir Ihre Stammstrecken übernehmen.",
      cta: { label: "Erstfahrt mit 20 % Rabatt sichern", href: "/register" },
      note: "Gilt für die erste Direktfahrt neuer Gewerbekunden im Raum Augsburg, Mering und München.",
    },

    area: {
      eyebrow: "Einsatzgebiet",
      title: "Direktfahrten im Raum Augsburg, Mering und München.",
      intro:
        "Wir fahren die gewerblichen Korridore der Region: Gewerbegebiete, Industrieparks, Kanzleiviertel und Innenstadtlagen. Fahrten darüber hinaus organisieren wir als Sonderfahrt auf Anfrage.",
      cities: [
        "Augsburg",
        "Mering",
        "München",
      ],
      note: "Ihr Standort ist nicht dabei? Fragen Sie an – wir prüfen jede Strecke in der Region.",
    },

    faq: {
      eyebrow: "Häufige Fragen",
      title: "Antworten, bevor Sie fragen.",
      intro:
        "Die Fragen, die uns Werkstätten, Kanzleien und Labore vor der ersten Fahrt am häufigsten stellen.",
      items: [
        {
          question: "Wie schnell kann ein Kurier bei mir sein?",
          answer:
            "Im Regelfall ist ein Fahrer innerhalb von 15 Minuten nach Auftragsbestätigung abholbereit. Für Strecken im Raum Augsburg, Mering und München liegt die typische Gesamtlaufzeit zwischen 40 und 90 Minuten, abhängig von Entfernung und Verkehrslage. Sie sehen die geschätzte Zeit bereits in der Preisanzeige.",
        },
        {
          question: "Was kostet eine Direktfahrt?",
          answer:
            "Der Preis setzt sich aus einem Grundpreis und einem festen Kilometersatz für die tatsächlich gefahrene Strecke zusammen, mindestens jedoch der Mindestpreis. Sie erhalten den verbindlichen Festpreis vor der Buchung – netto, mit ausgewiesenen 19 % MwSt. und Bruttobetrag.",
        },
        {
          question: "Was unterscheidet eine Direktfahrt von einem Expresspaket?",
          answer:
            "Ein Expresspaket läuft trotz des Namens über Sammelstellen und Sortierzentren und wechselt mehrfach den Fahrer. Bei einer Direktfahrt holt ein Fahrer Ihre Sendung ab und bringt sie ohne Zwischenstopp zum Empfänger. Dadurch entfallen Sortierschäden, Fehlleitungen und Wartezeiten.",
        },
        {
          question: "Erhalte ich einen Zustellnachweis?",
          answer:
            "Ja. Der Empfänger unterschreibt digital auf dem Gerät des Fahrers. Der Nachweis enthält den Namen des Empfängers, Datum und Uhrzeit sowie die GPS-Position der Übergabe und ist in Ihrem Kundenkonto jederzeit abrufbar.",
        },
        {
          question: "Transportieren Sie auch medizinische Proben und Dentalmodelle?",
          answer:
            "Ja. Dentallabore und medizinische Einrichtungen gehören zu unseren Kernkunden. Empfindliche Einzelanfertigungen und Proben fahren wir in gesicherter Einzelfahrt und benachrichtigen die zuständige Person sofort nach der Übergabe.",
        },
        {
          question: "Wie läuft die Abrechnung für Geschäftskunden?",
          answer:
            "Zu jedem Auftrag entsteht automatisch eine fortlaufend nummerierte Rechnung mit allen Pflichtangaben und ausgewiesener Umsatzsteuer. Sie erhalten sie per E-Mail und finden sie zusätzlich in Ihrem Kundenkonto. Zahlung per Überweisung oder PayPal.",
        },
        {
          question: "Kann ich feste Touren oder Zeitfenster vereinbaren?",
          answer:
            "Ja. Für wiederkehrende Strecken – etwa täglich zwischen Praxis und Labor oder zwischen Filialen – vereinbaren wir feste Zeitfenster und individuelle Konditionen im Rahmenvertrag.",
        },
        {
          question: "Was transportieren Sie nicht?",
          answer:
            "Wir fahren kein Gefahrgut, keine Lebendtiere und keine Wertsachen über 5.000 €. Alles andere, was in ein Fahrzeug passt und in der Region bleibt, können Sie anfragen.",
        },
      ],
    },

    finalCta: {
      title: "Die nächste dringende Fahrt muss kein Stress sein.",
      description:
        "Legen Sie in zwei Minuten ein Geschäftskonto an und buchen Sie Ihre erste Direktfahrt mit 20 % Erstkunden-Rabatt. Oder rufen Sie an – wir disponieren sofort.",
      primaryCta: { label: "Geschäftskonto anlegen", href: "/register" },
      secondaryCta: { label: "Kontakt aufnehmen", page: "contact" },
      phoneLabel: "Direkt und ohne Warteschleife:",
    },
  },

  pages: {
    services: {
      meta: {
        title: "Leistungen: Eiltransport, Direktfahrt & Sonderfahrt",
        description:
          "Direktfahrt, Eiltransport, Sonderfahrt und feste Touren für Gewerbekunden im Raum Augsburg, Mering und München – ohne Umladung, mit digitalem Zustellnachweis und transparentem Festpreis.",
        keywords: [
          "Eiltransport",
          "Direktfahrt buchen",
          "Sonderfahrt Augsburg, Mering und München",
          "Kurierdienst Gewerbe",
          "Expresskurier",
          "feste Kurierfahrten",
        ],
      },
      eyebrow: "Leistungen",
      title: "Vier Arten zu fahren. Immer direkt.",
      intro:
        "Ob einmaliger Notfall oder tägliche Stammstrecke: Wir bilden den gleichen Qualitätsstandard in vier Auftragsarten ab.",
      lead: [
        "soFlott ist auf zeitkritische B2B-Transporte in der Region spezialisiert. Wir betreiben keine Sammelstellen und keine Sortierzentren – jede Sendung ist eine eigene Fahrt mit einem verantwortlichen Fahrer.",
        "Das macht uns bei großen Mengen teurer als einen Paketdienst und bei dringenden Einzelsendungen deutlich schneller, sicherer und nachweisbarer.",
      ],
      sections: [
        {
          title: "Unsere Auftragsarten",
          description:
            "Alle Varianten enthalten Direktfahrt ohne Umladung, Live-Status und digitale Übergabebestätigung.",
          items: [
            {
              icon: "truck",
              title: "Direktfahrt",
              description:
                "Die Standardfahrt: Abholung auf Abruf, Fahrt ohne Zwischenstopp, Übergabe mit digitaler Unterschrift. Ideal für Ersatzteile, Dokumente und Proben.",
            },
            {
              icon: "alert",
              title: "Notfall-Eiltransport",
              description:
                "Höchste Priorität bei Produktionsstillstand, Fristablauf oder wartendem Kunden. Wir disponieren sofort den nächstgelegenen verfügbaren Fahrer.",
            },
            {
              icon: "map",
              title: "Sonderfahrt über die Region hinaus",
              description:
                "Längere Strecken außerhalb des Kerngebiets planen wir individuell und nennen Festpreis und Ankunftszeit vorab.",
            },
            {
              icon: "calendar",
              title: "Feste Touren & Rahmenverträge",
              description:
                "Wiederkehrende Strecken zu festen Zeitfenstern, etwa Praxis zu Labor oder Zentrale zu Filiale, mit individuellen Konditionen.",
            },
          ],
        },
        {
          title: "In jeder Fahrt enthalten",
          description: "Kein Aufpreis, keine Optionspakete – das ist der Standard.",
          items: [
            {
              icon: "route",
              title: "Keine Umladung",
              description:
                "Ihre Sendung verlässt das Fahrzeug erst beim Empfänger. Das schließt Sortierschäden und Fehlleitungen praktisch aus.",
            },
            {
              icon: "signature",
              title: "Digitaler Zustellnachweis",
              description:
                "Unterschrift des Empfängers, Name, Zeitstempel und GPS-Position – abrufbar in Ihrem Kundenkonto.",
            },
            {
              icon: "euro",
              title: "Festpreis vorab",
              description:
                "Netto, 19 % MwSt. und Brutto stehen vor der Buchung fest und erscheinen unverändert auf der Rechnung.",
            },
            {
              icon: "receipt",
              title: "Automatische Rechnung",
              description:
                "Fortlaufend nummeriert, mit allen Pflichtangaben, direkt per E-Mail und im Kundenkonto.",
            },
          ],
        },
      ],
      highlights: [
        "Abholung in der Regel in 15 Minuten startklar",
        "Ein Fahrer von der Abholung bis zur Übergabe",
        "Bis 10 kg Standardfracht, größere Sendungen auf Anfrage",
      ],
      cta: {
        title: "Welche Fahrt brauchen Sie heute?",
        description:
          "Legen Sie ein Geschäftskonto an und sehen Sie den Festpreis sofort – oder sprechen Sie mit uns über feste Touren.",
        primaryCta: { label: "Direktfahrt anfragen", href: "/register" },
        secondaryCta: { label: "Preise ansehen", page: "pricing" },
      },
    },

    industries: {
      meta: {
        title: "Branchen: Kurier für Werkstatt, Kanzlei, Dentallabor & Druckerei",
        description:
          "Branchenlösungen von soFlott: Werkstatt-Direktfahrt für Ersatzteile, fristgerechter Kanzleikurier, Medizin- und Dentaltransport sowie Eillieferungen für Druck und Event.",
        keywords: [
          "Kurier Werkstatt Ersatzteile",
          "Kanzlei Kurierdienst",
          "Dentallabor Kurier",
          "medizinischer Kurierdienst",
          "Kurier Druckerei Messe",
          "Branchenkurier Augsburg, Mering und München",
        ],
      },
      eyebrow: "Branchen",
      title: "Vier Branchen, ein gemeinsamer Nenner: Zeitdruck.",
      intro:
        "Wir kennen die Abläufe unserer Kundengruppen genau genug, um mitzudenken statt nur zu fahren.",
      lead: [
        "Ein Kurierdienst, der jeden Tag dieselben Branchen bedient, weiß, worauf es ankommt: an welcher Rampe der Großhändler ausgibt, wie eine Gerichtsfrist läuft und warum ein Zahnmodell nicht umgepackt werden darf.",
        "Deshalb konzentrieren wir uns auf vier Segmente, statt alles ein bisschen zu machen.",
      ],
      sections: [
        {
          title: "Werkstätten & Industrie",
          description:
            "Stillstand ist der teuerste Zustand in Ihrem Betrieb. Wir holen das fehlende Teil, während das Fahrzeug auf der Bühne bleibt.",
          items: [
            {
              icon: "wrench",
              title: "Ersatzteil-Direktfahrt",
              description:
                "Vom Großhändler oder der Partnerwerkstatt direkt an Ihre Rampe – ohne Wartezeit auf die nächste Sammeltour.",
            },
            {
              icon: "alert",
              title: "Notfall bei Produktionsstillstand",
              description:
                "Wenn die Linie steht, fahren wir sofort los. Höchste Dispositionspriorität ohne zusätzliche Abstimmung.",
            },
            {
              icon: "package",
              title: "Werkzeug und Leihgeräte",
              description:
                "Diagnosegeräte und Spezialwerkzeug zwischen Standorten tauschen, statt doppelt zu beschaffen.",
            },
          ],
        },
        {
          title: "Kanzleien & Steuerberater",
          description:
            "Fristen und Originale vertragen keine Unsicherheit. Jede Übergabe ist bei uns namentlich dokumentiert.",
          items: [
            {
              icon: "gavel",
              title: "Fristgebundene Zustellung",
              description:
                "Schriftsätze und Anträge an Gericht, Behörde oder Mandant – mit Zeitstempel als Nachweis.",
            },
            {
              icon: "file",
              title: "Originale und Urkunden",
              description:
                "Notarielle Urkunden, Originalverträge und Prüfungsakten in ununterbrochener Einzelfahrt.",
            },
            {
              icon: "lock",
              title: "Lückenlose Übergabekette",
              description:
                "Ein Fahrer, eine Fahrt, eine namentliche Unterschrift – keine anonyme Sammelquittung.",
            },
          ],
        },
        {
          title: "Dentallabore & medizinische Einrichtungen",
          description:
            "Einzelanfertigungen lassen sich nicht ersetzen und Proben nicht wiederholen. Wir fahren entsprechend sorgfältig.",
          items: [
            {
              icon: "hospital",
              title: "Praxis-Labor-Verbindung",
              description:
                "Kronen, Brücken, Abformungen und Prothetik im gesicherten Einzeltransport zwischen Praxis und Labor.",
            },
            {
              icon: "clock",
              title: "Verbindliche Zeitfenster",
              description:
                "Feste Abhol- und Lieferzeiten für Proben, damit Analyse- und Fertigungsfenster eingehalten werden.",
            },
            {
              icon: "smartphone",
              title: "Sofortige Signaturmeldung",
              description:
                "Ihre Laborleitung erhält die Übergabebestätigung unmittelbar nach der Zustellung.",
            },
          ],
        },
        {
          title: "Druckereien & Eventagenturen",
          description:
            "Der Termin steht fest, auch wenn der Nachdruck erst morgens fertig wird.",
          items: [
            {
              icon: "printer",
              title: "Nachdruck in letzter Minute",
              description:
                "Frisch gedruckte Banner, Badges und Programme direkt an Messestand oder Veranstaltungsort.",
            },
            {
              icon: "map",
              title: "Lieferung an Baustelle und Stand",
              description:
                "Baupläne, Revisionsunterlagen und Musterstücke dorthin, wo gearbeitet wird – nicht in die Poststelle.",
            },
            {
              icon: "sparkles",
              title: "VIP- und Sonderlieferungen",
              description:
                "Kurzfristige Transporte für hochwertige Materialien und repräsentative Anlässe.",
            },
          ],
        },
      ],
      highlights: [
        "Feste Ansprechpartner statt wechselnder Hotline",
        "Branchenübliche Zeitfenster von Anfang an eingeplant",
        "Nachweise, die einer Prüfung standhalten",
      ],
      cta: {
        title: "Ihre Branche ist nicht dabei?",
        description:
          "Wenn Ihre Sendung zeitkritisch ist und in der Region bleibt, passt sie zu uns. Schreiben Sie uns kurz, was Sie bewegen möchten.",
        primaryCta: { label: "Anfrage senden", page: "contact" },
        secondaryCta: { label: "Leistungen ansehen", page: "services" },
      },
    },

    pricing: {
      meta: {
        title: "Preise: Transparenter Festpreis für Direktfahrten",
        description:
          "Transparente Kurierpreise: Grundpreis plus Kilometersatz, Mindestpreis, 19 % MwSt. klar ausgewiesen, keine versteckten Zuschläge. Rahmenverträge für wiederkehrende Strecken.",
        keywords: [
          "Kurier Preise",
          "Direktfahrt Kosten",
          "Eiltransport Preis",
          "Kurierdienst Festpreis",
          "Kurier Rahmenvertrag",
        ],
      },
      eyebrow: "Preise",
      title: "Sie sehen den Preis, bevor wir losfahren.",
      intro:
        "Zwei Komponenten, ein Mindestpreis, 19 % MwSt. – mehr gibt es bei uns nicht zu rechnen.",
      lead: [
        "Viele Transportangebote werden erst auf der Rechnung konkret. Bei soFlott ist es umgekehrt: Der Betrag, den Sie vor der Buchung sehen, ist der Betrag, den Sie bezahlen.",
        "Grundlage sind eine Grundpauschale je Fahrt und ein fester Kilometersatz für die tatsächliche Strecke. Darunter greift ein Mindestpreis, damit auch sehr kurze Fahrten planbar bleiben.",
      ],
      sections: [
        {
          title: "So setzt sich Ihr Preis zusammen",
          description: "Nachvollziehbar in drei Zeilen – auf dem Angebot wie auf der Rechnung.",
          items: [
            {
              icon: "euro",
              title: "Grundpreis je Fahrt",
              description:
                "Deckt Disposition, Anfahrt und Übergabedokumentation ab. Identisch für jede Direktfahrt im Kerngebiet.",
            },
            {
              icon: "route",
              title: "Kilometersatz",
              description:
                "Fester Betrag je Kilometer der tatsächlich gefahrenen Strecke. Keine Luftlinien-Schätzung zu Ihren Lasten.",
            },
            {
              icon: "check",
              title: "Mindestpreis",
              description:
                "Sehr kurze Strecken werden zum Mindestpreis abgerechnet, statt mit Zuschlägen aufgefüllt zu werden.",
            },
          ],
        },
        {
          title: "Was Sie nicht bezahlen",
          description: "Die üblichen Posten aus dem Kleingedruckten gibt es bei uns nicht.",
          items: [
            {
              icon: "check",
              title: "Keine Treibstoffzuschläge",
              description: "Schwankende Spritpreise sind unser Risiko, nicht Ihre Position auf der Rechnung.",
            },
            {
              icon: "check",
              title: "Keine Innenstadt- oder Zonenzuschläge",
              description: "Eine Strecke im Kerngebiet kostet überall dasselbe pro Kilometer.",
            },
            {
              icon: "check",
              title: "Keine Einrichtungs- oder Kontogebühr",
              description: "Das Geschäftskonto und das Kundenportal sind kostenfrei.",
            },
          ],
        },
        {
          title: "Abrechnung und Zahlung",
          description: "Gebaut für die Anforderungen deutscher Buchhaltung.",
          items: [
            {
              icon: "receipt",
              title: "Rechnung je Auftrag",
              description:
                "Automatisch erstellt, fortlaufend nummeriert, mit ausgewiesener Umsatzsteuer und allen Pflichtangaben.",
            },
            {
              icon: "banknote",
              title: "Überweisung oder PayPal",
              description:
                "Sie wählen die Zahlungsart bei der Buchung. Zahlungsziel standardmäßig 14 Tage.",
            },
            {
              icon: "calendar",
              title: "Konditionen für Stammkunden",
              description:
                "Bei regelmäßigem Volumen vereinbaren wir individuelle Sätze und feste Zeitfenster.",
            },
          ],
        },
      ],
      highlights: [
        "Beispiel: 12 km Direktfahrt = 35,70 € netto, 42,48 € brutto",
        "Alle Preise zzgl. 19 % MwSt.",
        "Zahlungsziel 14 Tage, Rechnung per E-Mail",
      ],
      cta: {
        title: "Preis für Ihre Strecke berechnen",
        description:
          "Im Kundenportal geben Sie Abhol- und Zieladresse ein und sehen sofort Entfernung, Fahrzeit und Festpreis.",
        primaryCta: { label: "Konto anlegen und berechnen", href: "/register" },
        secondaryCta: { label: "Rahmenvertrag besprechen", page: "contact" },
      },
    },

    platform: {
      meta: {
        title: "Technologie: Live-Status, digitale Unterschrift & Rechnung",
        description:
          "Die soFlott-Plattform: Live-Sendungsverfolgung, digitale Empfangsunterschrift mit GPS-Nachweis, automatische B2B-Rechnungen und ein Kundenkonto mit vollständiger Auftragshistorie.",
        keywords: [
          "Sendungsverfolgung Kurier",
          "digitale Unterschrift Zustellung",
          "elektronischer Zustellnachweis",
          "Kurier Software",
          "Proof of Delivery",
        ],
      },
      eyebrow: "Technologie",
      title: "Ein Kurierdienst, der seine eigene Software fährt.",
      intro:
        "Die Plattform arbeitet im Hintergrund – und liefert Ihnen genau die Belege, die Sie sonst hinterhertelefonieren müssten.",
      lead: [
        "soFlottOS ist das System, mit dem wir disponieren, zustellen und abrechnen. Für Sie bedeutet das: Jeder Auftrag erzeugt automatisch einen vollständigen, prüfbaren Vorgang.",
        "Sie brauchen dafür keine Installation. Das Kundenportal läuft im Browser und lässt sich auf dem Smartphone wie eine App speichern.",
      ],
      sections: [
        {
          title: "Was Sie im Kundenkonto sehen",
          description: "Alles zu Ihren Fahrten an einem Ort, jederzeit abrufbar.",
          items: [
            {
              icon: "map",
              title: "Status in Echtzeit",
              description:
                "Angenommen, zugewiesen, unterwegs, zugestellt. Der Fortschritt aktualisiert sich automatisch.",
            },
            {
              icon: "signature",
              title: "Übergabebestätigung",
              description:
                "Name des Empfängers, Unterschrift, Zeitstempel und GPS-Position der Übergabe als Beleg zum Auftrag.",
            },
            {
              icon: "receipt",
              title: "Rechnungen und Belege",
              description:
                "Jede Rechnung ist direkt am Auftrag hinterlegt und lässt sich für die Buchhaltung drucken oder als PDF speichern.",
            },
            {
              icon: "building",
              title: "Vollständige Historie",
              description:
                "Alle Fahrten Ihres Unternehmens mit Strecke, Preis und Nachweis – ideal für Monatsabschluss und Prüfungen.",
            },
          ],
        },
        {
          title: "Wie unsere Fahrer arbeiten",
          description: "Dieselbe Plattform, nur für das Smartphone gebaut.",
          items: [
            {
              icon: "smartphone",
              title: "Auftrag auf dem Gerät",
              description:
                "Der Fahrer sieht Adressen, Fracht und Besonderheiten direkt im Auftrag, ohne Zettelwirtschaft.",
            },
            {
              icon: "signature",
              title: "Unterschrift auf dem Display",
              description:
                "Der Empfänger unterschreibt mit dem Finger. Die Unterschrift wird dem Auftrag fest zugeordnet.",
            },
            {
              icon: "map",
              title: "GPS-Nachweis der Übergabe",
              description:
                "Die Position bei der Zustellung wird mitgespeichert und belegt Ort und Zeitpunkt der Übergabe.",
            },
          ],
        },
      ],
      highlights: [
        "Kein Software-Rollout, keine Lizenzkosten",
        "Als Web-App auf dem Smartphone installierbar",
        "Nachweise bleiben dauerhaft im Kundenkonto",
      ],
      cta: {
        title: "Sehen Sie es sich im Kundenkonto an.",
        description:
          "Konto anlegen, erste Fahrt buchen und Live-Status, Unterschrift und Rechnung im echten Vorgang erleben.",
        primaryCta: { label: "Kostenloses Geschäftskonto", href: "/register" },
        secondaryCta: { label: "Sicherheit und Zuverlässigkeit", page: "security" },
      },
    },

    security: {
      meta: {
        title: "Sicherheit, Zuverlässigkeit & Datenschutz",
        description:
          "Wie soFlott Sendungen und Daten schützt: durchgehende Verantwortung beim Fahrer, beweisfähige Zustellnachweise, geschützte Anmeldung und Datenhaltung in der EU.",
        keywords: [
          "sicherer Kurierdienst",
          "Zustellnachweis rechtssicher",
          "Kurier Datenschutz DSGVO",
          "vertrauliche Dokumente Kurier",
        ],
      },
      eyebrow: "Sicherheit",
      title: "Verlässlich mit Absicht, nicht aus Zufall.",
      intro:
        "Wer Originale, Patientenproben oder Prototypen übergibt, muss sich auf zwei Dinge verlassen können: die Fahrt und den Nachweis.",
      lead: [
        "Sicherheit beginnt bei uns in der Disposition: Eine Sendung, ein Fahrer, keine Zwischenlagerung. Je weniger Hände eine Sendung berührt, desto kleiner ist das Risiko.",
        "Alles, was danach kommt – Dokumentation, Aufbewahrung, Zugriff – ist im System geregelt und nicht von einzelnen Personen abhängig.",
      ],
      sections: [
        {
          title: "Sicherheit auf der Straße",
          description: "Organisatorische Maßnahmen, die Schäden von vornherein vermeiden.",
          items: [
            {
              icon: "shield",
              title: "Durchgehende Verantwortung",
              description:
                "Ein Fahrer übernimmt die Sendung und übergibt sie persönlich. Es gibt keinen anonymen Zwischenschritt.",
            },
            {
              icon: "package",
              title: "Keine Zwischenlagerung",
              description:
                "Ihre Fracht wird nicht umgepackt, nicht sortiert und nicht über Nacht eingelagert.",
            },
            {
              icon: "signature",
              title: "Beweisfähige Übergabe",
              description:
                "Namentliche digitale Unterschrift mit Zeitstempel und GPS-Position statt Sammelquittung.",
            },
          ],
        },
        {
          title: "Sicherheit im System",
          description: "Technische Maßnahmen rund um Ihr Kundenkonto.",
          items: [
            {
              icon: "lock",
              title: "Geschützte Anmeldung",
              description:
                "Zugangsdaten werden ausschließlich als starker Hash gespeichert. Das Anmeldetoken liegt in einem HTTP-only-Cookie und ist für Skripte im Browser nicht lesbar.",
            },
            {
              icon: "building",
              title: "Getrennte Rollen",
              description:
                "Auftraggeber, Fahrer und Verwaltung sehen jeweils nur die Daten, die sie für ihre Aufgabe benötigen.",
            },
            {
              icon: "file",
              title: "Nachvollziehbare Vorgänge",
              description:
                "Jede Statusänderung und jeder Nachweis bleibt dem Auftrag dauerhaft zugeordnet.",
            },
          ],
        },
      ],
      highlights: [
        "Eine Sendung, ein Fahrer, keine Umladung",
        "Zustellnachweis mit Name, Zeit und Position",
        "Datenhaltung in der EU, Auskunft auf Anfrage",
      ],
      cta: {
        title: "Fragen zu Vertraulichkeit oder Auftragsverarbeitung?",
        description:
          "Für Kanzleien, Praxen und Labore klären wir Datenschutz- und Übergabeanforderungen gern vorab schriftlich.",
        primaryCta: { label: "Kontakt aufnehmen", page: "contact" },
        secondaryCta: { label: "Technologie ansehen", page: "platform" },
      },
    },

    contact: {
      meta: {
        title: "Kontakt: Direktfahrt anfragen & 20 % Erstkunden-Rabatt",
        description:
          "Direktfahrt anfragen, Rahmenvertrag besprechen oder Testfahrt mit 20 % Erstkunden-Rabatt sichern. Telefonisch oder per E-Mail – wir disponieren sofort.",
        keywords: [
          "Kurier anfragen",
          "Direktfahrt buchen Augsburg, Mering und München",
          "Kurierdienst Kontakt",
          "Expresskurier Angebot",
        ],
      },
      eyebrow: "Kontakt",
      title: "Sagen Sie uns, was wohin muss.",
      intro:
        "Rufen Sie an, wenn es eilt. Schreiben Sie uns, wenn Sie Konditionen oder feste Touren besprechen möchten.",
      lead: [
        "Für dringende Fahrten ist das Telefon der schnellste Weg: Wir nehmen den Auftrag direkt auf und disponieren, während wir sprechen.",
        "Für alles Planbare – Rahmenverträge, feste Touren, Datenschutzfragen – genügt eine kurze E-Mail. Wir antworten in der Regel am selben Werktag.",
      ],
      sections: [
        {
          title: "So erreichen Sie uns",
          description: "Ein Ansprechpartner, keine Warteschleife.",
          items: [
            {
              icon: "phone",
              title: "Telefonisch für Eilfahrten",
              description:
                "Der schnellste Weg bei Stillstand, Frist oder wartendem Kunden. Wir disponieren während des Gesprächs.",
            },
            {
              icon: "mail",
              title: "Per E-Mail für Angebote",
              description:
                "Strecke, Frachtart und gewünschtes Zeitfenster genügen für ein verbindliches Angebot.",
            },
            {
              icon: "smartphone",
              title: "Rund um die Uhr im Portal",
              description:
                "Mit einem Geschäftskonto buchen Sie jederzeit selbst und sehen den Festpreis sofort.",
            },
          ],
        },
        {
          title: "Ihr Einstieg ohne Risiko",
          description: "Wir möchten die erste Fahrt gewinnen, nicht einen Jahresvertrag.",
          items: [
            {
              icon: "award",
              title: "20 % Erstkunden-Rabatt",
              description:
                "Die erste Direktfahrt neuer Gewerbekunden rechnen wir mit 20 % Nachlass ab.",
            },
            {
              icon: "check",
              title: "Keine Mindestmenge",
              description:
                "Keine Grundgebühr, keine Vertragsbindung, keine Mindestanzahl an Fahrten.",
            },
            {
              icon: "calendar",
              title: "Danach: feste Touren",
              description:
                "Überzeugt? Dann übernehmen wir Ihre wiederkehrenden Strecken zu vereinbarten Konditionen.",
            },
          ],
        },
      ],
      highlights: [
        "Antwort in der Regel am selben Werktag",
        "Angebot mit Festpreis vor der Fahrt",
        "Geschäftskonto in zwei Minuten angelegt",
      ],
      cta: {
        title: "Direktfahrt jetzt anfragen",
        description:
          "Legen Sie ein kostenloses Geschäftskonto an und buchen Sie Ihre erste Fahrt mit 20 % Rabatt – oder rufen Sie uns einfach an.",
        primaryCta: { label: "Geschäftskonto anlegen", href: "/register" },
        secondaryCta: { label: "Leistungen ansehen", page: "services" },
      },
    },
  },

  footer: {
    tagline:
      "soFlott ist der regionale Direktkurier für Gewerbekunden: Eiltransporte ohne Umladung, digitale Übergabebestätigung und transparente Festpreise.",
    columns: [
      {
        title: "Leistungen",
        links: [
          { page: "services", label: "Direktfahrt & Eiltransport" },
          { page: "industries", label: "Branchenlösungen" },
          { page: "pricing", label: "Preise & Konditionen" },
        ],
      },
      {
        title: "Unternehmen",
        links: [
          { page: "platform", label: "Technologie" },
          { page: "security", label: "Sicherheit" },
          { page: "contact", label: "Kontakt" },
        ],
      },
    ],
    contactTitle: "Direkter Draht",
    serviceAreaTitle: "Einsatzgebiet",
    serviceAreaText: "Augsburg, Mering und München; Sonderfahrten auf Anfrage.",
    legalNote: "Alle Preise zzgl. 19 % MwSt. Es gelten unsere Geschäftsbedingungen.",
    copyright: (year, company) => `© ${year} ${company}. soFlott. Schnell für Unternehmen.`,
  },
};
