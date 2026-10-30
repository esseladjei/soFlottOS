# Domain — "what the business is made of"

Plain C# classes that mirror the real world: a user, a client company, an order,
a proof of delivery, an invoice, a queued notification.

* `Enums.cs` — the fixed lists of values (roles, order status, invoice status, ...).
* `Entities/` — one file per database table. `BaseEntity.cs` holds `Id`, `CreatedAt`, `UpdatedAt`.

Rules of this layer: **no** database code, **no** HTTP code, **no** references to other layers.
