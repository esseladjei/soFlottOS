# Auth feature

Admin login and password-recovery forms. Only accounts with the `Admin` role can sign in; other roles get 403. The browser posts to Next.js route handlers, which call the backend server-side and store the JWT in an HTTP-only cookie.

`/forgot-password` and `/reset-password` are public. Note: the reset e-mail link
points at `Email:FrontendBaseUrl` (the customer portal, `apps/web`); the new
password works here afterwards. Recovery never signs the user in automatically.
The reset token is read from the URL fragment and sent only in the POST body;
successful reset clears the session cookie/cache and removes the fragment.
New-password forms share the backend's 12-character/72-UTF-8-byte complexity
policy and localized English/German hints, validation, feedback and confirmation.
Login continues to accept legacy passwords. Backend recovery tokens, encrypted
outbox content, session revocation and deployment requirements are documented in
`apps/api/src/soFlottOS.Api/Services/Security/README.md`.

Run focused schema tests with Node 22.18+ or 24+:
`node --test apps/admin/src/features/auth/schemas.test.mjs`.
