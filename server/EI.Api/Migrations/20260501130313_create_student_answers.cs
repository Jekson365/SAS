using System.Collections.Generic;
using EI.Api.Models;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EI.Api.Migrations
{
    /// <inheritdoc />
    public partial class create_student_answers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<StudentAnswerRecord>>(
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
