# Data — "how the business is stored"

Everything that talks to PostgreSQL through EF Core.

* `AppDbContext.cs` — the database session plus the full schema mapping
  (one small private method per table inside `OnModelCreating`).
* `Repositories/` — one file per table group. Each file contains the interface
  (what the services are allowed to ask for) and the EF Core implementation.
* `DataSeeder.cs` — creates the demo accounts in development.
* `Migrations/` — generated SQL history. Never edit by hand; run
  `dotnet ef migrations add <Name>` from `apps/api` instead.
