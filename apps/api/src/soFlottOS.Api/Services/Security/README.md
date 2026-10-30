# Account security

New passwords must contain at least 12 characters, uppercase `A-Z`, lowercase
`a-z`, a digit `0-9`, and an ASCII punctuation symbol (for example `!` or `@`).
Whitespace is forbidden. The maximum is **72 UTF-8 bytes**, not 72 Unicode
characters: BCrypt would otherwise truncate passwords. Registration DTOs,
services, reset DTOs, the BCrypt hash boundary and development seed configuration
all enforce the same policy, regardless of role. Admin accounts remain
non-public. Existing password hashes are not rewritten; legacy logins remain
supported within BCrypt's byte limit, and the next password reset must satisfy
the new policy.

`Seed:DefaultPassword` is validated at startup and again when active development
seeding is invoked directly. The seed creates Admin, Client and Driver accounts
through the policy-enforcing BCrypt hasher. There is no admin-account creation
API; any application-side provisioning must use `IPasswordHasher.Hash`, which
rejects weak passwords regardless of role. Direct SQL insertion of externally
generated hashes is outside application enforcement: complexity cannot be
verified from an existing password hash.

## Password recovery

| Public endpoint | Request | Success |
| --- | --- | --- |
| `POST /api/auth/forgot-password` | `{ "email": "...", "locale": "en" }` (`de` is the default; only `en`/`de` supported) | Empty `204` for both known and unknown addresses |
| `POST /api/auth/reset-password` | `{ "token": "...", "password": "..." }` | Empty `204`; sign in normally afterward |

Both endpoints use the existing `auth` rate limiter. Forgot-password uses a
500 ms minimum response time for normal requests and never returns account
information or a token. Delivery is asynchronous through the existing email
outbox, to the **login email**, not a CRM contact. Disabled email causes the same
explicit recovery-unavailable error for every address; it does not pretend that
an email was sent.

Tokens contain 32 cryptographically random bytes, encoded as 64 uppercase hex
characters. Only their SHA-256 hash and a 30-minute UTC expiry are stored on the
account. A new request invalidates the previous link. One conditional SQL update
checks the hash and strict expiry, changes the BCrypt password, clears the token,
and increments the password version. Replayed, expired and invalid links all
fail with the same `400`. Weak passwords do not consume valid tokens. EF
concurrency checks prevent stale issuance from restoring consumed tokens.

Reset email content is English or German according to the request locale.
Dynamic HTML is encoded. The link uses `/reset-password#token=...` so the secret
is not present in server URL logs or HTTP referrers. The outbox stores the
rendered reset email **encrypted with ASP.NET Data Protection**, not a plaintext
token. Other transactional email templates and storage remain unchanged.

JWTs carry a password version which is checked against the account on every
authenticated API request. Successful reset revokes all previous JWTs. Pre-change
JWTs are accepted as version zero until a password reset occurs. Reset does not
create a session; the Next.js handler clears the current browser's session cookie
and the form clears its cached session. Other browsers are rejected by the API
on their next request.

## Deployment

Generate one consolidated EF migration after coordinating the pending account
and Order coordinate changes. The account entity/context changes are prepared,
but no standalone password-recovery migration is included. The migration must
add `Users.PasswordResetExpiresAt` (nullable), `PasswordResetTokenHash` (nullable,
64 characters, unique index), and `PasswordVersion` (non-null integer, default
zero). Apply the consolidated migration before using password recovery. Use the
existing `Email` configuration, including a verified sender and an HTTPS
`Email:FrontendBaseUrl` in production.

Message localization additionally requires `Users.PreferredLocale` (required,
maximum two characters, default `de`) in that consolidated migration. Login and
authenticated requests carrying `X-App-Locale: en` or `de` remember the selected
app language. The Next.js backend adapter forwards the app locale cookie for
authentication and proxy requests. Emails/SMS for linked customers and drivers
use the recipient's saved locale, not the admin/driver initiating the action.
Manual CRM contacts use the request locale, defaulting to German. Localized
outbox payloads remain immutable across retries; no migration is generated here.

When email is enabled outside development, startup additionally requires:

```bash
export Authentication__DataProtectionKeyPath='/path/to/persistent/private/key-ring'
```

Keep the key ring outside the database and web root, restrict filesystem access
to the API identity, protect it with your platform's at-rest encryption, and
persist/back it up across deployments. Every API/worker replica must share this
key ring and the `soFlottOS` Data Protection application name. Losing the keys
makes queued reset emails undecryptable; these are explicitly marked failed by
the worker, and users must request a new link. Development can use the framework's
default local key ring.

Focused checks:

```bash
node scripts/dotnetw.mjs test apps/api/tests/soFlottOS.Api.Tests/soFlottOS.Api.Tests.csproj --filter 'FullyQualifiedName~AuthServiceTests|FullyQualifiedName~PasswordPolicyTests|FullyQualifiedName~PasswordResetTests|FullyQualifiedName~EmailOutboxTests'
node --test apps/web/src/features/auth/schemas.test.mjs
```

The frontend schema tests use Node's built-in TypeScript stripping (Node 22.18+
or Node 24+) and do not require an additional test framework.
