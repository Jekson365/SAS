using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EI.Api.Migrations
{
    /// <inheritdoc />
    public partial class add_question_type_image_answer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "type",
                table: "questions",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "quiz");

            migrationBuilder.AddColumn<string>(
                name: "image_url",
                table: "questions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "correct_answer",
                table: "questions",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "type",           table: "questions");
            migrationBuilder.DropColumn(name: "image_url",      table: "questions");
            migrationBuilder.DropColumn(name: "correct_answer", table: "questions");
        }
    }
}
