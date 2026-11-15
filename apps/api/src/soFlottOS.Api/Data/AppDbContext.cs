using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Domain.Entities.Pricing;

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
public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options), IDataProtectionKeyContext
{
    public DbSet<DataProtectionKey> DataProtectionKeys => Set<DataProtectionKey>();

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

    // --- Cost & pricing engine -------------------------------------------------

    public DbSet<CostCategory> CostCategories => Set<CostCategory>();

    public DbSet<CostItem> CostItems => Set<CostItem>();

    public DbSet<VehicleProfile> VehicleProfiles => Set<VehicleProfile>();

    public DbSet<LabourProfile> LabourProfiles => Set<LabourProfile>();

    public DbSet<CostProfile> CostProfiles => Set<CostProfile>();

    public DbSet<CostProfileItem> CostProfileItems => Set<CostProfileItem>();

    public DbSet<PricingProfile> PricingProfiles => Set<PricingProfile>();

    public DbSet<PricingProfileRate> PricingProfileRates => Set<PricingProfileRate>();

    public DbSet<PricingCalculation> PricingCalculations => Set<PricingCalculation>();

    public DbSet<PricingAuditEntry> PricingAuditEntries => Set<PricingAuditEntry>();

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
        ConfigurePricingEngine(modelBuilder);
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
        client.Property(entity => entity.TaxTreatmentOverride).HasConversion<string>().HasMaxLength(32);
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
        order.Property(entity => entity.ServiceType).HasConversion<string>().HasMaxLength(32).IsRequired();
        order.Property(entity => entity.TaxTreatment).HasConversion<string>().HasMaxLength(32).IsRequired();
        order.Property(entity => entity.VatRate).HasPrecision(5, 4).IsRequired();
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
        invoice.Property(entity => entity.ServiceType).HasConversion<string>().HasMaxLength(32).IsRequired();
        invoice.Property(entity => entity.TaxTreatment).HasConversion<string>().HasMaxLength(32).IsRequired();
        invoice.Property(entity => entity.TaxNote).HasMaxLength(300);

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

    private static void ConfigurePricingEngine(ModelBuilder modelBuilder)
    {
        var category = modelBuilder.Entity<CostCategory>();
        category.ToTable("CostCategories");
        category.HasKey(entity => entity.Id);
        category.Property(entity => entity.Name).HasMaxLength(150).IsRequired();
        category.Property(entity => entity.Description).HasMaxLength(500);
        category.Property(entity => entity.BusinessUnit).HasConversion<string>().HasMaxLength(32);

        var item = modelBuilder.Entity<CostItem>();
        item.ToTable("CostItems");
        item.HasKey(entity => entity.Id);
        item.Property(entity => entity.Name).HasMaxLength(150).IsRequired();
        item.Property(entity => entity.Description).HasMaxLength(500);
        item.Property(entity => entity.BusinessUnit).HasConversion<string>().HasMaxLength(32);
        item.Property(entity => entity.CostType).HasConversion<string>().HasMaxLength(32).IsRequired();
        item.Property(entity => entity.Frequency).HasConversion<string>().HasMaxLength(32).IsRequired();
        item.Property(entity => entity.AllocationMethod).HasConversion<string>().HasMaxLength(32).IsRequired();
        item.Property(entity => entity.Amount).HasPrecision(12, 2).IsRequired();
        item.Property(entity => entity.AllocationDenominator).HasPrecision(12, 2);
        item.Property(entity => entity.Currency).HasMaxLength(3).IsRequired();
        item.HasIndex(entity => entity.IsActive);
        item.HasOne(entity => entity.Category)
            .WithMany(c => c.Items)
            .HasForeignKey(entity => entity.CostCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        var vehicle = modelBuilder.Entity<VehicleProfile>();
        vehicle.ToTable("VehicleProfiles");
        vehicle.HasKey(entity => entity.Id);
        vehicle.Property(entity => entity.Name).HasMaxLength(150).IsRequired();
        vehicle.Property(entity => entity.Description).HasMaxLength(500);
        foreach (var name in new[]
                 {
                     nameof(VehicleProfile.PurchasePrice), nameof(VehicleProfile.ExpectedResidualValue),
                     nameof(VehicleProfile.ExpectedUsefulKilometres), nameof(VehicleProfile.TyreReplacementCost),
                     nameof(VehicleProfile.TyreLifespanKm), nameof(VehicleProfile.BrakeReplacementCost),
                     nameof(VehicleProfile.BrakeLifespanKm), nameof(VehicleProfile.ServiceCost),
                     nameof(VehicleProfile.ServiceIntervalKm), nameof(VehicleProfile.AnnualInsurance),
                     nameof(VehicleProfile.AnnualVehicleTax), nameof(VehicleProfile.MonthlyFinancingCost),
                     nameof(VehicleProfile.AnnualOtherCosts), nameof(VehicleProfile.ExpectedAnnualKilometres),
                 })
        {
            vehicle.Property(name).HasPrecision(12, 2);
        }

        vehicle.Property(entity => entity.FuelConsumptionPer100Km).HasPrecision(6, 2);
        vehicle.Property(entity => entity.FuelPricePerLitre).HasPrecision(6, 3);

        var labour = modelBuilder.Entity<LabourProfile>();
        labour.ToTable("LabourProfiles");
        labour.HasKey(entity => entity.Id);
        labour.Property(entity => entity.Name).HasMaxLength(150).IsRequired();
        labour.Property(entity => entity.Description).HasMaxLength(500);
        labour.Property(entity => entity.ResourceType).HasMaxLength(32).IsRequired();
        labour.Property(entity => entity.BusinessUnit).HasConversion<string>().HasMaxLength(32).IsRequired();
        labour.Property(entity => entity.AnnualGrossSalary).HasPrecision(12, 2);
        labour.Property(entity => entity.AnnualAdditionalCosts).HasPrecision(12, 2);
        labour.Property(entity => entity.EmployerContributionPercent).HasPrecision(5, 2);
        labour.Property(entity => entity.PaidHoursPerWeek).HasPrecision(5, 2);
        labour.Property(entity => entity.BillableUtilisationPercent).HasPrecision(5, 2);

        var costProfile = modelBuilder.Entity<CostProfile>();
        costProfile.ToTable("CostProfiles");
        costProfile.HasKey(entity => entity.Id);
        costProfile.Property(entity => entity.Name).HasMaxLength(150).IsRequired();
        costProfile.Property(entity => entity.Description).HasMaxLength(500);
        costProfile.Property(entity => entity.BusinessUnit).HasConversion<string>().HasMaxLength(32).IsRequired();
        costProfile.Property(entity => entity.RiskAllowanceMethod).HasConversion<string>().HasMaxLength(32).IsRequired();
        costProfile.Property(entity => entity.RiskAllowanceValue).HasPrecision(12, 2);
        costProfile.HasOne(entity => entity.VehicleProfile).WithMany().HasForeignKey(entity => entity.VehicleProfileId).OnDelete(DeleteBehavior.SetNull);
        costProfile.HasOne(entity => entity.LabourProfile).WithMany().HasForeignKey(entity => entity.LabourProfileId).OnDelete(DeleteBehavior.SetNull);

        var link = modelBuilder.Entity<CostProfileItem>();
        link.ToTable("CostProfileItems");
        link.HasKey(entity => new { entity.CostProfileId, entity.CostItemId });
        link.HasOne(entity => entity.CostProfile).WithMany(p => p.Items).HasForeignKey(entity => entity.CostProfileId).OnDelete(DeleteBehavior.Cascade);
        link.HasOne(entity => entity.CostItem).WithMany(i => i.ProfileLinks).HasForeignKey(entity => entity.CostItemId).OnDelete(DeleteBehavior.Cascade);

        var pricing = modelBuilder.Entity<PricingProfile>();
        pricing.ToTable("PricingProfiles");
        pricing.HasKey(entity => entity.Id);
        pricing.Property(entity => entity.Name).HasMaxLength(150).IsRequired();
        pricing.Property(entity => entity.Description).HasMaxLength(500);
        pricing.Property(entity => entity.BusinessUnit).HasConversion<string>().HasMaxLength(32).IsRequired();
        pricing.Property(entity => entity.ServiceType).HasConversion<string>().HasMaxLength(32);
        pricing.Property(entity => entity.Strategy).HasConversion<string>().HasMaxLength(32).IsRequired();
        pricing.Property(entity => entity.Currency).HasMaxLength(3).IsRequired();
        pricing.Property(entity => entity.MarkupPercent).HasPrecision(6, 2);
        pricing.Property(entity => entity.TargetMarginPercent).HasPrecision(6, 2);
        pricing.Property(entity => entity.MinimumMarginPercent).HasPrecision(6, 2);
        pricing.Property(entity => entity.FixedPrice).HasPrecision(12, 2);
        pricing.Property(entity => entity.MinimumPrice).HasPrecision(12, 2);
        pricing.HasIndex(entity => new { entity.BusinessUnit, entity.ServiceType, entity.IsActive });
        pricing.HasOne(entity => entity.Client).WithMany().HasForeignKey(entity => entity.ClientId).OnDelete(DeleteBehavior.Cascade);
        pricing.HasOne(entity => entity.CostProfile).WithMany().HasForeignKey(entity => entity.CostProfileId).OnDelete(DeleteBehavior.SetNull);

        var rate = modelBuilder.Entity<PricingProfileRate>();
        rate.ToTable("PricingProfileRates");
        rate.HasKey(entity => entity.Id);
        rate.Property(entity => entity.Label).HasMaxLength(150).IsRequired();
        rate.Property(entity => entity.Unit).HasConversion<string>().HasMaxLength(32).IsRequired();
        rate.Property(entity => entity.Rate).HasPrecision(12, 4).IsRequired();
        rate.Property(entity => entity.IncludedQuantity).HasPrecision(12, 2);
        rate.HasOne(entity => entity.PricingProfile).WithMany(p => p.Rates).HasForeignKey(entity => entity.PricingProfileId).OnDelete(DeleteBehavior.Cascade);

        var calc = modelBuilder.Entity<PricingCalculation>();
        calc.ToTable("PricingCalculations");
        calc.HasKey(entity => entity.Id);
        calc.Property(entity => entity.Name).HasMaxLength(150);
        calc.Property(entity => entity.Currency).HasMaxLength(3).IsRequired();
        calc.Property(entity => entity.BusinessUnit).HasConversion<string>().HasMaxLength(32).IsRequired();
        calc.Property(entity => entity.ServiceType).HasConversion<string>().HasMaxLength(32).IsRequired();
        calc.Property(entity => entity.TaxTreatment).HasConversion<string>().HasMaxLength(32).IsRequired();
        calc.Property(entity => entity.Status).HasConversion<string>().HasMaxLength(32).IsRequired();
        calc.Property(entity => entity.VatRate).HasPrecision(5, 4);
        calc.Property(entity => entity.ExpectedMarginPercent).HasPrecision(8, 2);
        foreach (var name in new[]
                 {
                     nameof(PricingCalculation.DirectCosts), nameof(PricingCalculation.AllocatedOverhead),
                     nameof(PricingCalculation.LabourCosts), nameof(PricingCalculation.VehicleCosts),
                     nameof(PricingCalculation.RiskAllowance), nameof(PricingCalculation.TotalEstimatedCost),
                     nameof(PricingCalculation.FinalNetSellingPrice), nameof(PricingCalculation.VatAmount),
                     nameof(PricingCalculation.FinalGrossSellingPrice), nameof(PricingCalculation.ExpectedProfit),
                 })
        {
            calc.Property(name).HasPrecision(12, 2);
        }

        calc.Property(entity => entity.InputJson).HasColumnType("text").IsRequired();
        calc.Property(entity => entity.BreakdownJson).HasColumnType("text").IsRequired();
        calc.HasIndex(entity => entity.CalculationId).IsUnique();
        calc.HasIndex(entity => entity.OrderId);
        calc.HasIndex(entity => new { entity.IsSimulation, entity.CreatedAt });

        var audit = modelBuilder.Entity<PricingAuditEntry>();
        audit.ToTable("PricingAuditEntries");
        audit.HasKey(entity => entity.Id);
        audit.Property(entity => entity.EntityType).HasMaxLength(64).IsRequired();
        audit.Property(entity => entity.Action).HasConversion<string>().HasMaxLength(32).IsRequired();
        audit.Property(entity => entity.Summary).HasMaxLength(1000).IsRequired();
        audit.HasIndex(entity => entity.CreatedAt);
    }
}
