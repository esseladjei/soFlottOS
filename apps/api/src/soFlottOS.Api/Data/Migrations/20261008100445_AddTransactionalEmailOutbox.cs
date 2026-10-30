using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace soFlottOS.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionalEmailOutbox : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmailMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    DeliveryKey = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    EventType = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Recipient = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    ContentJson = table.Column<string>(type: "longtext", nullable: false),
                    Status = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    AttemptCount = table.Column<int>(type: "int", nullable: false),
                    NextAttemptAt = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                    FirstAttemptAt = table.Column<DateTimeOffset>(type: "datetime", nullable: true),
                    LeaseUntil = table.Column<DateTimeOffset>(type: "datetime", nullable: true),
                    LeaseToken = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: true),
                    ProviderMessageId = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    LastError = table.Column<string>(type: "varchar(2000)", maxLength: 2000, nullable: true),
                    SentAt = table.Column<DateTimeOffset>(type: "datetime", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailMessages", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_EmailMessages_DeliveryKey",
                table: "EmailMessages",
                column: "DeliveryKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EmailMessages_Status_NextAttemptAt",
                table: "EmailMessages",
                columns: new[] { "Status", "NextAttemptAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailMessages");
        }
    }
}
