# Auth handlers

Route handlers that log in, register, or log out and manage the secure session cookie.

Forgot/reset handlers validate public recovery requests and forward them to the
backend without requiring a session. Reset success clears the current cookie
but never issues a new session. Errors remain explicit and are localized by the
recovery forms rather than displaying backend English error details.
