// ---------------------------------------------------------------------------
// ENGLISH marketing copy.
//
// English serves international prospects (UK, Ireland, UAE and others) and is
// the main language for soFlott Digital. It must contain exactly the same
// pages and fields as `de.ts` - TypeScript enforces this.
//
// Before editing, read the content rules at the top of `types.ts`: no invented
// numbers, clients, certifications or service promises.
// ---------------------------------------------------------------------------

import type { MarketingContent } from "@/content/marketing/types";

export const en: MarketingContent = {
  common: {
    skipToContent: "Skip to content",
    languageLabel: "Choose language",
    breadcrumbLabel: "Breadcrumb",
    phone: "Phone",
    email: "Email",
    address: "Address",
    divisionOf: "A division of soFlott UG (haftungsbeschränkt)",
    legalDraft:
      "Draft – this page is pending review by a legal adviser and will be finalised before launch.",
    toBeCompleted: "to be completed",
  },

  nav: {
    ariaLabel: "Main navigation",
    menuLabel: "Open menu",
    items: ["express", "digital", "about", "contact"],
    login: "Customer login",
    cta: { label: "Get in touch", page: "contact" },
  },

  divisions: {
    express: {
      name: "soFlott Express",
      tagline: "Courier & logistics",
      ariaLabel: "soFlott Express navigation",
      items: [
        "express",
        "express/direct-b2b-delivery",
        "express/logistics-subcontracting",
        "express/contracted-delivery-routes",
        "express/service-areas",
        "express/how-it-works",
        "express/contact",
      ],
      cta: { label: "Request a quote", page: "express/request-a-quote" },
    },
    digital: {
      name: "soFlott Digital",
      tagline: "IT consulting & software engineering",
      ariaLabel: "soFlott Digital navigation",
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
      cta: { label: "Request a proposal", page: "digital/request-a-proposal" },
    },
  },

  pages: {
    // ----------------------------------------------------------------------
    // Corporate
    // ----------------------------------------------------------------------
    home: {
      label: "Home",
      meta: {
        title: "soFlott UG – Courier & Logistics and IT & Software Engineering",
        description:
          "soFlott UG (haftungsbeschränkt) is a German company with two divisions: soFlott Express for B2B courier and logistics services, and soFlott Digital for IT consulting and software engineering.",
      },
      hero: {
        eyebrow: "soFlott UG (haftungsbeschränkt)",
        title: "One company. Two specialist divisions for business customers.",
        intro:
          "soFlott moves goods for businesses and builds software for businesses. Choose the division that fits what you need – both belong to the same company and work to the same standards.",
        primaryCta: { label: "soFlott Express", page: "express" },
        secondaryCta: { label: "soFlott Digital", page: "digital" },
      },
      blocks: [
        {
          kind: "divisions",
          eyebrow: "Our divisions",
          title: "What are you looking for?",
          intro:
            "Each division has its own services, its own contacts and its own way of working with you.",
          items: [
            {
              division: "express",
              name: "soFlott Express",
              summary:
                "Courier and logistics services for businesses – individual B2B deliveries, recurring contracted routes and delivery capacity for logistics companies.",
              points: [
                "Direct B2B courier deliveries",
                "Contracted, recurring routes for your own regular deliveries",
                "Subcontracting for logistics companies and carriers",
                "Digital proof of delivery and B2B invoicing",
              ],
              cta: { label: "Go to soFlott Express", page: "express" },
            },
            {
              division: "digital",
              name: "soFlott Digital",
              summary:
                "IT consulting and software engineering for businesses – from architecture advice to building, integrating and maintaining applications.",
              points: [
                "IT consulting and technical architecture",
                "Custom software and full-stack web applications",
                "API development and system integration",
                "Application modernisation and ongoing support",
              ],
              cta: { label: "Go to soFlott Digital", page: "digital" },
            },
          ],
        },
        {
          kind: "cards",
          eyebrow: "How we work",
          title: "What both divisions have in common",
          items: [
            {
              icon: "building",
              title: "One accountable company",
              description:
                "Every contract and every invoice is issued by soFlott UG (haftungsbeschränkt). You always know who you are doing business with.",
            },
            {
              icon: "file",
              title: "Clear agreements",
              description:
                "Scope, prices and service levels are agreed in writing before work starts – per delivery, per route or per project.",
            },
            {
              icon: "shield",
              title: "Documented work",
              description:
                "Deliveries are recorded with proof of delivery; projects with agreed milestones and approvals.",
            },
          ],
        },
      ],
      cta: {
        title: "Not sure which division you need?",
        description: "Tell us briefly what you are planning and we will put you in touch with the right person.",
        primaryCta: { label: "Contact us", page: "contact" },
        secondaryCta: { label: "About soFlott", page: "about" },
      },
    },

    about: {
      label: "About",
      meta: {
        title: "About soFlott UG – Company and Divisions",
        description:
          "Who is behind soFlott: soFlott UG (haftungsbeschränkt), a company registered in Germany, operating the divisions soFlott Express and soFlott Digital.",
      },
      hero: {
        eyebrow: "About us",
        title: "soFlott UG (haftungsbeschränkt)",
        intro:
          "A German company serving business customers in two fields: courier and logistics, and IT consulting and software engineering.",
      },
      blocks: [
        {
          kind: "text",
          title: "One legal entity, two divisions",
          paragraphs: [
            "soFlott Express and soFlott Digital are commercial divisions – brands – of soFlott UG (haftungsbeschränkt). They are not separate companies. All contracts, invoices and registrations belong to soFlott UG.",
            "We keep the two divisions separate because their customers have different needs: a business that needs a shipment moved, a logistics company looking for a delivery partner and an organisation planning a software project each deserve a clear, focused offer.",
          ],
        },
        {
          kind: "text",
          title: "Why logistics and software?",
          paragraphs: [
            "We run our own courier operation on software we built ourselves: booking, dispatch, driver app, proof of delivery and invoicing. That work is the foundation of soFlott Digital – we know what it takes to design, build and operate business software that people rely on every day.",
          ],
        },
        {
          kind: "links",
          title: "Explore the divisions",
          items: [
            {
              icon: "truck",
              title: "soFlott Express",
              description: "Direct B2B courier deliveries and logistics subcontracting.",
              page: "express",
            },
            {
              icon: "code",
              title: "soFlott Digital",
              description: "IT consulting, software development, integration and modernisation.",
              page: "digital",
            },
          ],
        },
      ],
      cta: {
        title: "Company details",
        description: "Registration details and contact information are listed in our imprint.",
        primaryCta: { label: "Imprint", page: "legal/imprint" },
        secondaryCta: { label: "Contact", page: "contact" },
      },
    },

    contact: {
      label: "Contact",
      meta: {
        title: "Contact soFlott – Express and Digital",
        description:
          "Contact soFlott UG: courier and logistics enquiries for soFlott Express, IT consulting and software enquiries for soFlott Digital.",
      },
      hero: {
        eyebrow: "Contact",
        title: "How can we help?",
        intro:
          "For the fastest answer, use the contact page of the division you need. For anything else, send us a message here.",
      },
      blocks: [
        {
          kind: "links",
          title: "Contact a division directly",
          items: [
            {
              icon: "truck",
              title: "soFlott Express",
              description: "Deliveries, quotes, subcontracting and route enquiries.",
              page: "express/contact",
            },
            {
              icon: "code",
              title: "soFlott Digital",
              description: "Consulting, software projects, proposals and contract engagements.",
              page: "digital/contact",
            },
          ],
        },
        { kind: "contact", title: "Company contact" },
        { kind: "form", form: "contact", title: "Send us a message" },
      ],
    },

    "legal/imprint": {
      label: "Imprint",
      meta: {
        title: "Imprint (Impressum)",
        description: "Legal information about soFlott UG (haftungsbeschränkt) according to § 5 DDG.",
      },
      hero: {
        eyebrow: "Legal",
        title: "Imprint",
        intro: "Information according to § 5 DDG (German Digital Services Act).",
      },
      blocks: [
        { kind: "imprint", title: "Provider" },
        {
          kind: "text",
          title: "Divisions",
          paragraphs: [
            "soFlott Express and soFlott Digital are divisions (trading names) of soFlott UG (haftungsbeschränkt) and not separate legal entities.",
          ],
        },
      ],
    },

    "legal/privacy": {
      label: "Privacy",
      meta: {
        title: "Privacy Notice",
        description:
          "How soFlott UG (haftungsbeschränkt) processes personal data on this website and in the customer portal.",
      },
      hero: {
        eyebrow: "Legal",
        title: "Privacy notice",
        intro: "How we handle personal data when you visit this website, contact us or use the customer portal.",
      },
      blocks: [
        {
          kind: "text",
          paragraphs: [
            "The controller responsible for data processing on this website is soFlott UG (haftungsbeschränkt). Contact details are listed in the imprint.",
          ],
          sections: [
            {
              title: "Visiting the website",
              paragraphs: [
                "When you open a page, your browser transmits technical data such as your IP address, date and time, the requested page and your browser type. This data is needed to deliver the website securely and is processed on the basis of our legitimate interest (Art. 6(1)(f) GDPR). Server log files are kept only as long as necessary for security purposes.",
                "Fonts are served from our own server. No content is loaded from third-party font services when you visit this website.",
              ],
            },
            {
              title: "Cookies",
              paragraphs: [
                "We only use cookies that are needed for the website to work. The cookie “soflott_locale” remembers your language choice for up to one year. When you sign in to the customer portal, the cookie “soflott_session” keeps you signed in. We do not use advertising or tracking cookies.",
              ],
            },
            {
              title: "Enquiry and quote forms",
              paragraphs: [
                "Our enquiry forms do not store any data on this website. When you submit a form, your own email program opens with a prepared message. Only when you send that email do we receive your details. We use them to answer your enquiry and prepare an offer (Art. 6(1)(b) GDPR) and delete them when they are no longer needed, subject to statutory retention periods.",
              ],
            },
            {
              title: "Customer portal",
              paragraphs: [
                "If you create a business account, we process your account, order, delivery and invoice data to perform our contract with you (Art. 6(1)(b) GDPR) and to meet statutory accounting and retention obligations (Art. 6(1)(c) GDPR).",
              ],
            },
            {
              title: "Your rights",
              paragraphs: [
                "You have the right to access, rectification, erasure, restriction of processing and data portability, and the right to object to processing based on legitimate interest. You can also lodge a complaint with a data protection supervisory authority.",
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
      label: "Overview",
      meta: {
        title: "soFlott Express – B2B Courier Services and Logistics Subcontracting",
        description:
          "soFlott Express provides direct B2B courier deliveries, contracted recurring delivery routes for businesses and delivery capacity for logistics companies, carriers and distributors.",
        keywords: [
          "B2B courier services",
          "business express delivery",
          "logistics subcontractor",
          "delivery partner for logistics companies",
        ],
      },
      hero: {
        eyebrow: "soFlott Express",
        title: "Courier and logistics services for business.",
        intro:
          "We move individual shipments for businesses, run fixed recurring routes for businesses with regular deliveries – and provide delivery capacity for logistics companies that need a reliable partner. Each service has its own way of working.",
        primaryCta: { label: "I need a delivery", page: "express/direct-b2b-delivery" },
        secondaryCta: { label: "I am a logistics company", page: "express/logistics-subcontracting" },
      },
      blocks: [
        {
          kind: "compare",
          eyebrow: "Which service fits?",
          title: "One delivery, a regular route, or delivery capacity?",
          intro:
            "The three services answer three different needs. They differ in who orders, whose shipments are carried, how prices are agreed and how work is billed.",
          columns: ["Direct B2B courier delivery", "Contracted delivery routes", "B2B logistics subcontracting"],
          rows: [
            {
              label: "For",
              values: [
                "Businesses that need an individual shipment collected and delivered",
                "Businesses whose own deliveries follow a regular, predictable pattern",
                "Logistics companies, parcel carriers and distributors that need delivery capacity",
              ],
            },
            {
              label: "Whose shipments",
              values: [
                "Your own goods or documents",
                "Your own goods – between your sites, suppliers or regular customers",
                "Your customers’ parcels, delivered on behalf of your logistics network",
              ],
            },
            {
              label: "Ordered as",
              values: [
                "An individual delivery request",
                "A route agreement – stops, days and time windows fixed once",
                "A framework agreement or service contract",
              ],
            },
            {
              label: "Price basis",
              values: [
                "Quote per delivery, based on distance, urgency, waiting time and handling",
                "Fixed fee per route run or per stop, agreed in advance",
                "As agreed: per stop, per parcel, fixed route fee or a combination",
              ],
            },
            {
              label: "Evidence",
              values: [
                "Proof of delivery for every order",
                "Proof of delivery for every stop and a record of every run",
                "Route records, proof of delivery and volume reconciliation",
              ],
            },
            {
              label: "Billing",
              values: [
                "Per order or consolidated monthly invoice",
                "Monthly invoice listing the completed runs",
                "Periodic invoice with supporting statement",
              ],
            },
          ],
          ctas: [
            { label: "Request a delivery quote", page: "express/request-a-quote" },
            { label: "Request a route proposal", page: "express/request-a-quote", query: "type=routes" },
            {
              label: "Request a subcontracting proposal",
              page: "express/request-a-quote",
              query: "type=subcontracting",
            },
          ],
        },
        {
          kind: "links",
          eyebrow: "Services",
          title: "Explore soFlott Express",
          items: [
            {
              icon: "package",
              title: "Direct B2B delivery",
              description: "Individual deliveries between business locations, with tracking and proof of delivery.",
              page: "express/direct-b2b-delivery",
            },
            {
              icon: "handshake",
              title: "Logistics subcontracting",
              description: "Delivery capacity and operations for logistics companies under a framework agreement.",
              page: "express/logistics-subcontracting",
            },
            {
              icon: "route",
              title: "Contracted delivery routes",
              description: "Recurring runs for your own regular deliveries, on agreed days and time windows.",
              page: "express/contracted-delivery-routes",
            },
            {
              icon: "map",
              title: "Service areas",
              description: "Where we currently operate and how we handle routes outside the region.",
              page: "express/service-areas",
            },
            {
              icon: "clipboard",
              title: "How it works",
              description: "From request to proof of delivery and invoice – step by step.",
              page: "express/how-it-works",
            },
          ],
        },
      ],
      cta: {
        title: "Tell us what needs to move.",
        description: "Send a delivery request, plan a recurring route or start a conversation about a subcontracting agreement.",
        primaryCta: { label: "Request a quote", page: "express/request-a-quote" },
        secondaryCta: { label: "Contact soFlott Express", page: "express/contact" },
      },
    },

    "express/direct-b2b-delivery": {
      label: "Direct B2B delivery",
      meta: {
        title: "Direct B2B Courier Delivery for Businesses",
        description:
          "Business courier deliveries from soFlott Express: collection and delivery between business locations, price before booking, tracking, digital proof of delivery and B2B invoices.",
        keywords: ["B2B courier service", "business courier", "business express delivery", "courier for companies"],
      },
      hero: {
        eyebrow: "soFlott Express · Direct delivery",
        title: "Direct B2B courier deliveries.",
        intro:
          "You need a shipment collected at one business location and delivered to another. We quote, collect, deliver and document – and send you a proper B2B invoice.",
        primaryCta: { label: "Request a delivery quote", page: "express/request-a-quote" },
        secondaryCta: { label: "Open a business account", href: "/register" },
        points: [
          "Price before you book",
          "Status tracking in the customer portal",
          "Digital proof of delivery",
          "Per-order or monthly invoice",
        ],
      },
      blocks: [
        {
          kind: "cards",
          title: "What is included",
          items: [
            {
              icon: "package",
              title: "Collection and delivery",
              description:
                "Pickup and delivery addresses, requested time windows and shipment details are agreed with each order.",
            },
            {
              icon: "receipt",
              title: "Transparent pricing",
              description:
                "Prices are based on distance, urgency, waiting time and handling. You receive the price before the job is confirmed, with VAT shown separately.",
            },
            {
              icon: "search",
              title: "Tracking",
              description: "Follow the status of each order in the customer portal instead of calling for updates.",
            },
            {
              icon: "signature",
              title: "Proof of delivery",
              description:
                "Every delivery is recorded with the recipient’s name and the time of hand-over, plus a signature where appropriate.",
            },
            {
              icon: "file",
              title: "B2B invoicing",
              description:
                "Receive an invoice per order or a consolidated invoice for the billing period, together with your order history.",
            },
            {
              icon: "users",
              title: "Business accounts",
              description:
                "Several contacts and saved addresses per company, so your team can order without re-entering data.",
            },
          ],
        },
        {
          kind: "notice",
          title: "Urgent and time-critical deliveries",
          text:
            "Tell us your required pickup and delivery window when you request a quote. We confirm the earliest window we can reliably meet before you book – we do not promise delivery times we have not confirmed.",
        },
        {
          kind: "checklist",
          title: "Typical requests",
          items: [
            "Components or spare parts between production sites, suppliers and workshops",
            "Documents and originals that must be handed over in person",
            "Samples and goods between branches, labs and customers",
            "Single deliveries that do not fit a parcel network",
          ],
        },
        {
          kind: "faq",
          title: "Questions about direct delivery",
          items: [
            {
              question: "How is the price calculated?",
              answer:
                "The price depends on the distance, the urgency, expected waiting time and any special handling. You receive the price before the order is confirmed, and that agreed price is what appears on the invoice.",
            },
            {
              question: "Do I need an account to order?",
              answer:
                "No. You can request a quote without an account. Regular customers usually open a business account to book, track orders and download invoices in the customer portal.",
            },
            {
              question: "What if a delivery cannot be completed?",
              answer:
                "Failed deliveries, delays and other exceptions are recorded and reported to you, so you always know what happened and what was agreed next.",
            },
          ],
        },
      ],
      cta: {
        title: "Need something delivered?",
        description: "Send us the addresses, time window and shipment details and we will reply with a quote.",
        primaryCta: { label: "Request a delivery quote", page: "express/request-a-quote" },
        secondaryCta: { label: "Customer login", href: "/login" },
      },
    },

    "express/logistics-subcontracting": {
      label: "Logistics subcontracting",
      meta: {
        title: "Logistics Subcontracting – Delivery Partner for Logistics Companies",
        description:
          "soFlott Express as a delivery subcontractor for logistics companies, parcel carriers and distributors: contracted capacity, fixed routes, delivery areas, proof of delivery and reconciled periodic invoicing.",
        keywords: [
          "logistics subcontractor",
          "parcel delivery subcontracting",
          "delivery partner for logistics companies",
          "last mile subcontractor",
        ],
      },
      hero: {
        eyebrow: "soFlott Express · Subcontracting",
        title: "A delivery partner for logistics companies.",
        intro:
          "Logistics companies, parcel carriers and distributors contract soFlott to provide delivery capacity or run defined delivery operations within their network – delivering their customers’ parcels. We work under a framework agreement, report every route and invoice exactly what was agreed.",
        primaryCta: {
          label: "Request a subcontracting proposal",
          page: "express/request-a-quote",
          query: "type=subcontracting",
        },
        secondaryCta: { label: "Discuss a framework agreement", page: "express/contact" },
      },
      blocks: [
        {
          kind: "cards",
          title: "Engagement models",
          intro:
            "Each engagement is defined in its own agreement and operated as part of your logistics network. Typical arrangements include:",
          items: [
            {
              icon: "route",
              title: "Fixed routes",
              description: "A route from your network operated by us on agreed weekdays and time windows.",
            },
            {
              icon: "map",
              title: "Delivery areas",
              description: "Responsibility for a defined delivery area or service zone.",
            },
            {
              icon: "package",
              title: "Daily runs with variable volume",
              description: "Daily delivery runs where the parcel volume changes from day to day.",
            },
            {
              icon: "scale",
              title: "Flexible billing",
              description:
                "Per completed stop or parcel, a fixed route fee, or a base fee plus variable volume – as agreed in the contract.",
            },
          ],
        },
        {
          kind: "steps",
          title: "How a subcontracting engagement works",
          steps: [
            {
              title: "Requirements and proposal",
              description: "You describe routes, areas, volumes and service levels. We reply with a written proposal.",
            },
            {
              title: "Framework agreement",
              description:
                "Prices, billing units, service levels and exception rules are fixed in a contract before operations start.",
            },
            {
              title: "Route planning and assignment",
              description: "Routes and vehicles are planned and assigned according to the agreed schedule.",
            },
            {
              title: "Operations and proof of delivery",
              description: "Manifests, stops, deliveries and exceptions are recorded for each route.",
            },
            {
              title: "Reconciliation and invoice",
              description:
                "Delivered volumes are reconciled with your records before we issue the periodic invoice with a supporting statement.",
            },
          ],
        },
        {
          kind: "checklist",
          title: "What you can expect",
          items: [
            "One contracting partner: soFlott UG (haftungsbeschränkt)",
            "Written agreements for prices, billing units and service levels",
            "Route-level reporting of completed, failed and returned deliveries",
            "Volume reconciliation before invoicing – no surprises on the invoice",
          ],
        },
        {
          kind: "notice",
          title: "Not a logistics company?",
          text:
            "If you are a business that ships its own goods on a regular schedule – for example between your branches or to the same customers every week – a contracted delivery route is the better fit.",
        },
      ],
      cta: {
        title: "Looking for additional delivery capacity?",
        description: "Tell us about your routes, areas and volumes. We will prepare a subcontracting proposal.",
        primaryCta: {
          label: "Request a subcontracting proposal",
          page: "express/request-a-quote",
          query: "type=subcontracting",
        },
        secondaryCta: { label: "Discuss a framework agreement", page: "express/contact" },
      },
    },

    "express/contracted-delivery-routes": {
      label: "Contracted routes",
      meta: {
        title: "Contracted Delivery Routes and Recurring Runs",
        description:
          "Fixed, recurring delivery routes for businesses with regular deliveries: soFlott Express runs your route on agreed days and time windows, with proof of delivery for every stop and one monthly invoice.",
        keywords: [
          "contracted delivery routes",
          "recurring delivery route",
          "fixed route courier",
          "scheduled B2B delivery",
        ],
      },
      hero: {
        eyebrow: "soFlott Express · Contracted routes",
        title: "Your regular deliveries, on a fixed route.",
        intro:
          "When your business ships the same kind of deliveries on a regular pattern, a contracted route replaces repeated individual orders. We agree stops, days, time windows and pricing once – and run the route consistently, without you having to book each delivery.",
        primaryCta: {
          label: "Request a route proposal",
          page: "express/request-a-quote",
          query: "type=routes",
        },
        secondaryCta: { label: "How it works", page: "express/how-it-works" },
      },
      blocks: [
        {
          kind: "cards",
          title: "Typical contracted routes",
          intro: "A contracted route suits a business whose own deliveries repeat on known days. For example:",
          items: [
            {
              icon: "building",
              title: "Between your own sites",
              description: "Regular runs between branches, warehouses, offices or production sites.",
            },
            {
              icon: "package",
              title: "To regular customers",
              description: "Scheduled deliveries to the same customers or outlets every week.",
            },
            {
              icon: "route",
              title: "From suppliers or partners",
              description: "Recurring collections from suppliers or partner companies on agreed days.",
            },
            {
              icon: "calendar",
              title: "Fixed schedules",
              description: "Agreed weekdays and time windows, planned in advance and documented every time.",
            },
          ],
        },
        {
          kind: "checklist",
          title: "Agreed in writing",
          items: [
            "Stops, sequence and service days",
            "Time windows and handling instructions",
            "Price basis: fixed fee per route run or per stop",
            "How exceptions, failed deliveries and returns are handled and charged",
          ],
        },
        {
          kind: "notice",
          title: "Which service is right?",
          text:
            "Only an occasional or one-off shipment? Use a direct B2B delivery. Are you a logistics company, carrier or distributor that needs capacity to deliver your customers’ parcels? That is logistics subcontracting.",
        },
      ],
      cta: {
        title: "Plan a contracted route.",
        description: "Describe the stops, days and volumes and we will prepare a proposal.",
        primaryCta: {
          label: "Request a route proposal",
          page: "express/request-a-quote",
          query: "type=routes",
        },
        secondaryCta: { label: "Contact soFlott Express", page: "express/contact" },
      },
    },

    "express/service-areas": {
      label: "Service areas",
      meta: {
        title: "Service Areas – Courier Services in Augsburg, Mering and Munich",
        description:
          "Where soFlott Express operates: B2B courier deliveries and contracted routes in the Augsburg, Mering and Munich area in Bavaria, with routes outside the region on request.",
        keywords: ["courier Augsburg", "courier Mering", "courier Munich", "B2B courier Bavaria"],
      },
      hero: {
        eyebrow: "soFlott Express · Service areas",
        title: "Where we operate.",
        intro:
          "soFlott Express focuses on the Augsburg, Mering and Munich area in Bavaria. Concentrating on one region lets us plan routes realistically and keep the commitments we make.",
        primaryCta: { label: "Check your route", page: "express/request-a-quote" },
      },
      blocks: [
        {
          kind: "cards",
          title: "Our focus region",
          items: [
            {
              icon: "map",
              title: "Augsburg",
              description:
                "Deliveries within Augsburg and to surrounding business locations, and routes between Augsburg and Munich.",
            },
            {
              icon: "map",
              title: "Mering",
              description: "Mering and the surrounding area, including connections towards Augsburg and Munich.",
            },
            {
              icon: "map",
              title: "Munich",
              description: "Deliveries to and from the Munich area as part of direct orders and contracted routes.",
            },
          ],
        },
        {
          kind: "text",
          title: "Outside the region",
          paragraphs: [
            "For direct deliveries outside this area, send us the route – we will tell you honestly whether and when we can do it. For subcontracting, delivery areas are defined individually in each agreement.",
          ],
        },
      ],
      cta: {
        title: "Is your route covered?",
        description: "Send pickup and delivery locations and we will confirm availability with the quote.",
        primaryCta: { label: "Request a quote", page: "express/request-a-quote" },
        secondaryCta: { label: "Contact soFlott Express", page: "express/contact" },
      },
    },

    "express/how-it-works": {
      label: "How it works",
      meta: {
        title: "How soFlott Express Works – From Request to Invoice",
        description:
          "How direct B2B deliveries, contracted delivery routes and subcontracting engagements work at soFlott Express: request, quote, dispatch, proof of delivery, reconciliation and invoicing.",
      },
      hero: {
        eyebrow: "soFlott Express · How it works",
        title: "From request to invoice.",
        intro:
          "Direct deliveries, contracted routes and subcontracting follow different processes. All three end with a documented delivery and an invoice that matches what was agreed.",
      },
      blocks: [
        {
          kind: "steps",
          eyebrow: "Direct B2B delivery",
          title: "An individual delivery",
          steps: [
            {
              title: "Request",
              description:
                "Send pickup and delivery addresses, the requested time window and shipment details – via the form, by phone or in the customer portal.",
            },
            {
              title: "Quote and confirmation",
              description: "You receive the price and the confirmed time window. The job is booked once you accept.",
            },
            {
              title: "Collection and delivery",
              description:
                "A driver is assigned, collects the shipment and delivers it. You can follow the status in the portal.",
            },
            {
              title: "Proof of delivery",
              description:
                "The hand-over is recorded with recipient name and time; exceptions are documented and reported.",
            },
            {
              title: "Invoice",
              description:
                "The completed order is invoiced individually or included in your consolidated invoice for the period.",
            },
          ],
        },
        {
          kind: "steps",
          eyebrow: "Contracted delivery routes",
          title: "A recurring route for your business",
          steps: [
            {
              title: "Route assessment",
              description:
                "You describe the stops, service days, time windows and typical volumes of your regular deliveries.",
            },
            {
              title: "Route agreement",
              description:
                "Schedule, stops, price basis and the handling of exceptions are agreed once in writing.",
            },
            {
              title: "Scheduled operation",
              description: "The route runs on the agreed days without you having to book each delivery.",
            },
            {
              title: "Proof of delivery per stop",
              description: "Every stop is documented; missed stops and exceptions are reported for each run.",
            },
            {
              title: "Monthly invoice",
              description: "Completed runs are invoiced monthly at the agreed route or stop price.",
            },
          ],
        },
        {
          kind: "steps",
          eyebrow: "Logistics subcontracting",
          title: "A subcontracting engagement",
          steps: [
            {
              title: "Proposal",
              description: "We assess your routes, areas, volumes and service levels and send a written proposal.",
            },
            {
              title: "Agreement",
              description:
                "Prices, billing units, service levels and exception rules are fixed in a framework agreement.",
            },
            {
              title: "Operations",
              description: "Routes are planned and assigned; manifests, deliveries and exceptions are recorded.",
            },
            {
              title: "Reconciliation",
              description: "Completed volumes are compared with your records and differences are resolved.",
            },
            {
              title: "Periodic invoice",
              description: "We invoice the agreed billing period with a supporting statement.",
            },
          ],
        },
      ],
      cta: {
        title: "Ready to start?",
        description: "Request a delivery quote, a route proposal or a subcontracting proposal – the form lets you choose.",
        primaryCta: { label: "Request a quote", page: "express/request-a-quote" },
        secondaryCta: { label: "Contact soFlott Express", page: "express/contact" },
      },
    },

    "express/request-a-quote": {
      label: "Request a quote",
      meta: {
        title: "Request a Courier Quote, Route or Subcontracting Proposal",
        description:
          "Request a quote for a direct B2B courier delivery, a proposal for a contracted delivery route or a logistics subcontracting proposal from soFlott Express.",
      },
      hero: {
        eyebrow: "soFlott Express · Request a quote",
        title: "Request a quote or proposal.",
        intro:
          "Choose whether you need an individual delivery, a recurring route for your regular deliveries, or a subcontracting partner for your logistics network. We reply with a quote or a written proposal.",
      },
      blocks: [
        {
          kind: "form",
          form: "express-quote",
          title: "Your request",
          intro: "Fields marked as optional can be left empty. The more we know, the more precise our reply.",
        },
      ],
    },

    "express/contact": {
      label: "Contact",
      meta: {
        title: "Contact soFlott Express – Courier & Logistics",
        description:
          "Contact soFlott Express for B2B courier deliveries, quotes, logistics subcontracting and contracted delivery routes.",
      },
      hero: {
        eyebrow: "soFlott Express · Contact",
        title: "Talk to soFlott Express.",
        intro: "Questions about a delivery, a quote or a framework agreement? Get in touch directly.",
        primaryCta: { label: "Request a quote", page: "express/request-a-quote" },
      },
      blocks: [
        { kind: "contact", title: "soFlott Express contact" },
        { kind: "form", form: "contact", title: "Send a message" },
      ],
    },

    // ----------------------------------------------------------------------
    // soFlott Digital
    // ----------------------------------------------------------------------
    digital: {
      label: "Overview",
      meta: {
        title: "soFlott Digital – IT Consulting and Software Engineering",
        description:
          "soFlott Digital provides IT consulting, custom software development, API integration, application modernisation and contract software engineering for businesses in Germany and internationally.",
        keywords: [
          "IT consulting Germany",
          "software development services",
          "B2B software development",
          "full-stack software engineering",
        ],
      },
      hero: {
        eyebrow: "soFlott Digital",
        title: "IT consulting and software engineering for business.",
        intro:
          "We help businesses plan, build, integrate and maintain software – as a project, as ongoing support or as contract engineering capacity in your team. We work in English and German.",
        primaryCta: { label: "Discuss a project", page: "digital/request-a-proposal" },
        secondaryCta: { label: "Discuss a contract engagement", page: "digital/contract-software-engineering" },
      },
      blocks: [
        {
          kind: "links",
          eyebrow: "Services",
          title: "What we do",
          items: [
            {
              icon: "search",
              title: "IT consulting",
              description: "Technical advice, architecture reviews and planning before you invest.",
              page: "digital/it-consulting",
            },
            {
              icon: "code",
              title: "Software development",
              description: "Custom business applications and full-stack web development.",
              page: "digital/software-development",
            },
            {
              icon: "plug",
              title: "API & system integration",
              description: "APIs and integrations that connect your systems and partners.",
              page: "digital/api-integration",
            },
            {
              icon: "refresh",
              title: "Application modernisation",
              description: "Step-by-step modernisation of legacy applications.",
              page: "digital/application-modernisation",
            },
            {
              icon: "users",
              title: "Contract software engineering",
              description: "Experienced engineering capacity for your own team and projects.",
              page: "digital/contract-software-engineering",
            },
            {
              icon: "lifebuoy",
              title: "Support & maintenance",
              description: "Ongoing maintenance, fixes and improvements for live applications.",
              page: "digital/support-and-maintenance",
            },
          ],
        },
        {
          kind: "compare",
          eyebrow: "Engagement models",
          title: "How we can work together",
          columns: ["Engagement", "Billing basis"],
          rows: [
            { label: "Consulting", values: ["Advice, reviews, workshops", "Hourly or daily rate"] },
            { label: "Time and materials", values: ["Flexible development work", "Approved time × agreed rate"] },
            { label: "Fixed-price project", values: ["Clearly defined scope", "Contracted project price"] },
            {
              label: "Milestone project",
              values: ["Larger projects in phases", "Agreed amounts per accepted milestone"],
            },
            { label: "Retainer / support", values: ["Ongoing maintenance and support", "Recurring monthly fee"] },
          ],
        },
        {
          kind: "text",
          title: "Built on real operations",
          paragraphs: [
            "soFlott runs its own courier business on a platform we designed and built: an ASP.NET Core API, Next.js web applications, a driver app, proof of delivery and invoicing. We bring the same practical, production-minded approach to client work.",
            "We work with clients in Germany and are open to engagements with businesses in the UK, Ireland, the UAE and elsewhere, delivered remotely in English.",
          ],
        },
      ],
      cta: {
        title: "Have a project in mind?",
        description: "Tell us what you want to achieve. We will reply with questions or a proposal.",
        primaryCta: { label: "Request a proposal", page: "digital/request-a-proposal" },
        secondaryCta: { label: "Contact soFlott Digital", page: "digital/contact" },
      },
    },

    "digital/it-consulting": {
      label: "IT consulting",
      meta: {
        title: "IT Consulting and Technical Architecture",
        description:
          "IT consulting from soFlott Digital: technical advice, architecture and code reviews, technology selection and project planning for businesses.",
        keywords: ["IT consulting Germany", "technical architecture consulting", "software architecture review"],
      },
      hero: {
        eyebrow: "soFlott Digital · IT consulting",
        title: "Technical decisions, made with confidence.",
        intro:
          "Before you build, buy or rewrite, get an independent technical view. We review what you have, clarify what you need and recommend a realistic way forward.",
        primaryCta: { label: "Discuss a project", page: "digital/request-a-proposal" },
      },
      blocks: [
        {
          kind: "cards",
          title: "Typical consulting topics",
          items: [
            {
              icon: "layers",
              title: "Architecture",
              description: "Design or review of application and system architecture.",
            },
            {
              icon: "search",
              title: "Code and system reviews",
              description: "Assessment of quality, risks and maintainability of existing software.",
            },
            {
              icon: "clipboard",
              title: "Project planning",
              description: "Scope, priorities, phases and realistic effort estimates.",
            },
            {
              icon: "scale",
              title: "Technology selection",
              description: "Comparison of options – build, buy or integrate – for your situation.",
            },
          ],
        },
        {
          kind: "text",
          title: "How consulting is billed",
          paragraphs: [
            "Consulting is billed at an agreed hourly or daily rate. Larger assessments can be offered at a fixed price with a defined result, such as a written review or architecture proposal.",
          ],
        },
      ],
      cta: {
        title: "Need a second opinion?",
        description: "Describe your situation and the decision in front of you.",
        primaryCta: { label: "Request a proposal", page: "digital/request-a-proposal" },
        secondaryCta: { label: "Software development", page: "digital/software-development" },
      },
    },

    "digital/software-development": {
      label: "Software development",
      meta: {
        title: "Custom Software Development and Full-Stack Web Applications",
        description:
          "Custom B2B software development by soFlott Digital: full-stack web applications with ASP.NET Core / .NET and modern web technologies, delivered as fixed-price, milestone or time-and-materials projects.",
        keywords: [
          "software development services",
          "B2B software development",
          "full-stack software engineering",
          "ASP.NET Core development",
        ],
      },
      hero: {
        eyebrow: "soFlott Digital · Software development",
        title: "Custom software for the way your business works.",
        intro:
          "We design and build business applications – web portals, internal tools and workflow systems – that fit your processes instead of forcing you to adapt to generic software.",
        primaryCta: { label: "Discuss a project", page: "digital/request-a-proposal" },
      },
      blocks: [
        {
          kind: "cards",
          title: "What we build",
          items: [
            {
              icon: "code",
              title: "Web applications",
              description: "Full-stack business applications and customer or partner portals.",
            },
            {
              icon: "layers",
              title: "Back-end services",
              description: "APIs and services with ASP.NET Core / .NET and relational databases.",
            },
            {
              icon: "clipboard",
              title: "Internal tools",
              description: "Administration, operations and reporting tools for your team.",
            },
            {
              icon: "lock",
              title: "Security by design",
              description: "Authentication, roles and permissions, and audit trails where they matter.",
            },
          ],
        },
        {
          kind: "steps",
          title: "How a project runs",
          steps: [
            { title: "Enquiry and proposal", description: "We clarify goals and scope and send a written proposal." },
            {
              title: "Contract and scope",
              description: "Deliverables, acceptance criteria, milestones and prices are agreed.",
            },
            { title: "Iterative delivery", description: "Work in short iterations with regular demos and feedback." },
            {
              title: "Acceptance and handover",
              description:
                "Milestones are accepted against the agreed criteria; code and documentation are handed over.",
            },
          ],
        },
      ],
      cta: {
        title: "Let’s talk about your application.",
        description: "Send a short description of the problem you want to solve.",
        primaryCta: { label: "Request a proposal", page: "digital/request-a-proposal" },
        secondaryCta: { label: "Case studies", page: "digital/case-studies" },
      },
    },

    "digital/api-integration": {
      label: "API integration",
      meta: {
        title: "API Development and System Integration Services",
        description:
          "API integration services from soFlott Digital: design and development of REST APIs and integrations between business systems, partners and third-party services.",
        keywords: ["API integration services", "system integration", "REST API development"],
      },
      hero: {
        eyebrow: "soFlott Digital · API & integration",
        title: "Connect the systems your business relies on.",
        intro:
          "Data that has to be copied by hand between systems costs time and causes errors. We design and build APIs and integrations so your systems, partners and services work together.",
        primaryCta: { label: "Discuss a project", page: "digital/request-a-proposal" },
      },
      blocks: [
        {
          kind: "cards",
          title: "Integration work",
          items: [
            {
              icon: "plug",
              title: "API design and development",
              description: "Well-documented REST APIs for your applications and partners.",
            },
            {
              icon: "refresh",
              title: "System-to-system integration",
              description: "Connecting business software, databases and third-party services.",
            },
            {
              icon: "shield",
              title: "Secure access",
              description: "Authentication, authorisation and validation for every integration.",
            },
            {
              icon: "file",
              title: "Documentation",
              description: "Clear documentation so your team and partners can work with the API.",
            },
          ],
        },
      ],
      cta: {
        title: "Which systems need to talk to each other?",
        description: "Tell us about the systems and the data flows involved.",
        primaryCta: { label: "Request a proposal", page: "digital/request-a-proposal" },
        secondaryCta: { label: "Application modernisation", page: "digital/application-modernisation" },
      },
    },

    "digital/application-modernisation": {
      label: "Modernisation",
      meta: {
        title: "Legacy Application Modernisation",
        description:
          "Legacy application modernisation by soFlott Digital: assessment, step-by-step migration and re-engineering of ageing business software without stopping daily operations.",
        keywords: ["legacy application modernisation", "software modernisation", ".NET migration"],
      },
      hero: {
        eyebrow: "soFlott Digital · Modernisation",
        title: "Modernise legacy applications – step by step.",
        intro:
          "Ageing software is often business-critical and hard to change. We assess it, define a realistic migration path and modernise it in stages while your business keeps running.",
        primaryCta: { label: "Discuss a project", page: "digital/request-a-proposal" },
      },
      blocks: [
        {
          kind: "steps",
          title: "Our approach",
          steps: [
            {
              title: "Assessment",
              description: "Understand the current system, its risks, dependencies and business rules.",
            },
            {
              title: "Target and roadmap",
              description: "Agree the target architecture and a staged migration plan.",
            },
            {
              title: "Incremental migration",
              description: "Replace or re-engineer parts one at a time, with tests protecting existing behaviour.",
            },
            {
              title: "Handover and support",
              description: "Document the result and support it in operation if required.",
            },
          ],
        },
      ],
      cta: {
        title: "Is an old system holding you back?",
        description: "Tell us what it does and what is getting difficult.",
        primaryCta: { label: "Request a proposal", page: "digital/request-a-proposal" },
        secondaryCta: { label: "IT consulting", page: "digital/it-consulting" },
      },
    },

    "digital/contract-software-engineering": {
      label: "Contract engineering",
      meta: {
        title: "Contract Software Engineering – Engineering Capacity for Your Team",
        description:
          "Contract software engineering from soFlott Digital: experienced full-stack engineering capacity for your projects, contracted through soFlott UG on a time-and-materials basis.",
        keywords: [
          "contract software engineer",
          "contract developer",
          "full-stack engineering contractor",
          "software engineering contractor",
        ],
      },
      hero: {
        eyebrow: "soFlott Digital · Contract engineering",
        title: "Engineering capacity for your team.",
        intro:
          "When your team needs additional experienced engineers for a project or a period of time, soFlott Digital provides contract software engineering – contracted business-to-business through soFlott UG.",
        primaryCta: { label: "Discuss a contract engagement", page: "digital/request-a-proposal" },
      },
      blocks: [
        {
          kind: "checklist",
          title: "What a contract engagement looks like",
          items: [
            "B2B contract with soFlott UG (haftungsbeschränkt)",
            "Defined scope, duration and working arrangement",
            "Billing on approved time at an agreed hourly or daily rate",
            "Remote work in English or German; on-site by arrangement",
          ],
        },
        {
          kind: "cards",
          title: "Typical areas",
          items: [
            {
              icon: "code",
              title: "Full-stack development",
              description: "Web front ends and back-end services within your existing codebase.",
            },
            { icon: "layers", title: ".NET back ends", description: "ASP.NET Core APIs, services and data access." },
            {
              icon: "plug",
              title: "Integrations",
              description: "APIs and connections to internal and external systems.",
            },
          ],
        },
      ],
      cta: {
        title: "Need an extra engineer?",
        description: "Tell us about the role, the technology and the expected duration.",
        primaryCta: { label: "Discuss a contract engagement", page: "digital/request-a-proposal" },
        secondaryCta: { label: "Contact soFlott Digital", page: "digital/contact" },
      },
    },

    "digital/support-and-maintenance": {
      label: "Support & maintenance",
      meta: {
        title: "Software Support and Maintenance",
        description:
          "Ongoing software support and maintenance from soFlott Digital: fixes, updates, security patches and continuous improvement for business applications, on a retainer basis.",
        keywords: ["software maintenance", "application support", "software support retainer"],
      },
      hero: {
        eyebrow: "soFlott Digital · Support",
        title: "Keep your applications healthy.",
        intro:
          "Software needs care after go-live: updates, fixes and small improvements. We support applications we built and, after an assessment, applications built by others.",
        primaryCta: { label: "Request a proposal", page: "digital/request-a-proposal" },
      },
      blocks: [
        {
          kind: "cards",
          title: "What support covers",
          items: [
            { icon: "wrench", title: "Fixes", description: "Investigation and correction of defects." },
            {
              icon: "shield",
              title: "Updates and security",
              description: "Framework and dependency updates and security patches.",
            },
            {
              icon: "refresh",
              title: "Improvements",
              description: "Small enhancements within an agreed monthly budget.",
            },
          ],
        },
        {
          kind: "text",
          title: "Retainer agreements",
          paragraphs: [
            "Support is usually agreed as a monthly retainer with defined scope and response arrangements. Work outside the agreed scope is handled as a change request.",
          ],
        },
      ],
      cta: {
        title: "Need ongoing support?",
        description: "Tell us about the application and what support you need.",
        primaryCta: { label: "Request a proposal", page: "digital/request-a-proposal" },
        secondaryCta: { label: "Contact soFlott Digital", page: "digital/contact" },
      },
    },

    "digital/case-studies": {
      label: "Case studies",
      meta: {
        title: "Case Studies and Project Examples",
        description: "Project examples from soFlott Digital, published only with approval.",
      },
      hero: {
        eyebrow: "soFlott Digital · Case studies",
        title: "Project examples.",
        intro:
          "We only publish client projects with the client’s approval. Until then, here is the project we know best: our own platform.",
      },
      blocks: [
        {
          kind: "text",
          title: "soFlottOS – the platform behind soFlott Express",
          paragraphs: [
            "soFlott Express runs on soFlottOS, a platform developed in-house by soFlott. It covers the courier workflow from customer booking to invoice.",
          ],
          sections: [
            {
              title: "Scope",
              paragraphs: [
                "A customer portal for business accounts, orders and invoices; a mobile web app for drivers; proof of delivery; and a separate internal administration application.",
              ],
            },
            {
              title: "Technology",
              paragraphs: [
                "An ASP.NET Core REST API with a MySQL database, and Next.js / React web applications for the public website, the customer and driver portal, and the administration console.",
              ],
            },
          ],
        },
        {
          kind: "notice",
          title: "References",
          text: "Further references can be discussed in a personal conversation, subject to client consent.",
        },
      ],
      cta: {
        title: "Want to build something similar?",
        description: "Let’s talk about your project.",
        primaryCta: { label: "Discuss a project", page: "digital/request-a-proposal" },
      },
    },

    "digital/request-a-proposal": {
      label: "Request a proposal",
      meta: {
        title: "Request a Proposal – Software Project or Contract Engagement",
        description:
          "Request a proposal from soFlott Digital for IT consulting, a software project, API integration, modernisation, support or a contract engineering engagement.",
      },
      hero: {
        eyebrow: "soFlott Digital · Request a proposal",
        title: "Tell us about your project.",
        intro:
          "Describe what you want to achieve. We will reply with questions or a proposal, usually including the suggested engagement model.",
      },
      blocks: [
        {
          kind: "form",
          form: "digital-proposal",
          title: "Your project",
          intro: "Rough information is fine – we will clarify the details together.",
        },
      ],
    },

    "digital/contact": {
      label: "Contact",
      meta: {
        title: "Contact soFlott Digital – IT Consulting & Software",
        description:
          "Contact soFlott Digital about IT consulting, software projects, proposals and contract engineering engagements.",
      },
      hero: {
        eyebrow: "soFlott Digital · Contact",
        title: "Talk to soFlott Digital.",
        intro: "Questions about a project, a proposal or a contract engagement? Get in touch.",
        primaryCta: { label: "Request a proposal", page: "digital/request-a-proposal" },
      },
      blocks: [
        { kind: "contact", title: "soFlott Digital contact" },
        { kind: "form", form: "contact", title: "Send a message" },
      ],
    },
  },

  forms: {
    required: "required",
    optional: "optional",
    submit: "Prepare email",
    submitting: "Preparing…",
    successTitle: "Your email is ready to send",
    successText:
      "Your email program should now show the prepared message. Please send it to complete your request. If nothing opened, write to us directly at {email}.",
    privacyConsent: "I agree that soFlott UG may use my details to answer this enquiry.",
    privacyLink: "Privacy notice",
    errors: {
      required: "Please fill in this field.",
      email: "Please enter a valid email address.",
      consent: "Please confirm so we can answer your enquiry.",
      summary: "Please check the highlighted fields.",
    },
    fields: {
      company: { label: "Company" },
      name: { label: "Your name" },
      email: { label: "Email" },
      phone: { label: "Phone" },
      country: { label: "Country" },
      message: { label: "Message" },
      topic: { label: "Topic" },
      pickup: { label: "Pickup location", hint: "Postcode and town, or full address" },
      delivery: { label: "Delivery location", hint: "Postcode and town, or full address" },
      date: { label: "Requested date and time window" },
      shipment: { label: "Shipment", hint: "What is being sent, number of items, approximate size and weight" },
      area: { label: "Routes or delivery area", hint: "Where the deliveries take place" },
      volume: { label: "Expected volume", hint: "e.g. stops or parcels per day, days per week" },
      startDate: { label: "Planned start" },
      engagement: { label: "Type of engagement" },
      timeline: { label: "Timeline" },
      budget: { label: "Budget or rate expectations" },
      stops: {
        label: "Stops",
        hint: "Pickup and delivery addresses on the route, in the usual order",
      },
      schedule: { label: "Service days and time windows", hint: "e.g. Mon, Wed, Fri, 8–10 am" },
    },
    expressQuote: {
      typeLegend: "What do you need?",
      types: {
        direct: "An individual delivery for my business",
        routes: "A recurring route for my business’s regular deliveries",
        subcontracting: "Delivery capacity for my logistics network (logistics companies)",
      },
      engagementOptions: ["Fixed route", "Delivery area", "Daily runs with variable volume", "Not sure yet"],
      subject: {
        direct: "Delivery quote request",
        routes: "Contracted route proposal request",
        subcontracting: "Subcontracting proposal request",
      },
    },
    digitalProposal: {
      engagementOptions: [
        "IT consulting",
        "Software project",
        "API / system integration",
        "Application modernisation",
        "Contract engineering engagement",
        "Support and maintenance",
        "Not sure yet",
      ],
      subject: "Proposal request",
    },
    contact: {
      topicOptions: {
        express: "soFlott Express – courier & logistics",
        digital: "soFlott Digital – IT & software",
        general: "General enquiry",
      },
      subject: "Enquiry via website",
    },
  },

  imprint: {
    company: "Company",
    address: "Address",
    managingDirectors: "Managing director(s)",
    register: "Commercial register",
    vatId: "VAT identification number",
    contact: "Contact",
    divisions: "Divisions",
  },

  footer: {
    tagline:
      "Courier & logistics and IT & software engineering for business customers – from one accountable company.",
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
        title: "Company",
        links: ["about", "contact", "legal/imprint", "legal/privacy"],
      },
    ],
    contactTitle: "Contact",
    legalNote: "soFlott Express and soFlott Digital are divisions of soFlott UG (haftungsbeschränkt).",
    copyright: (year, company) => `© ${year} ${company}. All rights reserved.`,
  },
};
