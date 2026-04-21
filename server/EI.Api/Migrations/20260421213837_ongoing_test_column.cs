using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EI.Api.Migrations
{
    /// <inheritdoc />
    public partial class ongoing_test_column : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "on_going",
                table: "tests",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "on_going",
                table: "tests");
        }
    }
}
