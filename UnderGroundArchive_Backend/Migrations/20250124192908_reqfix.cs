using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UnderGroundArchive_Backend.Migrations
{
    /// <inheritdoc />
    public partial class reqfix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "RequestMessage",
                table: "Requests",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Requests",
                keyColumn: "RequestMessage",
                keyValue: null,
                column: "RequestMessage",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "RequestMessage",
                table: "Requests",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
