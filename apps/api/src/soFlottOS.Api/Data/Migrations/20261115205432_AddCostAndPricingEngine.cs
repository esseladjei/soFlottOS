using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace soFlottOS.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCostAndPricingEngine : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PricingCalculationId",
                table: "Orders",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ServiceType",
                table: "Orders",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaxTreatment",
                table: "Orders",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "VatRate",
                table: "Orders",
                type: "numeric(5,4)",
                precision: 5,
                scale: 4,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "ServiceType",
                table: "Invoices",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaxNote",
                table: "Invoices",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxTreatment",
                table: "Invoices",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaxTreatmentOverride",
                table: "Clients",
                type: "character varying(32)",
                maxLength: 32,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CostCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    BusinessUnit = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CostCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LabourProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    BusinessUnit = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    ResourceType = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    AnnualGrossSalary = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    EmployerContributionPercent = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    AnnualAdditionalCosts = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    PaidHoursPerWeek = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    AnnualLeaveDays = table.Column<int>(type: "integer", nullable: false),
                    PublicHolidayDays = table.Column<int>(type: "integer", nullable: false),
                    TrainingAndSickDays = table.Column<int>(type: "integer", nullable: false),
                    BillableUtilisationPercent = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LabourProfiles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PricingAuditEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EntityType = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    EntityId = table.Column<int>(type: "integer", nullable: false),
                    Action = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Summary = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingAuditEntries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PricingCalculations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CalculationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    IsSimulation = table.Column<bool>(type: "boolean", nullable: false),
                    BusinessUnit = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    ServiceType = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    ClientId = table.Column<int>(type: "integer", nullable: true),
                    OrderId = table.Column<int>(type: "integer", nullable: true),
                    PricingProfileId = table.Column<int>(type: "integer", nullable: true),
                    PricingProfileVersion = table.Column<int>(type: "integer", nullable: true),
                    CostProfileId = table.Column<int>(type: "integer", nullable: true),
                    CostProfileVersion = table.Column<int>(type: "integer", nullable: true),
                    Currency = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                    DirectCosts = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    AllocatedOverhead = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    LabourCosts = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    VehicleCosts = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    RiskAllowance = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    TotalEstimatedCost = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    FinalNetSellingPrice = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    TaxTreatment = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    VatRate = table.Column<decimal>(type: "numeric(5,4)", precision: 5, scale: 4, nullable: false),
                    VatAmount = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    FinalGrossSellingPrice = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    ExpectedProfit = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    ExpectedMarginPercent = table.Column<decimal>(type: "numeric(8,2)", precision: 8, scale: 2, nullable: false),
                    Status = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    InputJson = table.Column<string>(type: "text", nullable: false),
                    BreakdownJson = table.Column<string>(type: "text", nullable: false),
                    CreatedByUserId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingCalculations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VehicleProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    PurchasePrice = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    PurchaseDate = table.Column<DateOnly>(type: "date", nullable: true),
                    ExpectedResidualValue = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    ExpectedUsefulKilometres = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    FuelConsumptionPer100Km = table.Column<decimal>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: false),
                    FuelPricePerLitre = table.Column<decimal>(type: "numeric(6,3)", precision: 6, scale: 3, nullable: false),
                    TyreReplacementCost = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    TyreLifespanKm = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    BrakeReplacementCost = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    BrakeLifespanKm = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    ServiceCost = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    ServiceIntervalKm = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    AnnualInsurance = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    AnnualVehicleTax = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    MonthlyFinancingCost = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    AnnualOtherCosts = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    OperatingDaysPerYear = table.Column<int>(type: "integer", nullable: false),
                    ExpectedAnnualKilometres = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VehicleProfiles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CostItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CostCategoryId = table.Column<int>(type: "integer", nullable: false),
                    BusinessUnit = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    CostType = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    Currency = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                    Frequency = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    AllocationMethod = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    AllocationDenominator = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: true),
                    EffectiveFrom = table.Column<DateOnly>(type: "date", nullable: true),
                    EffectiveTo = table.Column<DateOnly>(type: "date", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CostItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CostItems_CostCategories_CostCategoryId",
                        column: x => x.CostCategoryId,
                        principalTable: "CostCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CostProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    BusinessUnit = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    VehicleProfileId = table.Column<int>(type: "integer", nullable: true),
                    LabourProfileId = table.Column<int>(type: "integer", nullable: true),
                    RiskAllowanceMethod = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    RiskAllowanceValue = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    Version = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CostProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CostProfiles_LabourProfiles_LabourProfileId",
                        column: x => x.LabourProfileId,
                        principalTable: "LabourProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_CostProfiles_VehicleProfiles_VehicleProfileId",
                        column: x => x.VehicleProfileId,
                        principalTable: "VehicleProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "CostProfileItems",
                columns: table => new
                {
                    CostProfileId = table.Column<int>(type: "integer", nullable: false),
                    CostItemId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CostProfileItems", x => new { x.CostProfileId, x.CostItemId });
                    table.ForeignKey(
                        name: "FK_CostProfileItems_CostItems_CostItemId",
                        column: x => x.CostItemId,
                        principalTable: "CostItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CostProfileItems_CostProfiles_CostProfileId",
                        column: x => x.CostProfileId,
                        principalTable: "CostProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PricingProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    BusinessUnit = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    ServiceType = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    ClientId = table.Column<int>(type: "integer", nullable: true),
                    CostProfileId = table.Column<int>(type: "integer", nullable: true),
                    Strategy = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    MarkupPercent = table.Column<decimal>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: true),
                    TargetMarginPercent = table.Column<decimal>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: true),
                    FixedPrice = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: true),
                    MinimumPrice = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: true),
                    MinimumMarginPercent = table.Column<decimal>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: true),
                    Currency = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false),
                    EffectiveFrom = table.Column<DateOnly>(type: "date", nullable: true),
                    EffectiveTo = table.Column<DateOnly>(type: "date", nullable: true),
                    Version = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PricingProfiles_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PricingProfiles_CostProfiles_CostProfileId",
                        column: x => x.CostProfileId,
                        principalTable: "CostProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "PricingProfileRates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PricingProfileId = table.Column<int>(type: "integer", nullable: false),
                    Label = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Unit = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Rate = table.Column<decimal>(type: "numeric(12,4)", precision: 12, scale: 4, nullable: false),
                    IncludedQuantity = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingProfileRates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PricingProfileRates_PricingProfiles_PricingProfileId",
                        column: x => x.PricingProfileId,
                        principalTable: "PricingProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CostItems_CostCategoryId",
                table: "CostItems",
                column: "CostCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_CostItems_IsActive",
                table: "CostItems",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_CostProfileItems_CostItemId",
                table: "CostProfileItems",
                column: "CostItemId");

            migrationBuilder.CreateIndex(
                name: "IX_CostProfiles_LabourProfileId",
                table: "CostProfiles",
                column: "LabourProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_CostProfiles_VehicleProfileId",
                table: "CostProfiles",
                column: "VehicleProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingAuditEntries_CreatedAt",
                table: "PricingAuditEntries",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_PricingCalculations_CalculationId",
                table: "PricingCalculations",
                column: "CalculationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PricingCalculations_IsSimulation_CreatedAt",
                table: "PricingCalculations",
                columns: new[] { "IsSimulation", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_PricingCalculations_OrderId",
                table: "PricingCalculations",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingProfileRates_PricingProfileId",
                table: "PricingProfileRates",
                column: "PricingProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingProfiles_BusinessUnit_ServiceType_IsActive",
                table: "PricingProfiles",
                columns: new[] { "BusinessUnit", "ServiceType", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_PricingProfiles_ClientId",
                table: "PricingProfiles",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingProfiles_CostProfileId",
                table: "PricingProfiles",
                column: "CostProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CostProfileItems");

            migrationBuilder.DropTable(
                name: "PricingAuditEntries");

            migrationBuilder.DropTable(
                name: "PricingCalculations");

            migrationBuilder.DropTable(
                name: "PricingProfileRates");

            migrationBuilder.DropTable(
                name: "CostItems");

            migrationBuilder.DropTable(
                name: "PricingProfiles");

            migrationBuilder.DropTable(
                name: "CostCategories");

            migrationBuilder.DropTable(
                name: "CostProfiles");

            migrationBuilder.DropTable(
                name: "LabourProfiles");

            migrationBuilder.DropTable(
                name: "VehicleProfiles");

            migrationBuilder.DropColumn(
                name: "PricingCalculationId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ServiceType",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "TaxTreatment",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "VatRate",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ServiceType",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "TaxNote",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "TaxTreatment",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "TaxTreatmentOverride",
                table: "Clients");
        }
    }
}
