using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UnderGroundArchive_Backend.Migrations
{
    /// <inheritdoc />
    public partial class adjustReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_Books_ReportedBookId",
                table: "Reports");

            migrationBuilder.DropForeignKey(
                name: "FK_Reports_Comments_ReportedCommentId",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_ReportedBookId",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_ReportedCommentId",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "ReportedBookId",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "ReportedCommentId",
                table: "Reports");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReportedBookId",
                table: "Reports",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReportedCommentId",
                table: "Reports",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ReportedBookId",
                table: "Reports",
                column: "ReportedBookId");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ReportedCommentId",
                table: "Reports",
                column: "ReportedCommentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_Books_ReportedBookId",
                table: "Reports",
                column: "ReportedBookId",
                principalTable: "Books",
                principalColumn: "BookId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_Comments_ReportedCommentId",
                table: "Reports",
                column: "ReportedCommentId",
                principalTable: "Comments",
                principalColumn: "CommentId");
        }
    }
}
