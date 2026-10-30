# Dtos — "the shapes on the wire"

Request and response records. These are the public API contract and are mirrored
one-to-one in `apps/web/src/types/api.ts` and documented in `docs/API-CONTRACT.md`.

They are deliberately separate from the entities in `Domain/` so that an internal
database change never accidentally changes the public API.

`[Required]`, `[MaxLength]`, `[Range]` attributes are validated by ASP.NET Core
*before* a controller method runs.
