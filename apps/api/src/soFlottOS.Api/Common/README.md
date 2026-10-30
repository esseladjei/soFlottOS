# Common — "shared plumbing"

* `AppOptions.cs` — every `appsettings.json` section as a typed class, each with a
  `Validate()` that is called at startup so misconfiguration fails immediately.
* `AppExceptions.cs` — the small set of exceptions services throw
  (NotFound, Validation, Conflict, Unauthorized, Forbidden, ExternalService).
* `ApiExceptionHandler.cs` — turns those exceptions into HTTP status codes + problem JSON.
* `CurrentUser.cs` — reads the id/role out of the JWT of the caller.
* `Roles.cs` — role name constants used by `[Authorize]`.
