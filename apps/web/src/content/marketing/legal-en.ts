// ---------------------------------------------------------------------------
// ENGLISH legal pages: privacy policy, terms and cookie page.
//
// Must mirror `legal-de.ts` section for section. German is the legally leading
// version. When a service, tracker or data flow changes, update both files in
// the same change.
// ---------------------------------------------------------------------------

import type { MarketingContent } from "@/content/marketing/types";

export const legalPagesEn: Pick<MarketingContent["pages"], "legal/privacy" | "legal/terms" | "legal/cookies"> = {
  "legal/privacy": {
    label: "Privacy",
    meta: {
      title: "Privacy Notice",
      description:
        "How soFlott UG (haftungsbeschränkt) processes personal data on the website, in the customer portal and when handling orders, and what rights you have.",
    },
    hero: {
      eyebrow: "Legal",
      title: "Privacy notice",
      intro:
        "Here you can see which personal data we process, for what purpose, on which legal basis, how long we keep it and how to exercise your rights.",
    },
    blocks: [
      {
        kind: "text",
        toc: "Contents",
        numbered: true,
        paragraphs: [
          "We only process the personal data we need for each purpose. For every processing activity we state the data categories, purpose, legal basis, recipients, retention period and any transfers to third countries. Optional technologies for audience measurement and advertising are only used after you consent.",
        ],
        sections: [
          {
            title: "Controller and contact",
            paragraphs: [
              "The controller within the meaning of the GDPR is soFlott UG (haftungsbeschränkt), Mandichostr. 1a, 86504 Merching, Germany. soFlott Express and soFlott Digital are divisions of this company. Further details are in the imprint.",
              "For privacy questions and to exercise your rights, contact us at info@soflott.de. The divisions can also be reached at dispatch@soflott.de (Express) and digital@soflott.de (Digital).",
            ],
            links: [{ label: "Imprint", page: "legal/imprint" }],
          },
          {
            title: "Hosting and server logs",
            paragraphs: [
              "When you open our website, your browser sends technical data to the server. It is needed to deliver the pages and to keep the service secure and stable.",
            ],
            items: [
              "Data categories: IP address, date and time, requested address (URL), amount of data transferred, status code, browser and operating system, referrer URL.",
              "Purpose: providing the website, defending against attacks, troubleshooting.",
              "Legal basis: legitimate interest in a secure and functional website (Art. 6(1)(f) GDPR).",
              "Recipients: the hosting provider of the website (Vercel Inc.) and of the backend (Render Services, Inc.) as processors.",
              "Retention: log files are kept only as long as needed for security and troubleshooting, then deleted or anonymised.",
              "Third-country transfers: possible, see the section “International data transfers”.",
            ],
          },
          {
            title: "Website usage and technical information",
            paragraphs: [
              "Fonts are served from our own server. No content is loaded from external font services for this purpose.",
              "Without your consent we only use technically necessary storage technologies on the website (see the section “Cookies and tracking technologies”). Audience measurement, conversion measurement and advertising only take place once you have consented to the relevant category.",
              "The legal basis for technically necessary access to your device is Section 25(2) no. 2 TDDDG, and for the subsequent processing Art. 6(1)(f) GDPR. For optional technologies it is your consent under Section 25(1) TDDDG and Art. 6(1)(a) GDPR.",
            ],
          },
          {
            title: "Contact forms and enquiries",
            paragraphs: [
              "Our enquiry and contact forms do not store data on this website. When you submit a form, your email program opens with a prepared message. We only receive your details once you send that email. We process data the same way if you write or call us directly.",
            ],
            items: [
              "Data categories: name, company, email address, phone number, content of your enquiry.",
              "Purpose: answering the enquiry, preparing offers, initiating a contract.",
              "Legal basis: pre-contractual measures at your request (Art. 6(1)(b) GDPR), otherwise our legitimate interest in answering enquiries (Art. 6(1)(f) GDPR).",
              "Recipients: email service providers, to the extent we receive and answer your message through them.",
              "Retention: we delete enquiries once they are dealt with and no contract is concluded. If a contract is concluded, the retention periods in the section “Retention and deletion” apply.",
            ],
          },
          {
            title: "Account registration",
            paragraphs: [
              "To use the customer portal you create an account. We process the data needed for sign-in and contract handling.",
            ],
            items: [
              "Data categories: name, company, email address, phone number, password (stored only as a secure hash).",
              "Purpose: providing the customer account, authentication, password reset by email, communication about the account.",
              "Legal basis: performance of a contract (Art. 6(1)(b) GDPR); account security based on our legitimate interest (Art. 6(1)(f) GDPR).",
              "Recipients: backend and database hosting (Render) and email delivery (Resend) as processors.",
              "Retention: until the account is deleted, unless statutory retention obligations apply.",
              "After sign-in, a session cookie keeps you signed in. It is technically necessary.",
            ],
          },
          {
            title: "Orders and bookings",
            paragraphs: [
              "When you place a transport order, we process the data we need to carry out the service.",
            ],
            items: [
              "Data categories: client and contact details, cargo category and weight, pickup and delivery address, contact person and phone number at both addresses, delivery instructions, timestamps and status of the order, price, payment method.",
              "Purpose: accepting, planning, carrying out and invoicing the order, informing you about the order status.",
              "Legal basis: performance of a contract (Art. 6(1)(b) GDPR); retention under commercial and tax law (Art. 6(1)(c) GDPR).",
              "Recipients: the drivers assigned, backend and database hosting (Render), email and SMS delivery, route calculation (see the section “External service providers”).",
              "Retention: see the section “Retention and deletion”.",
            ],
          },
          {
            title: "Pickup and delivery",
            paragraphs: [
              "For delivery, the drivers assigned receive the data they need. On handover we record a digital proof of delivery.",
            ],
            items: [
              "Data categories: pickup and delivery address, contact person and phone number, delivery instructions, name of the person receiving the delivery, signature, location of the driver's device (GPS) at the time of signing, time of delivery.",
              "Purpose: carrying out the delivery, proving proper handover, resolving complaints.",
              "Legal basis: performance of the contract with our client (Art. 6(1)(b) GDPR) and legitimate interest in a proof of delivery (Art. 6(1)(f) GDPR).",
              "Recipients: our client (proof of delivery), drivers, backend and database hosting (Render).",
              "Retention: we keep proofs of delivery for as long as complaints and claims arising from the order can realistically be raised, but no longer than the statutory retention periods.",
              "Information for recipients (Art. 14 GDPR): recipients of a shipment have not registered with us. We receive their data from our client. It is used solely for delivery and for the proof of delivery. The controller is soFlott UG, whose contact details are above. Recipients have the same rights as all data subjects.",
            ],
          },
          {
            title: "Business customers",
            paragraphs: [
              "For business customers we process information about the company and the people acting for it.",
            ],
            items: [
              "Data categories: company name, business address, contact person with business contact details, VAT identification number where necessary, contract, invoice and service data.",
              "Purpose: preparing offers, performing contracts, invoicing, customer care.",
              "Legal basis: performance of a contract (Art. 6(1)(b) GDPR), legal obligations (Art. 6(1)(c) GDPR).",
              "Recipients: backend and database hosting (Render), email delivery (Resend); where applicable tax advisers and authorities.",
              "Retention: see the section “Retention and deletion”.",
            ],
          },
          {
            title: "Payment processing",
            paragraphs: [
              "We generate the invoice ourselves. You can pay by bank transfer or PayPal. We currently do not integrate a payment service provider into our website, and payment data such as card numbers is not collected on our systems.",
            ],
            items: [
              "Data categories: invoice data, invoice number, payment method, payment status and payment reference, and for bank transfers the details visible on the bank statement.",
              "Purpose: invoicing, payment reconciliation, bookkeeping.",
              "Legal basis: performance of a contract (Art. 6(1)(b) GDPR), legal obligations (Art. 6(1)(c) GDPR).",
              "Recipients: your bank and ours; for payments via PayPal, PayPal (Europe) S.à r.l. et Cie, S.C.A. as an independent controller under its own privacy policy; tax adviser.",
              "Retention: invoices and accounting records are subject to statutory retention periods.",
            ],
          },
          {
            title: "Google Analytics",
            paragraphs: [
              "If we use Google Analytics 4, it only runs after you consent to the category “Analytics”. Without that consent the script is not loaded and no data is sent to Google. We use Google Consent Mode v2: before you decide, all consent signals are set to “denied”.",
            ],
            items: [
              "Data categories: pseudonymous user identifier (cookies “_ga” and “_ga_<ID>”), pages viewed, interactions, approximate location, device and browser data. According to Google, IP addresses are not logged or stored in Google Analytics 4.",
              "Purpose: audience measurement and improving our offering.",
              "Legal basis: your consent (Art. 6(1)(a) GDPR, Section 25(1) TDDDG). You can withdraw it at any time.",
              "Recipients: Google Ireland Limited; data may be transferred to Google LLC (USA).",
              "Retention: cookies for up to 2 years unless you withdraw earlier. Event data is kept in Google Analytics for no more than 14 months.",
            ],
          },
          {
            title: "Google Ads and other advertising technologies",
            paragraphs: [
              "When we run advertising, we can measure its success. Google Ads (conversion measurement and remarketing), the Meta Pixel (Facebook and Instagram) and the LinkedIn Insight Tag may be used for this. They are only loaded if they are technically set up and you have consented to the category “Marketing & advertising”.",
            ],
            items: [
              "Data categories: identifiers from cookies, pages viewed, time and type of a conversion (for example an enquiry), device and browser data, IP address.",
              "Purpose: measuring advertising success and addressing visitors who have already shown interest in us.",
              "Legal basis: your consent (Art. 6(1)(a) GDPR, Section 25(1) TDDDG). You can withdraw it at any time.",
              "Recipients: Google Ireland Limited, Meta Platforms Ireland Limited, LinkedIn Ireland Unlimited Company. Data may be transferred to parent companies in the USA.",
              "Retention: depending on the service up to 90 days (Google Ads, Meta) or up to 6 months (LinkedIn).",
              "With Google Consent Mode v2 we only pass the signals “ad_storage”, “ad_user_data” and “ad_personalization” as “granted” after you consent.",
            ],
          },
          {
            title: "External service providers",
            paragraphs: [
              "We use the following service providers, who process data on our behalf or provide content:",
            ],
            items: [
              "Vercel Inc. – hosting of the website. If you have consented to the category “Analytics”, we also use Vercel Web Analytics for aggregated audience measurement. It does not set cookies.",
              "Render Services, Inc. – hosting of the application programming interface (API) and of the PostgreSQL database with account, order and invoice data.",
              "Resend – delivery of transactional emails such as password reset, order and invoice notifications. Email address, subject and message content are processed.",
              "Twilio – optional delivery of SMS or WhatsApp notifications about the order status, if enabled. Phone number and message text are processed.",
              "OpenRouteService (HeiGIT) and Nominatim (OpenStreetMap Foundation) – converting addresses into coordinates and calculating distance and travel time for pricing. The pickup and delivery addresses are transmitted.",
              "OpenStreetMap – map tiles for the route view in the customer portal. When a map loads, your IP address is sent to the OpenStreetMap tile servers.",
              "The legal basis is Art. 6(1)(b) GDPR (performance of a contract) or Art. 6(1)(f) GDPR (efficient and secure operation). We only use analytics services with consent.",
            ],
          },
          {
            title: "Data processing agreements",
            paragraphs: [
              "With service providers that process personal data on our behalf, we conclude data processing agreements under Art. 28 GDPR or rely on their contractually guaranteed standard terms. This applies in particular to website, backend and database hosting and to email and SMS delivery. Before using a new service provider we check whether an agreement is required, and we review the agreements regularly.",
              "Advertising and analytics services may act as independent controllers or as joint controllers with us, depending on the contractual setup. We only use them on the basis of your consent.",
            ],
          },
          {
            title: "International data transfers",
            paragraphs: [
              "Some of our service providers are based in the USA or belong to groups headquartered there. A transfer of personal data to third countries can therefore not be ruled out. A server in the EU does not automatically resolve all requirements, because access from third countries can also be a transfer.",
              "We base transfers on an adequacy decision of the European Commission, such as the EU-US Data Privacy Framework, or on EU standard contractual clauses with supplementary safeguards (Art. 45, 46 GDPR). You can request a copy of the safeguards using the contact details above. Transfers in connection with analytics and advertising only take place after you consent (Art. 49(1)(a) GDPR, where no other safeguards apply).",
            ],
          },
          {
            title: "Retention and deletion",
            paragraphs: [
              "We do not keep personal data longer than needed for the purpose. There is no single period; the periods differ by data category:",
            ],
            items: [
              "Enquiries without a contract: deleted once the enquiry is dealt with.",
              "Customer account: until the account is deleted.",
              "Orders and proofs of delivery: until the periods for complaints and claims have expired, at most until the end of the statutory retention periods.",
              "Invoices and accounting records: six, eight or ten years depending on the document type under commercial and tax law (in particular Section 147 AO and Section 257 HGB). This retention also applies if you ask us to delete your account.",
              "Records of your cookie choice: 3 years, then deleted automatically.",
              "Privacy requests: kept for 3 years after completion as evidence, then deleted automatically.",
              "Security logs: only as long as needed for security.",
            ],
          },
          {
            title: "Data security",
            paragraphs: [
              "We take technical and organisational measures appropriate to the risk. They include:",
            ],
            items: [
              "Encrypted transmission (HTTPS) across the website and for all interfaces.",
              "Passwords are only stored as a secure hash.",
              "Role-based access rights and authentication for all protected areas.",
              "Request rate limiting and input validation.",
              "Access restrictions to the production database and protected credentials.",
              "We do not log passwords, access tokens or payment card data.",
              "In the event of a personal data breach we assess the notification duties without delay (Art. 33, 34 GDPR), including the 72-hour deadline.",
            ],
          },
          {
            title: "Your rights",
            paragraphs: [
              "You have the following rights regarding your personal data. To exercise them, use the request form at the end of this page or write to us at info@soflott.de. We answer requests within one month. To protect you, we may ask you to confirm your identity. The form processes your email address and, optionally, your name and message solely to handle the request (Art. 6(1)(c) GDPR).",
            ],
            items: [
              "Access (Art. 15 GDPR) and a copy of your data.",
              "Rectification of inaccurate data (Art. 16 GDPR).",
              "Erasure (Art. 17 GDPR), unless retention obligations apply.",
              "Restriction of processing (Art. 18 GDPR).",
              "Data portability (Art. 20 GDPR).",
              "Objection to processing based on legitimate interests (Art. 21 GDPR).",
              "Withdrawal of consent with effect for the future (Art. 7(3) GDPR).",
            ],
            links: [{ label: "Go to the request form", href: "#privacy-request" }],
          },
          {
            title: "Right to lodge a complaint with a supervisory authority",
            paragraphs: [
              "You have the right to lodge a complaint with a data protection supervisory authority (Art. 77 GDPR). The authority responsible for us is the Bavarian State Office for Data Protection Supervision (BayLDA), Promenade 18, 91522 Ansbach, Germany, www.lda.bayern.de. You can also contact the supervisory authority where you live.",
            ],
          },
          {
            title: "Cookies and tracking technologies",
            paragraphs: [
              "On your first visit we ask which categories you want to allow. Until then only technically necessary storage technologies are used.",
            ],
            items: [
              "Necessary (always active): “soflott_consent” stores your choice for 6 months; “soflott_session” keeps you signed in to the customer portal.",
              "Preferences (only with consent): “soflott_locale” remembers your language for one year. Without consent, the language only applies for the current session.",
              "Analytics (only with consent): Vercel Web Analytics (cookie-free) and, if set up, Google Analytics 4.",
              "Marketing & advertising (only with consent): Google Ads, Meta Pixel and LinkedIn Insight Tag, if set up.",
              "The exact list with provider, purpose and lifetime is on the Cookie settings page. It only shows technologies that can actually occur on this website.",
            ],
            links: [{ label: "Cookie settings", page: "legal/cookies" }],
          },
          {
            title: "Consent management and withdrawal",
            paragraphs: [
              "You can change your choice at any time. Open “Cookie settings” in the footer of any page. Rejecting is as easy as accepting, and consent is voluntary. Using the website does not depend on it.",
              "If you withdraw consent, we delete the related cookies where we are able to and reload the page so that no scripts keep running. Cookies set by a third party on its own domain can only be deleted by that provider or your browser. The lawfulness of processing carried out before the withdrawal is not affected.",
              "To prove your decision we store a record: random consent ID, version of the consent text, type of decision, choice per category and time. We do not store your IP address or browser type. The legal basis is our obligation to be able to prove consent (Art. 6(1)(c) in conjunction with Art. 7(1) GDPR) and our legitimate interest in preserving evidence (Art. 6(1)(f) GDPR). Retention: 3 years. If we change the consent texts materially, we ask you again.",
            ],
            links: [{ label: "Open cookie settings", page: "legal/cookies" }],
          },
        ],
      },
      { kind: "privacyRequest" },
      {
        kind: "notice",
        title: "Status and changes",
        text: "We update this notice when our processing changes, for example when new services or technologies are introduced. The version published here applies. We will have the completeness of this information legally reviewed before launch. The German version is legally leading.",
      },
    ],
  },

  "legal/terms": {
    label: "Terms",
    meta: {
      title: "Terms and Conditions",
      description:
        "General terms and conditions of soFlott UG (haftungsbeschränkt) for courier and transport services and digital services provided to businesses.",
    },
    hero: {
      eyebrow: "Legal",
      title: "Terms and conditions",
      intro:
        "The basis of our work with business customers. Individual agreements in an offer or contract take precedence over these terms.",
    },
    blocks: [
      {
        kind: "notice",
        title: "Draft",
        text: "These terms are a draft and will be legally reviewed before publication. The specific offer and the contract concluded always take precedence. The German version is legally leading.",
      },
      {
        kind: "text",
        toc: "Contents",
        numbered: true,
        paragraphs: [
          "These general terms and conditions apply to the services of soFlott UG (haftungsbeschränkt), Mandichostr. 1a, 86504 Merching, Germany (“soFlott”), including the divisions soFlott Express and soFlott Digital.",
        ],
        sections: [
          {
            title: "Scope",
            paragraphs: [
              "Our services are aimed at businesses within the meaning of Section 14 of the German Civil Code (BGB). Conflicting or deviating terms of the customer only apply if we have expressly agreed to them.",
              "If we conclude a contract with a consumer in an individual case, we will inform them separately about their rights, including any right of withdrawal.",
            ],
          },
          {
            title: "Conclusion of contract",
            paragraphs: [
              "The descriptions on our website are not binding. A contract is concluded when we confirm an offer in writing or text form, or start the service with the customer's consent. Orders placed through the customer portal only become binding once we confirm them.",
            ],
          },
          {
            title: "Services",
            paragraphs: [
              "The type, scope and timeframe of the service result from the offer or order confirmation. Deadlines and time windows only apply if we have expressly confirmed them as binding. We may use subcontractors.",
            ],
          },
          {
            title: "Customer's duties to cooperate",
            paragraphs: [
              "The customer provides complete and correct information, in particular on pickup and delivery address, contact persons, weight and type of shipment and any special requirements. The customer ensures proper packaging suitable for transport and that the shipment is permitted for carriage. Dangerous goods and other specially regulated goods are only permitted by prior agreement.",
            ],
          },
          {
            title: "Prices and payment",
            paragraphs: [
              "The prices stated in the offer or order confirmation apply, plus statutory VAT. We issue an invoice. Unless agreed otherwise, it is payable within 14 days of the invoice date without deduction, by bank transfer or PayPal.",
            ],
          },
          {
            title: "Liability",
            paragraphs: [
              "We are liable without limit for intent and gross negligence and for injury to life, body or health. For slightly negligent breach of essential contractual obligations, our liability is limited to the foreseeable damage typical for this type of contract. Otherwise liability is excluded to the extent permitted by law.",
              "For transport services, the statutory provisions apply in addition, in particular Sections 407 et seq. of the German Commercial Code (HGB), unless the individual contract provides otherwise. Mandatory statutory liability rules remain unaffected.",
            ],
          },
          {
            title: "Data protection",
            paragraphs: ["How we process personal data is described in our privacy notice."],
            links: [{ label: "Privacy notice", page: "legal/privacy" }],
          },
          {
            title: "Final provisions",
            paragraphs: [
              "German law applies, excluding the UN Convention on Contracts for the International Sale of Goods. If the customer is a merchant, a legal entity under public law or a special fund under public law, the place of jurisdiction is the registered office of soFlott, to the extent permitted by law. If a provision is invalid, the validity of the remaining provisions is not affected.",
            ],
          },
        ],
      },
    ],
  },

  "legal/cookies": {
    label: "Cookie settings",
    meta: {
      title: "Cookie Settings",
      description:
        "Manage which cookies and tracking technologies the soFlott website may use, and change or withdraw your consent at any time.",
    },
    hero: {
      eyebrow: "Privacy",
      title: "Cookie settings",
      intro:
        "Decide for yourself which optional technologies we may use. You can change your choice here at any time.",
    },
    blocks: [
      { kind: "cookieSettings" },
      {
        kind: "text",
        title: "More information",
        paragraphs: [
          "We always set technically necessary cookies because the website cannot work securely without them. All other categories are off until you turn them on. Your choice is stored for six months, after which we ask again.",
        ],
        sections: [
          {
            title: "How we handle this",
            paragraphs: [
              "All information on purpose, legal basis, recipients and retention is in the privacy notice. You can also ask for information about the data stored about your decision.",
            ],
            links: [{ label: "Privacy notice", page: "legal/privacy" }],
          },
        ],
      },
    ],
  },
};
