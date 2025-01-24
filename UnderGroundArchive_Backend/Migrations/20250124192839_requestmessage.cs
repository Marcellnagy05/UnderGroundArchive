using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UnderGroundArchive_Backend.Migrations
{
    /// <inheritdoc />
    public partial class requestmessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RequestMessage",
                table: "Requests",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestMessage",
                table: "Requests");
        }
    }
}
