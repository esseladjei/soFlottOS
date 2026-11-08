# Auth handlers

Route handlers that log in or log out and manage the `soflott_admin_session`
HTTP-only cookie. Login refuses non-Admin accounts with `403` and writes no
cookie. There is no self-registration in the admin console.

Forgot/reset handlers validate public recovery requests and forward them to the
backend without requiring a session. Reset success clears the current cookie
but never issues a new session.
