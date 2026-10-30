# Controllers — "the front door"

One controller per URL group. They do only three things:

1. check the caller's role with `[Authorize(Roles = ...)]`,
2. hand the validated request to a service,
3. return the service result as JSON.

No business logic lives here. Errors are thrown as exceptions by the services and
translated into RFC 7807 problem responses by `Common/ApiExceptionHandler.cs`.
