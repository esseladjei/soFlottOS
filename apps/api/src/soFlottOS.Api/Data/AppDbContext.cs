using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Data;

/// <summary>
/// The EF Core database context: the only class that knows how C# objects map to
/// PostgreSQL tables. Each DbSet below becomes one table.
/// <para>
/// The mapping rules (column sizes, indexes, relationships) are configured in
/// OnModelCreating, one private method per table, so everything about the schema
/// lives in this single file.
/// </para>
/// </summary>
public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    public DbSet<Client> Clients => Set<Client>();

    public DbSet<Order> Orders => Set<Order>();

    public DbSet<ProofOfDelivery> ProofOfDeliveries => Set<ProofOfDelivery>();

    public DbSet<Invoice> Invoices => Set<Invoice>();

    public DbSet<NotificationMessage> NotificationMessages => Set<NotificationMessage>();

    public DbSet<EmailMessage> EmailMessages => Set<EmailMessage>();

    public DbSet<BookingAvailability> BookingAvailability => Set<BookingAvailability>();

    public DbSet<ConsentRecord> ConsentRecords => Set<ConsentRecord>();

    public DbSet<PrivacyRequest> PrivacyRequests => Set<PrivacyRequest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureUsers(modelBuilder);
        ConfigureClients(modelBuilder);
        ConfigureOrders(modelBuilder);
        ConfigureProofOfDeliveries(modelBuilder);
        ConfigureInvoices(modelBuilder);
        ConfigureNotifications(modelBuilder);
        ConfigureEmails(modelBuilder);
        ConfigureConsentRecords(modelBuilder);
        ConfigurePrivacyRequests(modelBuilder);
        var availability = modelBuilder.Entity<BookingAvailability>();
        availability.ToTable("BookingAvailability");
        availability.HasKey(entity => entity.Id);
        availability.Property(entity => entity.Id).ValueGeneratedNever();
        availability.Property(entity => entity.WindowsJson).HasColumnType("text").IsRequired();
        availability.HasData(new BookingAvailability());

        base.OnModelCreating(modelBuilder);
    }

    /// <summary>Keeps CreatedAt/UpdatedAt correct without every service remembering to do it.</summary>
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyAuditTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        ApplyAuditTimestamps();
        return base.SaveChanges();
    }

    private void ApplyAuditTimestamps()
    {
        var utcNow = DateTimeOffset.UtcNow;

        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = utcNow;
                entry.Entity.UpdatedAt = utcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = utcNow;
            }
        }
    }

    private static void ConfigureUsers(ModelBuilder modelBuilder)
    {
        var user = modelBuilder.Entity<User>();
        user.ToTable("Users");
        user.HasKey(entity => entity.Id);
        user.Property(entity => entity.Email).HasMaxLength(255).IsRequired();
        user.Property(entity => entity.PasswordHash).HasMaxLength(255).IsRequired();
        user.Property(entity => entity.PasswordResetTokenHash).HasMaxLength(64).IsConcurrencyToken();
        user.Property(entity => entity.PasswordVersion).IsConcurrencyToken();
        user.Property(entity => entity.PreferredLocale).HasMaxLength(2).HasDefaultValue("de").IsRequired();
        user.HasIndex(entity => entity.PasswordResetTokenHash).IsUnique();
        user.Property(entity => entity.FullName).HasMaxLength(150).IsRequired();
        user.Property(entity => entity.Phone).HasMaxLength(50);
        user.Property(entity => entity.VehicleDescription).HasMaxLength(150);

        // Enums are stored as readable strings ("Admin") instead of numbers.
        user.Property(entity => entity.Role).HasConversion<string>().HasMaxLength(32).IsRequired();
        user.Property(entity => entity.Availability).HasConversion<string>().HasMaxLength(32).IsRequired();

        user.HasIndex(entity => entity.Email).IsUnique();
        user.HasIndex(entity => entity.Availability);
    }

    private static void ConfigureClients(ModelBuilder modelBuilder)
    {
        var client = modelBuilder.Entity<Client>();
        client.ToTable("Clients");
        client.HasKey(entity => entity.Id);
        client.Property(entity => entity.CompanyName).HasMaxLength(250).IsRequired();
        client.Property(entity => entity.ContactPerson).HasMaxLength(150).IsRequired();
        client.Property(entity => entity.Email).HasMaxLength(255).IsRequired();
        client.Property(entity => entity.Phone).HasMaxLength(50).IsRequired();
        client.Property(entity => entity.Street).HasMaxLength(250).IsRequired();
        client.Property(entity => entity.City).HasMaxLength(100).IsRequired();
        client.Property(entity => entity.PostalCode).HasMaxLength(20).IsRequired();
        client.Property(entity => entity.Country).HasMaxLength(100).IsRequired();
        client.Property(entity => entity.TaxIdNumber).HasMaxLength(50);
        client.Property(entity => entity.SpecialDeliveryInstructions).HasMaxLength(1000);
        client.Property(entity => entity.DefaultBaseFee).HasPrecision(10, 2);
        client.Property(entity => entity.DefaultRatePerKilometer).HasPrecision(10, 2);
        client.HasIndex(entity => entity.Email);

        // One login account owns at most one CRM record.
        client.HasOne(entity => entity.User)
            .WithOne(user => user.Client)
            .HasForeignKey<Client>(entity => entity.UserId)
            .OnDelete(DeleteBehavior.SetNull);
    }

    private static void ConfigureOrders(ModelBuilder modelBuilder)
    {
        var order = modelBuilder.Entity<Order>();
        order.ToTable("Orders");
        order.HasKey(entity => entity.Id);
        order.Property(entity => entity.CargoCategory).HasConversion<string>().HasMaxLength(32).IsRequired();
        order.Property(entity => entity.Status).HasConversion<string>().HasMaxLength(32).IsRequired();
        order.Property(entity => entity.PaymentMethod).HasConversion<string>().HasMaxLength(32).IsRequired();
        order.Property(entity => entity.WeightKg).HasPrecision(8, 2).IsRequired();

        order.Property(entity => entity.PickupAddress).HasMaxLength(500).IsRequired();
        order.Property(entity => entity.PickupLat).HasPrecision(10, 6);
        order.Property(entity => entity.PickupLng).HasPrecision(10, 6);
        order.Property(entity => entity.PickupContactName).HasMaxLength(150);
        order.Property(entity => entity.PickupPhone).HasMaxLength(50);

        order.Property(entity => entity.DropoffAddress).HasMaxLength(500).IsRequired();
        order.Property(entity => entity.DropoffLat).HasPrecision(10, 6);
        order.Property(entity => entity.DropoffLng).HasPrecision(10, 6);
        order.Property(entity => entity.DropoffContactName).HasMaxLength(150);
        order.Property(entity => entity.DropoffPhone).HasMaxLength(50);

        order.Property(entity => entity.SpecialInstructions).HasMaxLength(1000);
        order.Property(entity => entity.ExternalReference).HasMaxLength(100);
        order.Property(entity => entity.DistanceKm).HasPrecision(8, 2).IsRequired();
        order.Property(entity => entity.NetPrice).HasPrecision(10, 2).IsRequired();
        order.Property(entity => entity.VatAmount).HasPrecision(10, 2).IsRequired();
        order.Property(entity => entity.GrossPrice).HasPrecision(10, 2).IsRequired();

        order.HasIndex(entity => entity.Status);
        order.HasIndex(entity => entity.CreatedAt);

        order.HasOne(entity => entity.Client)
            .WithMany(client => client.Orders)
            .HasForeignKey(entity => entity.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        order.HasOne(entity => entity.AssignedDriver)
            .WithMany(user => user.AssignedOrders)
            .HasForeignKey(entity => entity.AssignedDriverId)
            .OnDelete(DeleteBehavior.SetNull);
    }

    private static void ConfigureProofOfDeliveries(ModelBuilder modelBuilder)
    {
        var pod = modelBuilder.Entity<ProofOfDelivery>();
        pod.ToTable("ProofOfDeliveries");
        pod.HasKey(entity => entity.Id);
        pod.Property(entity => entity.RecipientName).HasMaxLength(150).IsRequired();

        // Signatures are large base64 strings -> text.
        pod.Property(entity => entity.SignatureDataUrl).HasColumnType("text").IsRequired();
        pod.Property(entity => entity.GpsLatitude).HasPrecision(10, 6).IsRequired();
        pod.Property(entity => entity.GpsLongitude).HasPrecision(10, 6).IsRequired();
        pod.HasIndex(entity => entity.OrderId).IsUnique();

        pod.HasOne(entity => entity.Order)
            .WithOne(order => order.ProofOfDelivery)
            .HasForeignKey<ProofOfDelivery>(entity => entity.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureInvoices(ModelBuilder modelBuilder)
    {
        var invoice = modelBuilder.Entity<Invoice>();
        invoice.ToTable("Invoices");
        invoice.HasKey(entity => entity.Id);
        invoice.Property(entity => entity.InvoiceNumber).HasMaxLength(50).IsRequired();
        invoice.Property(entity => entity.NetTotal).HasPrecision(10, 2).IsRequired();
        invoice.Property(entity => entity.VatRate).HasPrecision(5, 4).IsRequired();
        invoice.Property(entity => entity.VatTotal).HasPrecision(10, 2).IsRequired();
        invoice.Property(entity => entity.GrossTotal).HasPrecision(10, 2).IsRequired();
        invoice.Property(entity => entity.Status).HasConversion<string>().HasMaxLength(32).IsRequired();
        invoice.Property(entity => entity.PaymentMethod).HasConversion<string>().HasMaxLength(32).IsRequired();

        // Invoice numbers must be unique (German bookkeeping requirement).
        invoice.HasIndex(entity => entity.InvoiceNumber).IsUnique();
        invoice.HasIndex(entity => entity.Status);

        invoice.HasOne(entity => entity.Client)
            .WithMany(client => client.Invoices)
            .HasForeignKey(entity => entity.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        // One invoice per order, and the order keeps a pointer back to it.
        invoice.HasOne(entity => entity.Order)
            .WithOne(order => order.Invoice)
            .HasForeignKey<Invoice>(entity => entity.OrderId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureNotifications(ModelBuilder modelBuilder)
    {
        var notification = modelBuilder.Entity<NotificationMessage>();
        notification.ToTable("NotificationMessages");
        notification.HasKey(entity => entity.Id);
        notification.Property(entity => entity.Channel).HasConversion<string>().HasMaxLength(32).IsRequired();
        notification.Property(entity => entity.Status).HasConversion<string>().HasMaxLength(32).IsRequired();
        notification.Property(entity => entity.EventType).HasMaxLength(100).IsRequired();
        notification.Property(entity => entity.Recipient).HasMaxLength(100).IsRequired();
        notification.Property(entity => entity.Body).HasColumnType("text").IsRequired();
        notification.Property(entity => entity.LastError).HasMaxLength(2000);
        notification.HasIndex(entity => entity.Status);

        notification.HasOne(entity => entity.Order)
            .WithMany(order => order.Notifications)
            .HasForeignKey(entity => entity.OrderId)
            .OnDelete(DeleteBehavior.SetNull);
    }

    private static void ConfigureEmails(ModelBuilder modelBuilder)
    {
        var email = modelBuilder.Entity<EmailMessage>();
        email.ToTable("EmailMessages");
        email.HasKey(entity => entity.Id);
        email.Property(entity => entity.DeliveryKey).HasMaxLength(32).IsRequired();
        email.HasIndex(entity => entity.DeliveryKey).IsUnique();
        email.Property(entity => entity.EventType).HasMaxLength(100).IsRequired();
        email.Property(entity => entity.Recipient).HasMaxLength(255).IsRequired();
        email.Property(entity => entity.ContentJson).HasColumnType("text").IsRequired();
        email.Property(entity => entity.Status).HasConversion<string>().HasMaxLength(32).IsRequired();
        email.Property(entity => entity.LeaseToken).HasMaxLength(32);
        email.Property(entity => entity.ProviderMessageId).HasMaxLength(255);
        email.Property(entity => entity.LastError).HasMaxLength(2000);
        email.HasIndex(entity => new { entity.Status, entity.NextAttemptAt });
    }

    private static void ConfigureConsentRecords(ModelBuilder modelBuilder)
    {
        var consent = modelBuilder.Entity<ConsentRecord>();
        consent.ToTable("ConsentRecords");
        consent.HasKey(entity => entity.Id);

        // The client supplies the id, so the database must never generate one.
        consent.Property(entity => entity.Id).ValueGeneratedNever();
        consent.Property(entity => entity.Version).HasMaxLength(20).IsRequired();
        consent.Property(entity => entity.Action).HasConversion<string>().HasMaxLength(32).IsRequired();

        // PreviousConsentId is not a foreign key: the earlier decision may already be purged.
        consent.HasIndex(entity => entity.PreviousConsentId);
        consent.HasIndex(entity => entity.CreatedAt);
    }

    private static void ConfigurePrivacyRequests(ModelBuilder modelBuilder)
    {
        var request = modelBuilder.Entity<PrivacyRequest>();
        request.ToTable("PrivacyRequests");
        request.HasKey(entity => entity.Id);
        request.Property(entity => entity.Id).ValueGeneratedNever();
        request.Property(entity => entity.Type).HasConversion<string>().HasMaxLength(32).IsRequired();
        request.Property(entity => entity.Status).HasConversion<string>().HasMaxLength(32).IsRequired();
        request.Property(entity => entity.Email).HasMaxLength(254).IsRequired();
        request.Property(entity => entity.FullName).HasMaxLength(120);
        request.Property(entity => entity.Message).HasMaxLength(2000);
        request.Property(entity => entity.Locale).HasMaxLength(2).IsRequired();
        request.Property(entity => entity.HandlerNote).HasMaxLength(2000);
        request.HasIndex(entity => new { entity.Status, entity.CreatedAt });
    }
}
