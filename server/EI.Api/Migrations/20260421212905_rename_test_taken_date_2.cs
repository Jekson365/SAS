using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EI.Api.Migrations
{
    /// <inheritdoc />
    public partial class rename_test_taken_date_2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "test_taken_date",
                table: "tests");

            migrationBuilder.AddColumn<DateTime>(
                name: "test_start_date",
                table: "tests",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "test_start_date",
                table: "tests");

            migrationBuilder.AddColumn<DateOnly>(
                name: "test_taken_date",
                table: "tests",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }
    }
}
