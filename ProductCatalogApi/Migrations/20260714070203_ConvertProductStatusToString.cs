using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    /// <inheritdoc />
    public partial class ConvertProductStatusToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Products",
                type: "TEXT",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            // SQLite doesn't coerce existing 0/1/2/3 values into enum names on its own -
            // rows written before this migration still hold the old numeric codes as text.
            migrationBuilder.Sql(@"
                UPDATE Products SET Status = CASE Status
                    WHEN '0' THEN 'Active'
                    WHEN '1' THEN 'OutOfStock'
                    WHEN '2' THEN 'Discontinued'
                    WHEN '3' THEN 'ComingSoon'
                    ELSE Status
                END;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE Products SET Status = CASE Status
                    WHEN 'Active' THEN '0'
                    WHEN 'OutOfStock' THEN '1'
                    WHEN 'Discontinued' THEN '2'
                    WHEN 'ComingSoon' THEN '3'
                    ELSE Status
                END;");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Products",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 20);
        }
    }
}
