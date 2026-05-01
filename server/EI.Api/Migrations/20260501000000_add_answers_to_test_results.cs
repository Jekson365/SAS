using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EI.Api.Migrations
{
    /// <inheritdoc />
    public partial class add_answers_to_test_results : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "answers",
                table: "test_results",
                type: "jsonb",
                nullable: false,
                defaultValueSql: "'[]'::jsonb");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "answers",
                table: "test_results");
        }
    }
}
