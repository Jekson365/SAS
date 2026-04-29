using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace EI.Api.Migrations
{
    /// <inheritdoc />
    public partial class add_events : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "events",
                columns: table => new
                {
                    id          = table.Column<int>(type: "integer", nullable: false)
                                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name        = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "text", nullable: false, defaultValue: ""),
                    event_date  = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_events", x => x.id);
                });

            migrationBuilder.AddColumn<int>(
                name: "event_id",
                table: "tests",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_tests_event_id",
                table: "tests",
                column: "event_id");

            migrationBuilder.AddForeignKey(
                name: "FK_tests_events_event_id",
                table: "tests",
                column: "event_id",
                principalTable: "events",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_tests_events_event_id", table: "tests");
            migrationBuilder.DropIndex(name: "IX_tests_event_id", table: "tests");
            migrationBuilder.DropColumn(name: "event_id", table: "tests");
            migrationBuilder.DropTable(name: "events");
        }
    }
}
