using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WebApi.Migrations
{
    public partial class addAccountChatRoom : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Message",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "User",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ChatMessages");

            migrationBuilder.AddColumn<int>(
                name: "CommentId",
                table: "Notifications",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ChatRoomId",
                table: "ChatMessages",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "ChatMessages",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "OwnerId",
                table: "ChatMessages",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ChatRooms",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Password = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatRooms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AccountChatRooms",
                columns: table => new
                {
                    AccountId = table.Column<int>(nullable: false),
                    ChatRoomId = table.Column<int>(nullable: false),
                    Nickname = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountChatRooms", x => new { x.AccountId, x.ChatRoomId });
                    table.ForeignKey(
                        name: "FK_AccountChatRooms_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AccountChatRooms_ChatRooms_ChatRoomId",
                        column: x => x.ChatRoomId,
                        principalTable: "ChatRooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_ChatRoomId",
                table: "ChatMessages",
                column: "ChatRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_AccountChatRooms_ChatRoomId",
                table: "AccountChatRooms",
                column: "ChatRoomId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMessages_ChatRooms_ChatRoomId",
                table: "ChatMessages",
                column: "ChatRoomId",
                principalTable: "ChatRooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMessages_ChatRooms_ChatRoomId",
                table: "ChatMessages");

            migrationBuilder.DropTable(
                name: "AccountChatRooms");

            migrationBuilder.DropTable(
                name: "ChatRooms");

            migrationBuilder.DropIndex(
                name: "IX_ChatMessages_ChatRoomId",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "CommentId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "ChatRoomId",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "ChatMessages");

            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "ChatMessages",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "User",
                table: "ChatMessages",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "ChatMessages",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
