# Repository Context & AI Agent Guidance: soFlott UG (soFlott OS)

## 1. Project Overview & Domain Context
- **Company Name:** soFlott UG (haftungsbeschränkt)
- **Primary Product:** soFlott OS (B2B Logistics & IT Solutions Platform)
- **Primary Domain:** Multi-service B2B platform operating under German commercial & tax laws (GoBD, §14 UStG, e-invoicing).
- **Service Pillars:**
    1. **Direct B2B Express Courier (*Direktfahrt / Eiltransport*):** Point-to-point urgent transport for local auto shops, law firms, and medical labs (Subject to standard 19% German VAT / MwSt).
    2. **Fixed Sub-Contract Logistics:** Multi-stop last-mile/regional route execution for major logistics carriers (Invoiced or settled via *Gutschrift* / self-billing under §14 Abs. 2 UStG).
    3. **Cross-Border B2B IT Consulting & SaaS:** Remote software engineering and IT solution delivery for international clients in Ireland, UK, and UAE.

---

## 2. Technology Stack & Architectural Standards

### Backend Architecture
- **Framework:** C# .NET 8/9 ASP.NET Core Web API using Clean Architecture (Repository Pattern, Service Layer, Controllers).
- **ORM & Database:** Entity Framework Core (EF Core) with MySQL 8.0+.
- **Authentication:** JWT Bearer tokens with Role-Based Access Control (`Admin`, `Dispatcher`, `Driver`, `Client`).
- **Integrations:** OpenRouteService / Mapbox API (routing & distance), Twilio (SMS/WhatsApp notifications).

### Frontend Architecture
- **Framework:** Next.js 14+ (App Router, React Server Components, TypeScript, Tailwind CSS).
- **Apps (one shared API + MySQL database):**
    - `apps/web` (public) — marketing site, `/client` portal (booking, route quoting, invoices) and `/driver` mobile PWA with signature pad for Proof of Delivery (PoD).
    - `apps/admin` (internal, deployed separately, Admin role only) — operations dispatch, driver management, booking availability, CRM, revenue and invoice manager.
    - `apps/api` — ASP.NET Core REST API used by both frontends.

---

## 3. SEO & Route Architecture Standards

### Domain Route Separation
- Keep logistics marketing pages separated from IT consulting services:
    - Local Express Courier routes: `/app/express/[city]/page.tsx`
    - Subcontracting routes: `/app/partner/page.tsx`
    - IT Consulting routes: `/app/it-consulting/page.tsx`

### Technical SEO & Metadata Guidelines
- **Dynamic Metadata:** Utilize Next.js `generateMetadata` in Server Components for all public marketing pages. Title tags must follow: `[Service Keyword] in [City/Region] | soFlott`.
- **Structured Data (Schema.org):** Inject `CourierService` JSON-LD schema for local express pages and `ProfessionalService` JSON-LD for IT consulting pages.
- **Multilingual Support:** Always attach `hreflang` metadata attributes (`de-DE` for express courier, `en` for cross-border IT consulting).
- **Legal B2B Pricing Rule:** Ensure all public-facing pricing components explicitly display `"zzgl. 19% MwSt."` (net pricing notice).

---

## 4. Financial & Tax Logic Rules (CRITICAL FOR CODE GENERATION)

When generating code for invoicing, billing, or financial logic, always follow these exact German tax rules:

1. **Domestic B2B Courier Services (Germany):**
    - Apply standard **19.00% VAT (MwSt)**.
    - Formula: `NetTotal = BaseFee + (Km * KmRate)`, `VatAmount = NetTotal * 0.19`, `GrossTotal = NetTotal + VatAmount`.
    - Output mandatory consecutive invoice numbers (`Rechnungsnummer`).

2. **EU Cross-Border IT Consulting (e.g., Ireland):**
    - Apply **Reverse Charge** (§13b UStG / Art. 196 EU VAT Directive).
    - `VatRate = 0.00%`.
    - **Required Legal Note on Invoice:** `"Reverse Charge – Tax liability of the recipient according to § 13b UStG / Art. 196 EU VAT Directive."`
    - Store and validate client `USt-IdNr.` (VAT ID) via EU VIES API.

3. **Non-EU Cross-Border IT Consulting (e.g., UK, UAE):**
    - Out of scope for German VAT (§3a Abs. 2 UStG).
    - `VatRate = 0.00%`.
    - **Required Legal Note on Invoice:** `"Service non-taxable in Germany according to § 3a Abs. 2 UStG."`
    - Record currency conversion using official European Central Bank (ECB) exchange rates if invoiced in non-EUR currencies (e.g., AED, USD, GBP).

4. **Sub-Contract Logistics (*Gutschrift* Handling):**
    - Support both outgoing B2B invoices and incoming self-billing vouchers (*Gutschriften*) issued by major carrier depots.

---

## 5. Coding Conventions & Best Practices

### C# / .NET Guidelines
- Always use **strong static typing**, record types for DTOs, and async/await for I/O operations (`Task<IActionResult>`).
- Enforce Dependency Injection in `Program.cs` using interface abstraction (`IService`, `IRepository`).
- Guard against SQL injection by utilizing EF Core LINQ queries; avoid raw unparameterized SQL.
- Format non-zero calculations defensively (e.g., check for division by zero in routing or distance math).

### TypeScript / Next.js Guidelines
- Use strictly typed interfaces/types for API responses and payload structures; never use implicit `any`.
- Keep components modular: place client-side UI triggers (`useState`, HTML5 signature pads) in explicitly marked `'use client'` components.
- Secure API fetch wrappers by embedding JWT `Authorization: Bearer <token>` headers on all protected routes.
- Ensure all public components use `<Image />` for webp/avif optimizations and semantic HTML `<header>`, `<main>`, `<footer>` tags for Core Web Vitals.

---

## 6. Key Database Schema Entities
- `Users`: `Id`, `Email`, `PasswordHash`, `FullName`, `Role` (`Admin`, `Dispatcher`, `Driver`, `Client`).
- `Clients`: `Id`, `UserId`, `CompanyName`, `CountryCode`, `VatIdNumber`, `TaxExemptionCode`.
- `Orders`: `Id`, `ClientId`, `AssignedDriverId`, `CargoCategory`, `SpecialInstructions`, `DistanceKm`, `PriceNet`, `VatAmount`, `TotalPriceGross`, `Status`.
- `ProofOfDeliveries`: `Id`, `OrderId`, `RecipientName`, `SignatureDataUrl` (Base64 string), `GpsLatitude`, `GpsLongitude`.
- `Invoices`: `Id`, `InvoiceNumber`, `ClientId`, `ServiceType` (`CourierExpress`, `CourierSubcontract`, `ITConsulting`), `NetTotal`, `VatRate`, `VatTotal`, `GrossTotal`, `CurrencyCode`, `TaxExemptionNote`, `Status`.