using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WebApi.Migrations
{
    public partial class _1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AppUserPreferences",
                table: "AppUserPreferences");

            migrationBuilder.RenameTable(
                name: "AppUserPreferences",
                newName: "UserPreferences");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserPreferences",
                table: "UserPreferences",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Created = table.Column<DateTime>(nullable: false),
                    OwnerId = table.Column<int>(nullable: false),
                    TargetType = table.Column<int>(nullable: false),
                    TargetId = table.Column<int>(nullable: false),
                    ReportType = table.Column<int>(nullable: false),
                    Detail = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserPreferences",
                table: "UserPreferences");

            migrationBuilder.RenameTable(
                name: "UserPreferences",
                newName: "AppUserPreferences");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppUserPreferences",
                table: "AppUserPreferences",
                column: "Id");
        }
    }
}
