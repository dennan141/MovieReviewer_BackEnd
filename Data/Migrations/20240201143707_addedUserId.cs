using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieReviewer.Data.Migrations
{
    /// <inheritdoc />
    public partial class addedUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CustomUserId",
                table: "Reviews",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Reviews",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Movies",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_CustomUserId",
                table: "Reviews",
                column: "CustomUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_AspNetUsers_CustomUserId",
                table: "Reviews",
                column: "CustomUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_AspNetUsers_CustomUserId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_CustomUserId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "CustomUserId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Movies");
        }
    }
}
