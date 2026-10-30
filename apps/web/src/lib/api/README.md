# API helpers

Server-side backend/proxy helpers and browser `apiFetch` error handling.

The backend adapter forwards the selected `soflott_locale` cookie as
`X-App-Locale` on all auth and proxied requests, with German as the default.
The API remembers supported selections for the authenticated account so future
transactional emails/SMS use the recipient's language even when another role
initiates the event. No booking/admin page changes are required.
