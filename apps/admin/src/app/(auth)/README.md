# Auth routes

Login and password-recovery pages. Only Admin accounts can sign in; clients and
drivers are refused by `/api/auth/login` and must use the customer portal.
Middleware redirects signed-in admins away from login; forgot/reset stay public.
Recovery pages are not indexed and use a no-referrer policy.
