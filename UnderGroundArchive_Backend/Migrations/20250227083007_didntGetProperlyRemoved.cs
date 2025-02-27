using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UnderGroundArchive_Backend.Migrations
{
    /// <inheritdoc />
    public partial class didntGetProperlyRemoved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Achievements_Books_BooksBookId",
                table: "Achievements");

            migrationBuilder.DropIndex(
                name: "IX_Achievements_BooksBookId",
                table: "Achievements");

            migrationBuilder.DropColumn(
                name: "BooksBookId",
                table: "Achievements");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BooksBookId",
                table: "Achievements",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Achievements_BooksBookId",
                table: "Achievements",
                column: "BooksBookId");

            migrationBuilder.AddForeignKey(
                name: "FK_Achievements_Books_BooksBookId",
                table: "Achievements",
                column: "BooksBookId",
                principalTable: "Books",
                principalColumn: "BookId");
        }
    }
}
