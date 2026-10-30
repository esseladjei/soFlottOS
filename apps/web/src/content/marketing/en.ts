// ---------------------------------------------------------------------------
// ENGLISH marketing copy.
//
// This is a translation of `de.ts`, not a different website: both files must
// contain exactly the same fields, which TypeScript enforces through the shared
// `MarketingContent` type. If you add a section to the German copy, add it here
// too - otherwise the build fails, which is exactly what we want.
// ---------------------------------------------------------------------------

import type { MarketingContent } from "@/content/marketing/types";

export const en: MarketingContent = {
  common: {
    skipToContent: "Skip to content",
    languageLabel: "Choose language",
    phone: "Phone",
    email: "Email",
    callNow: "Call now",
    moreInfo: "Learn more",
    vatNote: "All prices plus 19% German VAT.",
  },

  nav: {
    ariaLabel: "Main navigation",
    items: [
      { page: "services", label: "Services" },
      { page: "industries", label: "Industries" },
      { page: "pricing", label: "Pricing" },
      { page: "platform", label: "Technology" },
      { page: "security", label: "Security" },
      { page: "contact", label: "Contact" },
    ],
    login: "Client login",
    cta: "Request a direct run",
  },

  home: {
    meta: {
      title: "Courier Service Augsburg & Munich | Same-Day Business Delivery",
      description:
        "soFlott is the regional direct courier for B2B customers in Augsburg, Mering and Munich: urgent point-to-point transport with no sorting hubs, pickup ready in 15 minutes, real-time digital signatures and transparent fixed prices plus 19% VAT.",
      keywords: [
        "courier service Augsburg",
        "courier service Mering",
        "courier service Munich",
        "same day courier Germany",
        "direct delivery business",
        "urgent B2B transport",
        "express courier Augsburg",
        "emergency courier service",
        "medical courier Augsburg",
        "legal document courier",
        "spare parts courier",
        "proof of delivery courier",
      ],
    },
    hero: {
      eyebrow: "soFlott. Business Delivered.",
      headlineLead: "The regional direct courier",
      headlineHighlight: "for business.",
      subheadline:
        "When a spare part is missing, a court deadline is running or a customer is waiting, every minute counts. soFlott drives your shipment point to point with no transfer depot and no sorting hub – with a digital recipient signature, live status and a B2B invoice by email.",
      primaryCta: { label: "Request a direct run", href: "/register" },
      secondaryCta: { label: "See pricing", page: "pricing" },
      bullets: [
        "Pickup ready in 15 minutes",
        "No transfers, no sorting hubs",
        "Digital signature and GPS record",
        "Fixed price plus 19% VAT",
      ],
      note: "New business customers get 20% off their first direct run.",
      panel: {
        eyebrow: "Today at soFlott",
        title: "Your shipment in view",
        stats: [
          { label: "Direct runs today", value: "24", caption: "all inside the window" },
          { label: "On-time rate", value: "98.7%", caption: "last 30 days" },
        ],
        liveLabel: "Next pickup",
        liveValue: "in 18 min",
        routeFrom: "Workshop Mering",
        routeTo: "Augsburg",
        routeSeparator: "to",
      },
    },

    trustBar: [
      { icon: "route", label: "Zero transfers" },
      { icon: "signature", label: "Digital proof of delivery" },
      { icon: "euro", label: "Transparent fixed prices" },
      { icon: "receipt", label: "B2B invoice by email" },
      { icon: "clock", label: "Immediate dispatch" },
    ],

    comparison: {
      eyebrow: "The difference",
      title: "Parcel service or direct run? The difference costs you hours.",
      intro:
        "Classic parcel networks are built for volume, not for urgency. Your shipment passes through collection points, sorting hubs and changing drivers. A direct run involves one driver, one vehicle and two addresses.",
      columnOther: "Classic parcel service",
      columnSoFlott: "soFlott direct run",
      rows: [
        {
          label: "Route",
          other: "Collection point, sorting hub, several transfers",
          soFlott: "Straight from sender to recipient, no intermediate stop",
        },
        {
          label: "Transit time",
          other: "One to three working days, no firm commitment",
          soFlott: "Today – often within 40 to 90 minutes",
        },
        {
          label: "Pickup",
          other: "Fixed tour, once a day",
          soFlott: "On demand, usually ready within 15 minutes",
        },
        {
          label: "Delivery record",
          other: "Collective signature or drop-off without a record",
          soFlott: "Named digital signature with timestamp and GPS position",
        },
        {
          label: "Risk",
          other: "Sorting damage, misrouting, lost shipments",
          soFlott: "Cargo only leaves the vehicle at the recipient",
        },
        {
          label: "Billing",
          other: "Flat tariffs with surcharges in the small print",
          soFlott: "Fixed price up front, compliant invoice by email",
        },
      ],
    },

    usps: {
      eyebrow: "Why soFlott",
      title: "Three reasons businesses switch to us.",
      intro:
        "We are not another parcel service. soFlott is built for the moment something has to arrive immediately – and for the moment you have to prove afterwards that it did.",
      items: [
        {
          icon: "route",
          title: "Zero sorting hubs",
          description:
            "Your cargo goes directly from the sender's vehicle to the recipient address, with no transfer depot and no driver change. What is loaded is exactly what is unloaded.",
          proof: "0% sorting damage, 0% misrouting",
        },
        {
          icon: "smartphone",
          title: "Digital visibility",
          description:
            "You see the status of every shipment in real time in the client portal. On hand-over the recipient signs digitally on the driver's device – including name, time and GPS position.",
          proof: "Signature, timestamp and location in one record",
        },
        {
          icon: "clock",
          title: "Regional speed",
          description:
            "We dispatch immediately instead of on the next working day. Across the commercial corridors around Augsburg, Mering and Munich we commit to a firm pickup time.",
          proof: "Usually ready for pickup in 15 minutes",
        },
      ],
    },

    segments: {
      eyebrow: "Who we drive for",
      title: "Specialised in industries where being late gets expensive fast.",
      intro:
        "An idle vehicle lift, a missed court deadline or a broken dental model all cost far more than a direct run. That is exactly what soFlott is for.",
      painLabel: "The problem",
      cargoLabel: "Typical cargo",
      items: [
        {
          icon: "wrench",
          name: "Workshops & industry",
          pain:
            "Every hour a vehicle sits on the lift waiting for a part costs you billable time and leaves a customer waiting.",
          cargo: "Alternators, gaskets, emergency spare parts, diagnostic tools, specialist tooling",
          hook:
            "Stop losing billable lift time: we bring your spare part across town in under 40 minutes.",
        },
        {
          icon: "gavel",
          name: "Law & tax firms",
          pain:
            "Deadlines allow no leeway, and originals and notarised documents require an unbroken chain of custody.",
          cargo: "Original contracts, court filings, notarised deeds, audit files",
          hook:
            "Email is not legally valid for court originals. Guaranteed deadline delivery with real-time signature proof.",
        },
        {
          icon: "hospital",
          name: "Dental & medical labs",
          pain:
            "Unreliable drivers lose fragile custom work or miss the delivery window for time-critical samples.",
          cargo: "Crowns, impressions, prosthetics, lab samples, urgent medical supplies",
          hook:
            "White-glove medical transport with instant digital signature alerts sent straight to your lab manager.",
        },
        {
          icon: "printer",
          name: "Printers & event agencies",
          pain:
            "A last-minute reprint or missing material on site puts the whole appearance at risk.",
          cargo: "Architectural blueprints, trade show banners, event badges, proofs, samples",
          hook:
            "Emergency print and event deliveries straight to the booth or the job site.",
        },
      ],
      cta: { label: "See all industry solutions", page: "industries" },
    },

    cargo: {
      eyebrow: "What we transport",
      title: "From a gasket set to a court file.",
      intro:
        "If it fits in a vehicle, is time critical and stays in the region, it is a job for soFlott. Standard pricing covers up to 10 kg per run; larger shipments on request.",
      groups: [
        {
          icon: "wrench",
          title: "Automotive & spare parts",
          items: [
            "Workshop direct run from the wholesaler to your lift",
            "Emergency parts for vehicles that are standing still",
            "Diagnostic devices and loan tools between branches",
          ],
        },
        {
          icon: "gavel",
          title: "Legal & tax documents",
          items: [
            "Deadline-bound filings for courts and authorities",
            "Original contracts and notarised deeds",
            "Client and audit files with proof of hand-over",
          ],
        },
        {
          icon: "hospital",
          title: "Medical & dental",
          items: [
            "Crowns, bridges and impressions between practice and lab",
            "Urgent lab samples inside a fixed time window",
            "Medical and practice supplies needed the same day",
          ],
        },
        {
          icon: "printer",
          title: "Print, construction & events",
          items: [
            "Blueprints and as-built documents to the site",
            "Trade show banners, badges and event material",
            "Samples, proofs and colour approvals",
          ],
        },
      ],
      note: "We do not carry dangerous goods, live animals or valuables above €5,000.",
    },

    process: {
      eyebrow: "How a direct run works",
      title: "From request to invoice in five steps.",
      intro:
        "No training and no software rollout required. Send the request, confirm the fixed price – the driver and the system take care of the rest.",
      steps: [
        {
          title: "Request in two minutes",
          description:
            "Enter the pickup and destination address in the client portal, or simply call. You immediately see distance, estimated driving time and price.",
        },
        {
          title: "Confirm the fixed price",
          description:
            "Net amount, 19% VAT and gross total are fixed before you book. No fuel surcharges and no surprises on the invoice.",
        },
        {
          title: "Pickup usually within 15 minutes",
          description:
            "The next available driver is dispatched straight away and drives directly to you. You see the driver name and vehicle in the portal.",
        },
        {
          title: "Direct run, no intermediate stop",
          description:
            "Your shipment stays in the vehicle until it reaches the recipient. Follow the status live instead of calling dispatch.",
        },
        {
          title: "Digital hand-over and invoice",
          description:
            "The recipient signs digitally. You receive the confirmation with name, time and GPS position – and the invoice automatically by email.",
        },
      ],
    },

    platform: {
      eyebrow: "Technology",
      title: "Every run documented. Every invoice automatic.",
      intro:
        "soFlott is a courier company that runs its own software. You notice it less during the drive than afterwards: records, history and bookkeeping are ready before you ask for them.",
      items: [
        {
          icon: "map",
          title: "Live status instead of callbacks",
          description:
            "Accepted, in transit, delivered: every step is visible in the client portal, so your team never has to chase dispatch.",
        },
        {
          icon: "signature",
          title: "Digital proof of delivery",
          description:
            "Signature on the driver's device, recipient name, timestamp and GPS position – an evidence-grade record attached to every job.",
        },
        {
          icon: "receipt",
          title: "Automatic B2B invoice",
          description:
            "Every job automatically creates a consecutively numbered invoice with VAT shown separately, ready for your accounting.",
        },
        {
          icon: "building",
          title: "Client account with full history",
          description:
            "All of your company's runs, delivery records and invoices in one place – ideal for month-end and audits.",
        },
      ],
      cta: { label: "Technology in detail", page: "platform" },
    },

    pricing: {
      eyebrow: "Pricing",
      title: "One fixed price. Up front. No small print.",
      intro:
        "Our price is a base fee plus a rate per kilometre. You see the amount before you book – and the invoice shows exactly the same figure.",
      points: [
        {
          icon: "euro",
          title: "Base fee plus kilometres",
          description:
            "A transparent flat fee per run plus a fixed rate per kilometre for the distance actually driven.",
        },
        {
          icon: "check",
          title: "Minimum charge instead of surcharge tables",
          description:
            "Very short runs are billed at the minimum charge. No fuel, inner-city or waiting surcharges hidden in the small print.",
        },
        {
          icon: "receipt",
          title: "19% VAT clearly stated",
          description:
            "Net, tax and gross appear separately on the quote and on the invoice – deductible and audit-proof.",
        },
        {
          icon: "calendar",
          title: "Retainers for regular customers",
          description:
            "For recurring routes we agree individual rates and fixed time windows.",
        },
      ],
      example: {
        title: "Example: a 12 km direct run",
        rows: [
          { label: "Base fee", value: "€19.50" },
          { label: "12 km × €1.35", value: "€16.20" },
          { label: "Net amount", value: "€35.70" },
          { label: "19% VAT", value: "€6.78" },
        ],
        totalLabel: "Total gross",
        totalValue: "€42.48",
        note: "Example rates for orientation. Your binding fixed price appears in the portal before you book.",
      },
      cta: { label: "Pricing and terms", page: "pricing" },
    },

    offer: {
      eyebrow: "New customer offer",
      title: "Try us on your next urgent run – with 20% off.",
      description:
        "No contract, no minimum volume, no setup fee. Book a single direct run, judge the speed and the delivery record, and then decide whether we should take over your regular routes.",
      cta: { label: "Claim 20% off the first run", href: "/register" },
      note: "Valid for the first direct run of new business customers in the Augsburg, Mering and Munich area.",
    },

    area: {
      eyebrow: "Service area",
      title: "Direct runs around Augsburg, Mering and Munich.",
      intro:
        "We cover the commercial corridors of the region: business parks, industrial zones, law firm districts and city centre locations. Longer trips are arranged as a special run on request.",
      cities: [
        "Augsburg",
        "Mering",
        "Munich",
      ],
      note: "Your location is not listed? Ask us – we review every route in the region.",
    },

    faq: {
      eyebrow: "Frequently asked questions",
      title: "Answers before you ask.",
      intro:
        "The questions workshops, law firms and labs ask us most often before their first run.",
      items: [
        {
          question: "How quickly can a courier be with me?",
          answer:
            "As a rule a driver is ready for pickup within 15 minutes of order confirmation. For routes around Augsburg, Mering and Munich the typical end-to-end time is 40 to 90 minutes, depending on distance and traffic. The estimated time is shown together with the price.",
        },
        {
          question: "What does a direct run cost?",
          answer:
            "The price consists of a base fee plus a fixed rate per kilometre for the distance actually driven, with a minimum charge as the floor. You receive the binding fixed price before booking – net, with 19% VAT shown separately, plus the gross total.",
        },
        {
          question: "How is a direct run different from an express parcel?",
          answer:
            "Despite the name, an express parcel still travels through collection points and sorting hubs and changes driver several times. On a direct run one driver collects your shipment and brings it to the recipient without any intermediate stop, which removes sorting damage, misrouting and waiting time.",
        },
        {
          question: "Do I get proof of delivery?",
          answer:
            "Yes. The recipient signs digitally on the driver's device. The record contains the recipient name, date and time and the GPS position of the hand-over, and is available in your client account at any time.",
        },
        {
          question: "Do you also carry medical samples and dental models?",
          answer:
            "Yes. Dental labs and medical facilities are among our core customers. Fragile custom work and samples travel as a secured single run, and we notify the responsible person immediately after hand-over.",
        },
        {
          question: "How does billing work for business customers?",
          answer:
            "Every job automatically creates a consecutively numbered invoice containing all legally required details with VAT shown separately. You receive it by email and also find it in your client account. Payment by bank transfer or PayPal.",
        },
        {
          question: "Can I arrange fixed routes or time windows?",
          answer:
            "Yes. For recurring routes – for example daily between a practice and a lab, or between branches – we agree fixed time windows and individual rates in a retainer agreement.",
        },
        {
          question: "What do you not transport?",
          answer:
            "We do not carry dangerous goods, live animals or valuables above €5,000. Anything else that fits in a vehicle and stays in the region can be requested.",
        },
      ],
    },

    finalCta: {
      title: "The next urgent run does not have to be stressful.",
      description:
        "Create a business account in two minutes and book your first direct run with 20% off. Or simply call – we dispatch immediately.",
      primaryCta: { label: "Create a business account", href: "/register" },
      secondaryCta: { label: "Get in touch", page: "contact" },
      phoneLabel: "Direct line, no hold music:",
    },
  },

  pages: {
    services: {
      meta: {
        title: "Services: Express Transport, Direct Runs & Special Trips",
        description:
          "Direct runs, emergency express transport, special trips and scheduled routes for business customers around Augsburg, Mering and Munich – no transfers, digital proof of delivery and a transparent fixed price.",
        keywords: [
          "express transport",
          "book a direct run",
          "special trip Augsburg, Mering and Munich",
          "business courier service",
          "express courier",
          "scheduled courier routes",
        ],
      },
      eyebrow: "Services",
      title: "Four ways to drive. Always direct.",
      intro:
        "Whether it is a one-off emergency or a daily recurring route, the same quality standard applies across all four job types.",
      lead: [
        "soFlott specialises in time-critical B2B transport within the region. We operate no collection points and no sorting hubs – every shipment is its own run with one accountable driver.",
        "That makes us more expensive than a parcel service for bulk volume, and considerably faster, safer and better documented for urgent single shipments.",
      ],
      sections: [
        {
          title: "Our job types",
          description:
            "All variants include a direct run without transfers, live status and digital proof of delivery.",
          items: [
            {
              icon: "truck",
              title: "Direct run",
              description:
                "The standard job: pickup on demand, drive without an intermediate stop, hand-over with a digital signature. Ideal for spare parts, documents and samples.",
            },
            {
              icon: "alert",
              title: "Emergency express transport",
              description:
                "Top priority when production has stopped, a deadline is expiring or a customer is waiting. We dispatch the nearest available driver immediately.",
            },
            {
              icon: "map",
              title: "Special trips beyond the region",
              description:
                "Longer distances outside the core area are planned individually, with the fixed price and arrival time confirmed in advance.",
            },
            {
              icon: "calendar",
              title: "Scheduled routes and retainers",
              description:
                "Recurring routes in fixed time windows, for example practice to lab or head office to branch, with individual rates.",
            },
          ],
        },
        {
          title: "Included in every run",
          description: "No add-ons and no option packages – this is the standard.",
          items: [
            {
              icon: "route",
              title: "No transfers",
              description:
                "Your shipment only leaves the vehicle at the recipient, which practically rules out sorting damage and misrouting.",
            },
            {
              icon: "signature",
              title: "Digital proof of delivery",
              description:
                "Recipient signature, name, timestamp and GPS position – available in your client account.",
            },
            {
              icon: "euro",
              title: "Fixed price up front",
              description:
                "Net, 19% VAT and gross are fixed before booking and appear unchanged on the invoice.",
            },
            {
              icon: "receipt",
              title: "Automatic invoice",
              description:
                "Consecutively numbered, with all legally required details, delivered by email and stored in your account.",
            },
          ],
        },
      ],
      highlights: [
        "Pickup usually ready within 15 minutes",
        "One driver from collection to hand-over",
        "Up to 10 kg standard cargo, larger shipments on request",
      ],
      cta: {
        title: "Which run do you need today?",
        description:
          "Create a business account and see the fixed price straight away – or talk to us about scheduled routes.",
        primaryCta: { label: "Request a direct run", href: "/register" },
        secondaryCta: { label: "See pricing", page: "pricing" },
      },
    },

    industries: {
      meta: {
        title: "Industries: Courier for Workshops, Law Firms, Labs & Printers",
        description:
          "Industry solutions from soFlott: workshop direct runs for spare parts, deadline-safe legal courier service, medical and dental transport, and emergency deliveries for print and events.",
        keywords: [
          "spare parts courier workshop",
          "legal courier service",
          "dental lab courier",
          "medical courier service",
          "print and event courier",
          "industry courier Augsburg, Mering and Munich",
        ],
      },
      eyebrow: "Industries",
      title: "Four industries with one thing in common: time pressure.",
      intro:
        "We know our customers' workflows well enough to think ahead instead of only driving.",
      lead: [
        "A courier that serves the same industries every day knows what matters: which ramp the wholesaler uses, how a court deadline runs and why a dental model must never be repacked.",
        "That is why we focus on four segments instead of doing a little of everything.",
      ],
      sections: [
        {
          title: "Workshops & industry",
          description:
            "Standstill is the most expensive state in your business. We collect the missing part while the vehicle stays on the lift.",
          items: [
            {
              icon: "wrench",
              title: "Spare part direct run",
              description:
                "From the wholesaler or partner workshop straight to your ramp – without waiting for the next collective tour.",
            },
            {
              icon: "alert",
              title: "Emergency during production stops",
              description:
                "When the line is down we leave immediately, at top dispatch priority and without extra coordination.",
            },
            {
              icon: "package",
              title: "Tools and loan equipment",
              description:
                "Swap diagnostic devices and specialist tools between sites instead of buying twice.",
            },
          ],
        },
        {
          title: "Law firms & tax advisors",
          description:
            "Deadlines and originals tolerate no uncertainty. Every hand-over is documented by name.",
          items: [
            {
              icon: "gavel",
              title: "Deadline-bound delivery",
              description:
                "Filings and applications to courts, authorities or clients – with a timestamp as evidence.",
            },
            {
              icon: "file",
              title: "Originals and deeds",
              description:
                "Notarised deeds, original contracts and audit files in one uninterrupted run.",
            },
            {
              icon: "lock",
              title: "Unbroken chain of custody",
              description:
                "One driver, one run, one named signature – never an anonymous collective receipt.",
            },
          ],
        },
        {
          title: "Dental labs & medical facilities",
          description:
            "Custom work cannot be replaced and samples cannot be repeated. We drive accordingly.",
          items: [
            {
              icon: "hospital",
              title: "Practice to lab link",
              description:
                "Crowns, bridges, impressions and prosthetics in a secured single transport between practice and lab.",
            },
            {
              icon: "clock",
              title: "Committed time windows",
              description:
                "Fixed collection and delivery times for samples so analysis and production windows are met.",
            },
            {
              icon: "smartphone",
              title: "Instant signature alert",
              description:
                "Your lab manager receives the hand-over confirmation immediately after delivery.",
            },
          ],
        },
        {
          title: "Printers & event agencies",
          description:
            "The date is fixed, even when the reprint is only finished in the morning.",
          items: [
            {
              icon: "printer",
              title: "Last-minute reprints",
              description:
                "Freshly printed banners, badges and programmes delivered straight to the booth or venue.",
            },
            {
              icon: "map",
              title: "Delivery to site and stand",
              description:
                "Blueprints, as-built documents and samples where the work happens – not in the mail room.",
            },
            {
              icon: "sparkles",
              title: "VIP and special deliveries",
              description:
                "Short-notice transport for high-value materials and representative occasions.",
            },
          ],
        },
      ],
      highlights: [
        "A named contact instead of a rotating hotline",
        "Industry time windows planned in from the start",
        "Delivery records that stand up to an audit",
      ],
      cta: {
        title: "Your industry is not listed?",
        description:
          "If your shipment is time critical and stays in the region, it suits us. Tell us briefly what you need to move.",
        primaryCta: { label: "Send a request", page: "contact" },
        secondaryCta: { label: "See services", page: "services" },
      },
    },

    pricing: {
      meta: {
        title: "Pricing: Transparent Fixed Rates for Direct Runs",
        description:
          "Transparent courier pricing: base fee plus rate per kilometre, a minimum charge, 19% VAT clearly stated and no hidden surcharges. Retainer rates for recurring routes.",
        keywords: [
          "courier prices",
          "direct run cost",
          "express transport price",
          "courier fixed price",
          "courier retainer",
        ],
      },
      eyebrow: "Pricing",
      title: "You see the price before we set off.",
      intro:
        "Two components, one minimum charge, 19% VAT – there is nothing else to calculate.",
      lead: [
        "Many transport offers only become concrete on the invoice. At soFlott it is the other way round: the amount you see before booking is the amount you pay.",
        "It is based on a flat base fee per run plus a fixed rate per kilometre for the real distance, with a minimum charge underneath so that even very short runs stay predictable.",
      ],
      sections: [
        {
          title: "How your price is calculated",
          description: "Three transparent lines, on the quote and on the invoice.",
          items: [
            {
              icon: "euro",
              title: "Base fee per run",
              description:
                "Covers dispatch, approach and hand-over documentation. Identical for every direct run inside the core area.",
            },
            {
              icon: "route",
              title: "Rate per kilometre",
              description:
                "A fixed amount per kilometre of the distance actually driven. No straight-line estimate at your expense.",
            },
            {
              icon: "check",
              title: "Minimum charge",
              description:
                "Very short distances are billed at the minimum charge instead of being padded with surcharges.",
            },
          ],
        },
        {
          title: "What you never pay",
          description: "The usual small-print items simply do not exist here.",
          items: [
            {
              icon: "check",
              title: "No fuel surcharges",
              description: "Fluctuating fuel prices are our risk, not a line on your invoice.",
            },
            {
              icon: "check",
              title: "No inner-city or zone surcharges",
              description: "A route inside the core area costs the same per kilometre everywhere.",
            },
            {
              icon: "check",
              title: "No setup or account fee",
              description: "The business account and the client portal are free of charge.",
            },
          ],
        },
        {
          title: "Billing and payment",
          description: "Built for the requirements of German accounting.",
          items: [
            {
              icon: "receipt",
              title: "One invoice per job",
              description:
                "Created automatically, consecutively numbered, with VAT shown separately and all legally required details.",
            },
            {
              icon: "banknote",
              title: "Bank transfer or PayPal",
              description:
                "You choose the payment method when booking. Payment terms are 14 days by default.",
            },
            {
              icon: "calendar",
              title: "Rates for regular customers",
              description:
                "With regular volume we agree individual rates and fixed time windows.",
            },
          ],
        },
      ],
      highlights: [
        "Example: a 12 km direct run = €35.70 net, €42.48 gross",
        "All prices plus 19% German VAT",
        "14-day payment terms, invoice by email",
      ],
      cta: {
        title: "Calculate the price for your route",
        description:
          "In the client portal you enter the pickup and destination address and immediately see distance, driving time and the fixed price.",
        primaryCta: { label: "Create an account and calculate", href: "/register" },
        secondaryCta: { label: "Discuss a retainer", page: "contact" },
      },
    },

    platform: {
      meta: {
        title: "Technology: Live Status, Digital Signature & Invoicing",
        description:
          "The soFlott platform: live shipment tracking, digital recipient signature with GPS record, automatic B2B invoicing and a client account with the complete order history.",
        keywords: [
          "courier tracking",
          "digital delivery signature",
          "electronic proof of delivery",
          "courier software",
          "proof of delivery",
        ],
      },
      eyebrow: "Technology",
      title: "A courier company that drives its own software.",
      intro:
        "The platform works in the background – and hands you exactly the records you would otherwise have to chase by phone.",
      lead: [
        "soFlottOS is the system we use to dispatch, deliver and bill. For you that means every job automatically produces a complete, verifiable record.",
        "Nothing needs to be installed. The client portal runs in the browser and can be saved to a smartphone like an app.",
      ],
      sections: [
        {
          title: "What you see in your client account",
          description: "Everything about your runs in one place, available at any time.",
          items: [
            {
              icon: "map",
              title: "Real-time status",
              description:
                "Accepted, assigned, in transit, delivered. Progress updates automatically.",
            },
            {
              icon: "signature",
              title: "Proof of hand-over",
              description:
                "Recipient name, signature, timestamp and GPS position of the hand-over, attached to the job as evidence.",
            },
            {
              icon: "receipt",
              title: "Invoices and records",
              description:
                "Every invoice sits directly on the job and can be printed or saved as a PDF for accounting.",
            },
            {
              icon: "building",
              title: "Complete history",
              description:
                "All of your company's runs with route, price and delivery record – ideal for month-end and audits.",
            },
          ],
        },
        {
          title: "How our drivers work",
          description: "The same platform, built for the phone.",
          items: [
            {
              icon: "smartphone",
              title: "The job on the device",
              description:
                "The driver sees addresses, cargo and special instructions in the job itself, with no paper shuffling.",
            },
            {
              icon: "signature",
              title: "Signature on the screen",
              description:
                "The recipient signs with a finger, and the signature is permanently attached to the job.",
            },
            {
              icon: "map",
              title: "GPS record of the hand-over",
              description:
                "The position at delivery is stored alongside it and documents where and when the hand-over happened.",
            },
          ],
        },
      ],
      highlights: [
        "No software rollout, no licence costs",
        "Installable as a web app on a smartphone",
        "Delivery records stay in your client account",
      ],
      cta: {
        title: "See it inside your client account.",
        description:
          "Create an account, book a first run and experience live status, signature and invoicing on a real job.",
        primaryCta: { label: "Free business account", href: "/register" },
        secondaryCta: { label: "Security and reliability", page: "security" },
      },
    },

    security: {
      meta: {
        title: "Security, Reliability & Data Protection",
        description:
          "How soFlott protects shipments and data: continuous driver accountability, evidence-grade proof of delivery, protected sign-in and data stored in the EU.",
        keywords: [
          "secure courier service",
          "legally sound proof of delivery",
          "courier GDPR data protection",
          "confidential document courier",
        ],
      },
      eyebrow: "Security",
      title: "Dependable by design, not by accident.",
      intro:
        "Anyone handing over originals, patient samples or prototypes must be able to rely on two things: the run and the record.",
      lead: [
        "For us security starts in dispatch: one shipment, one driver, no intermediate storage. The fewer hands touch a shipment, the smaller the risk.",
        "Everything that follows – documentation, retention, access – is governed by the system rather than by individual people.",
      ],
      sections: [
        {
          title: "Security on the road",
          description: "Organisational measures that prevent damage in the first place.",
          items: [
            {
              icon: "shield",
              title: "Continuous accountability",
              description:
                "One driver takes the shipment and hands it over in person. There is no anonymous intermediate step.",
            },
            {
              icon: "package",
              title: "No intermediate storage",
              description:
                "Your cargo is not repacked, not sorted and never stored overnight.",
            },
            {
              icon: "signature",
              title: "Evidence-grade hand-over",
              description:
                "A named digital signature with timestamp and GPS position instead of a collective receipt.",
            },
          ],
        },
        {
          title: "Security in the system",
          description: "Technical measures around your client account.",
          items: [
            {
              icon: "lock",
              title: "Protected sign-in",
              description:
                "Credentials are only ever stored as a strong hash. The session token lives in an HTTP-only cookie and cannot be read by scripts in the browser.",
            },
            {
              icon: "building",
              title: "Separated roles",
              description:
                "Clients, drivers and administration each see only the data they need for their task.",
            },
            {
              icon: "file",
              title: "Traceable records",
              description:
                "Every status change and every delivery record stays permanently attached to its job.",
            },
          ],
        },
      ],
      highlights: [
        "One shipment, one driver, no transfers",
        "Delivery record with name, time and position",
        "Data stored in the EU, information on request",
      ],
      cta: {
        title: "Questions about confidentiality or data processing?",
        description:
          "For law firms, practices and labs we are happy to confirm data protection and hand-over requirements in writing in advance.",
        primaryCta: { label: "Get in touch", page: "contact" },
        secondaryCta: { label: "See the technology", page: "platform" },
      },
    },

    contact: {
      meta: {
        title: "Contact: Request a Direct Run & Get 20% Off",
        description:
          "Request a direct run, discuss a retainer or claim a trial run with 20% off for new customers. By phone or email – we dispatch immediately.",
        keywords: [
          "request a courier",
          "book a direct run Augsburg, Mering and Munich",
          "courier service contact",
          "express courier quote",
        ],
      },
      eyebrow: "Contact",
      title: "Tell us what needs to go where.",
      intro:
        "Call us when it is urgent. Write to us when you want to discuss rates or scheduled routes.",
      lead: [
        "For urgent runs the phone is the fastest route: we take the job directly and dispatch while we are still talking.",
        "For anything you can plan – retainers, scheduled routes, data protection questions – a short email is enough. We usually reply the same working day.",
      ],
      sections: [
        {
          title: "How to reach us",
          description: "One contact person, no hold music.",
          items: [
            {
              icon: "phone",
              title: "By phone for urgent runs",
              description:
                "The fastest route when production stops, a deadline is running or a customer is waiting. We dispatch during the call.",
            },
            {
              icon: "mail",
              title: "By email for quotes",
              description:
                "Route, cargo type and the preferred time window are enough for a binding quote.",
            },
            {
              icon: "smartphone",
              title: "Around the clock in the portal",
              description:
                "With a business account you book whenever you like and see the fixed price immediately.",
            },
          ],
        },
        {
          title: "A risk-free start",
          description: "We want to win the first run, not a yearly contract.",
          items: [
            {
              icon: "award",
              title: "20% new customer discount",
              description:
                "The first direct run for new business customers is billed with a 20% discount.",
            },
            {
              icon: "check",
              title: "No minimum volume",
              description:
                "No base fee, no contractual lock-in and no minimum number of runs.",
            },
            {
              icon: "calendar",
              title: "Then: scheduled routes",
              description:
                "Convinced? We will take over your recurring routes at agreed rates.",
            },
          ],
        },
      ],
      highlights: [
        "Usually answered the same working day",
        "Quote with a fixed price before the run",
        "Business account created in two minutes",
      ],
      cta: {
        title: "Request a direct run now",
        description:
          "Create a free business account and book your first run with 20% off – or simply give us a call.",
        primaryCta: { label: "Create a business account", href: "/register" },
        secondaryCta: { label: "See services", page: "services" },
      },
    },
  },

  footer: {
    tagline:
      "soFlott is the regional direct courier for business customers: urgent transport without transfers, digital proof of delivery and transparent fixed prices.",
    columns: [
      {
        title: "Services",
        links: [
          { page: "services", label: "Direct runs & express transport" },
          { page: "industries", label: "Industry solutions" },
          { page: "pricing", label: "Pricing & terms" },
        ],
      },
      {
        title: "Company",
        links: [
          { page: "platform", label: "Technology" },
          { page: "security", label: "Security" },
          { page: "contact", label: "Contact" },
        ],
      },
    ],
    contactTitle: "Direct line",
    serviceAreaTitle: "Service area",
    serviceAreaText: "Augsburg, Mering and Munich; special trips on request.",
    legalNote: "All prices plus 19% German VAT. Our terms and conditions apply.",
    copyright: (year, company) => `© ${year} ${company}. soFlott. Business Delivered.`,
  },
};
