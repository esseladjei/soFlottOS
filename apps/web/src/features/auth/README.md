# Auth feature

Login and registration forms. The browser posts to Next.js route handlers, which call the backend server-side and store the JWT in an HTTP-only cookie.

`/forgot-password` and `/reset-password` are public for every role, including
visitors with an existing session. Recovery never signs the user in automatically.
The reset token is read from the URL fragment and sent only in the POST body;
successful reset clears the session cookie/cache and removes the fragment.
New-password forms share the backend's 12-character/72-UTF-8-byte complexity
policy and localized English/German hints, validation, feedback and confirmation.
Login continues to accept legacy passwords. Backend recovery tokens, encrypted
outbox content, session revocation and deployment requirements are documented in
`apps/api/src/soFlottOS.Api/Services/Security/README.md`.

Run focused schema tests with Node 22.18+ or 24+:
`node --test apps/web/src/features/auth/schemas.test.mjs`.
