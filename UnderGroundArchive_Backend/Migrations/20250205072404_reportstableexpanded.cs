using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UnderGroundArchive_Backend.Migrations
{
    /// <inheritdoc />
    public partial class reportstableexpanded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_AspNetUsers_ReportedId",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_ReportedId",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "ReportedId",
                table: "Reports");

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

            migrationBuilder.AddColumn<string>(
                name: "ReportedPersonId",
                table: "Reports",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ReportedBookId",
                table: "Reports",
                column: "ReportedBookId");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ReportedCommentId",
                table: "Reports",
                column: "ReportedCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ReportedPersonId",
                table: "Reports",
                column: "ReportedPersonId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_AspNetUsers_ReportedPersonId",
                table: "Reports",
                column: "ReportedPersonId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_AspNetUsers_ReportedPersonId",
                table: "Reports");

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

            migrationBuilder.DropIndex(
                name: "IX_Reports_ReportedPersonId",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "ReportedBookId",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "ReportedCommentId",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "ReportedPersonId",
                table: "Reports");

            migrationBuilder.AddColumn<string>(
                name: "ReportedId",
                table: "Reports",
                type: "varchar(255)",
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ReportedId",
                table: "Reports",
                column: "ReportedId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_AspNetUsers_ReportedId",
                table: "Reports",
                column: "ReportedId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
