using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EI.Api.Migrations
{
    /// <inheritdoc />
    public partial class add_test_duration_and_started_at : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "duration_minutes",
                table: "tests",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "started_at",
                table: "tests",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "duration_minutes",
                table: "tests");

            migrationBuilder.DropColumn(
                name: "started_at",
                table: "tests");
        }
    }
}
