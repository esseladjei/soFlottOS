# Transactional email

Business services never call Resend directly. The integration is split into:

| Component | Responsibility |
| --- | --- |
| `IEmailCommunications` / `EmailCommunications` | Lifecycle events and customer/driver recipient policy |
| `EmailTemplateModel` / `IEmailTemplateRenderer` | Typed models, shared branded layout, HTML and plain-text templates, printable documents |
| `IEmailQueue` / `EmailQueue` | Validate/deduplicate recipients and stage immutable rendered snapshots in the business EF context |
| `IEmailRepository` / `EmailRepository` | Persisted outbox, atomic claims, expiring leases and completion/failure state |
| `EmailDispatcher` / `EmailWorker` | Background processing, bounded retries and failure logging |
| `IEmailSender` / `ResendEmailSender` | Resend HTTP contract, authentication, attachments, idempotency and provider error classification |

## Configuration

Email is disabled by default. No historical events are replayed when it is enabled.
Configure the **API process**, not the MySQL service in `compose.yml`:

```bash
export Email__Enabled=true
export Email__ApiKey='<Resend API key from your secret store>'
export Email__From='soFlott <notifications@your-verified-domain.example>'
export Email__ReplyTo='support@your-domain.example'
export Email__FrontendBaseUrl='https://your-app.example'
```

Password-recovery emails use this outbox as well. Production email-enabled
deployments must also configure `Authentication__DataProtectionKeyPath` to a
persistent private key ring shared by API/worker replicas, because reset email
payloads are encrypted at rest. See `../Security/README.md` for account recovery
and key-management requirements. Existing lifecycle templates are unchanged.

Use a verified Resend sending domain and a key with permission to send email.
The Resend development sender is restricted to authorized test recipients.
Do not commit keys or put them in frontend `NEXT_PUBLIC_*` settings. .NET user
secrets or deployment secret injection may replace environment variables.
The API does not automatically load a shell `.env` file.

Complete `Invoicing` seller name, street, city, postal code, country, tax ID,
email, bank IBAN/BIC/name and PayPal handle before enabling email. Startup
validates these fields; the checked-in demo values must be replaced with real
business information before production use. Production links must use HTTPS.
Optional `ReplyTo` defaults to no explicit reply-to header; configure a monitored
address so customers can contact your team.

| Setting | Default | Meaning |
| --- | --- | --- |
| `PollingIntervalSeconds` | 15 | Polling frequency (first batch starts immediately) |
| `ProcessingBatchSize` | 20 | Maximum candidates per poll |
| `MaxAttempts` | 5 | Includes attempts interrupted by process shutdown |
| `RetryBaseSeconds` | 30 | Exponential retry delay, capped at one hour |
| `TimeoutSeconds` | 15 | Resend HTTP timeout |

Run the included `AddTransactionalEmailOutbox` migration before deploying the
worker. Startup applies it automatically with
`Database:ApplyMigrationsOnStartup=true`; otherwise run `npm run migrate:api`.
The queue remains persisted across restarts.

## Events and recipients

| Event | Recipients |
| --- | --- |
| Client/driver self-registration | New login account |
| Admin-created CRM client | CRM contact; explicitly not an account creation message |
| Order confirmation | CRM customer contact and linked login email |
| Invoice issuance | Same customer recipients; printable HTML invoice attachment |
| Driver assignment | Customer recipients and newly assigned driver, with separate templates |
| Reassignment | Removed driver, new driver and customer; old idle driver is released |
| Cancellation | Customer recipients and the driver assigned at cancellation time |
| Start transit | Customer recipients; approximate driving duration |
| Proof of delivery | Customer recipients with HTML delivery certificate; completion acknowledgment to driver |
| Invoice Sent/Paid/Overdue transition | Customer recipients; Sent includes invoice attachment |

Customer addresses are deduplicated case-insensitively. Each recipient gets a
separate provider request, not a shared CC list. Drivers never receive customer
prices, invoices or bank details. No email addresses exist on pickup/drop-off
contact fields today; phone numbers are not treated as email recipients.
Shift availability toggles do not send email.

Manual CRM customers without login accounts receive the documents and support
details but not inaccessible authenticated portal links. Removed/cancelled
drivers link to their driver dashboard rather than a job they can no longer
access. Authenticated links require a normal login and contain no JWTs. Invoice emails
link to `/client/orders/{orderId}/invoice`, which resolves that order's invoice
using the authenticated API. This also works when the email is staged before
the invoice receives its database ID.

