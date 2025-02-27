using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UnderGroundArchive_Backend.Migrations
{
    /// <inheritdoc />
    public partial class removeBookIdFromAchievements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Achievements_Books_BookId",
                table: "Achievements");

            migrationBuilder.DropIndex(
                name: "IX_Achievements_BookId",
                table: "Achievements");

            migrationBuilder.DropColumn(
                name: "BookId",
                table: "Achievements");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<int>(
                name: "BookId",
                table: "Achievements",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Achievements_BookId",
                table: "Achievements",
                column: "BookId");

            migrationBuilder.AddForeignKey(
                name: "FK_Achievements_Books_BookId",
                table: "Achievements",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "BookId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
