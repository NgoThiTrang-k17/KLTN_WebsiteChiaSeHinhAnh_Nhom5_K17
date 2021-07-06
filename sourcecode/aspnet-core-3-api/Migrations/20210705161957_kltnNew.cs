using Microsoft.EntityFrameworkCore.Migrations;

namespace WebApi.Migrations
{
    public partial class kltnNew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SearchHistory",
                table: "Users",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ReportType",
                table: "Reports",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SearchHistory",
                table: "Users");

            migrationBuilder.AlterColumn<int>(
                name: "ReportType",
                table: "Reports",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