Templates are available in English and German, with German as the default.
All email headers and printable attachments use the existing soFlott logo and
the localized brand tagline: **Wenn morgen zu spät ist.** in German and
**When tomorrow is too late.** in English. Plain-text emails include the
localized tagline as well. The logo is loaded from
`{Email:FrontendBaseUrl}/logo/soFlott_arrow_nav.png`; configure a publicly
reachable HTTPS frontend URL in production. If a mail client blocks remote
images, the logo's `soFlott` alt text and the text tagline remain available.
The Next.js backend adapter forwards the app locale cookie as `X-App-Locale`
for auth and proxied operations. Registration, login and authenticated requests
remember supported selections in `Users.PreferredLocale`. Linked customer and
driver recipients use their own saved selection, even when an admin or driver
triggers an event in another language. Manual CRM contacts use the triggering
request language. Apply the coordinated migration including `PreferredLocale`
(required, length 2, default `de`) before deploying this behavior.
Call `IEmailTemplateRenderer.Render(model, locale)` with `en` or `de`; unknown
locales fall back to German. Locale selection is per render, so the singleton
renderer does not retain language state. Emails and printable attachments
localize their complete copy, labels, currency/date formatting and attachment
filenames. Amounts remain in EUR. Timestamps use `Europe/Berlin` for both
languages, including the correct winter/summer offset (`+01:00`/`+02:00`),
independently of the server's time zone. Stored timestamps remain UTC.
The one-argument renderer uses the model's locale or the recipient's saved
language; an explicit locale argument overrides it.
Every dynamic HTML value is encoded and user-provided data is never translated.
Attachments are self-contained printable **HTML, not PDF**. Delivery
certificates contain the route, recipient and delivery time; signatures and GPS
remain behind the authenticated portal.
Invoice amounts and VAT come from the stored invoice, not current pricing.
At booking, the delivery/service date is explicitly marked as not yet completed.
Company/payment information is snapshotted when the email is staged.
Booking confirmations also snapshot available pickup/drop-off contact names and
phone numbers, plus a positive estimated journey duration. This is an approximate
travel time, not a promised arrival timestamp; unavailable estimates are omitted.
Customer assignment emails include the assigned driver's name and available
phone/email contact details. Missing contact details are omitted.
Account emails confirm creation, **not email-address ownership**; there is no
verification-token flow. Cancellation does not promise automatic invoice
annulment or refunds.

## Reliability and operations

`Stage` only adds tracked outbox entities. The business repository's next
`SaveChangesAsync` persists the change and its messages atomically. Booking
additionally wraps its multiple saves in `IBusinessTransaction`. Do not call
`Stage` after the final business save without another save.

The worker claims one row at a time using a conditional SQL update and a unique
lease token. Expired leases can be recovered after a crash. Stale workers cannot
overwrite another worker's result. The same immutable email and Resend
`Idempotency-Key` are used for retries. Do not change sending identity or reply-to
configuration while a retrying backlog is active: those headers are provider
configuration, and Resend rejects a changed payload under an existing key.

HTTP 408/429/5xx, network failures, timeouts and malformed success responses are
retryable. `Retry-After` is honored. Other provider rejections are terminal.
Automatic retries stop before Resend's 24-hour idempotency retention expires
(a 23-hour safety window) to avoid duplicating an accepted email after a long
outage. Provider rejection details stored/logged by the transport contain only
the HTTP status, not credentials or customer message bodies.

Monitor the `EmailMessages` table's `Status`, `AttemptCount`, `NextAttemptAt`,
`LastError`, `ProviderMessageId` and the worker logs. `Sent` means **accepted by
Resend**, not confirmed inbox delivery. Bounces, complaints and final delivery
are available in Resend; no webhook receiver is included. After correcting a
terminal failure, operators must review provider delivery history before a
manual resend, especially beyond the idempotency window. There is deliberately
no public unauthenticated send/retry endpoint.

Outbox snapshots contain customer contact/order data. Restrict database access
and establish a retention policy for completed email rows consistent with your
privacy obligations. Invoice records retain their existing accounting policy.

## Extending

Add a typed `EmailTemplateModel`, implement rendering with the shared layout,
expose a semantic event in `IEmailCommunications`, and stage it before the
owning business save. Add template and lifecycle tests. To change providers,
implement `IEmailSender` and change DI; business services and templates are
independent of Resend. Keep transient errors as `EmailDeliveryException` and
propagate caller cancellation.
