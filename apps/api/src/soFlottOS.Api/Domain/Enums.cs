namespace soFlottOS.Api.Domain;

// ---------------------------------------------------------------------------
// All enumerations used by the domain live in this single file so that a
// newcomer can see every "allowed value" of the system at a glance.
// They are stored in PostgreSQL as readable strings (see AppDbContext) and sent to
// the frontend as strings too (see Program.cs -> JsonStringEnumConverter).
// ---------------------------------------------------------------------------

/// <summary>Who the user is. Kept deliberately flat to avoid permission complexity.</summary>
public enum UserRole
{
    /// <summary>Runs the business: dispatching, CRM, invoicing.</summary>
    Admin = 1,

    /// <summary>A B2B customer (workshop, pharmacy, law firm...) that books deliveries.</summary>
    Client = 2,

    /// <summary>A courier that picks up and delivers orders.</summary>
    Driver = 3
}

/// <summary>Driver availability state machine (see DriverService).</summary>
public enum DriverAvailability
{
    /// <summary>Not accepting work (set by the driver).</summary>
    Offline = 1,

    /// <summary>Ready for dispatch (set by the driver).</summary>
    Online = 2,

    /// <summary>Currently on a job (set automatically by the system).</summary>
    Busy = 3
}

/// <summary>Lifecycle of a delivery order.</summary>
public enum OrderStatus
{
    Pending = 1,
    Assigned = 2,
    InTransit = 3,
    Delivered = 4,
    Cancelled = 5
}

/// <summary>Lifecycle of an invoice (Rechnung).</summary>
public enum InvoiceStatus
{
    Draft = 1,
    Sent = 2,
    Paid = 3,
    Overdue = 4
}

/// <summary>How the client settles the invoice. v1 is manual on purpose.</summary>
public enum PaymentMethod
{
    /// <summary>German bank transfer (Überweisung) against the generated invoice.</summary>
    BankTransfer = 1,

    /// <summary>Client sends money to the business PayPal handle, Admin marks it paid.</summary>
    PayPal = 2
}

/// <summary>What is being transported - drives handling expectations.</summary>
public enum CargoCategory
{
    Document = 1,
    SmallBox = 2,
    AutoPart = 3,
    Oversized = 4
}

/// <summary>Transport channel of an outbound customer notification.</summary>
public enum NotificationChannel
{
    Sms = 1,
    WhatsApp = 2
}

/// <summary>Delivery state of a queued notification.</summary>
public enum NotificationStatus
{
    Pending = 1,
    Sent = 2,
    Failed = 3
}
