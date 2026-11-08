// Distinct from the customer portal's `soflott_session`: on localhost both apps
// share one cookie jar (cookies ignore ports), and in production the consoles
// must never accept each other's sessions.
export const SESSION_COOKIE_NAME = "soflott_admin_session";

/** The only role allowed to use the administration console. */
export const ADMIN_ROLE = "Admin";
