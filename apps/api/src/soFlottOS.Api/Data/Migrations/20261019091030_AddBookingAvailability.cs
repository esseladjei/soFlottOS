using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace soFlottOS.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingAvailability : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BookingAvailability",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    ScheduleEnabled = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsBusy = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    WindowsJson = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingAvailability", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.InsertData(
                table: "BookingAvailability",
                columns: new[] { "Id", "IsBusy", "ScheduleEnabled", "WindowsJson" },
                values: new object[] { 1, false, false, "[]" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookingAvailability");
        }
    }
}
