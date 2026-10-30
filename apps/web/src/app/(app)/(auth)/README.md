# Auth routes

Public login, registration and password-recovery pages. Middleware redirects
signed-in users away from login/registration; forgot/reset remain accessible to
every role. Recovery pages are not indexed and use a no-referrer policy.
