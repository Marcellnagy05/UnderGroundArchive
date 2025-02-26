using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UnderGroundArchive_Backend.Migrations
{
    /// <inheritdoc />
    public partial class favouriteDoesntWantToWork : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE `Favourites` CHANGE `ChapterId` `ChapterNumber` INT NOT NULL;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ChapterNumber",
                table: "Favourites",
                newName: "ChapterId");

            migrationBuilder.CreateIndex(
                name: "IX_Favourites_ChapterId",
                table: "Favourites",
                column: "ChapterId");

            migrationBuilder.AddForeignKey(
                name: "FK_Favourites_Chapters_ChapterId",
                table: "Favourites",
                column: "ChapterId",
                principalTable: "Chapters",
                principalColumn: "ChapterId",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
