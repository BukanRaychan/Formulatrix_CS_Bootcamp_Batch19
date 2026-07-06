using EntityFramework.Controllers;
using Spectre.Console;

namespace EntityFramework.Views.Pages;

public class ItemListPage : IPage
{
    private readonly MenuController _controller;

    public ItemListPage(MenuController controller) => _controller = controller;

    public IPage? Index()
    {
        Layout.Header("Items");

        var items = _controller.GetItems();
        if (items.Count == 0)
        {
            Layout.Info("No items yet.");
        }
        else
        {
            var table = new Table()
                .Border(TableBorder.Rounded)
                .BorderColor(Color.Grey);

            table.AddColumn("[bold]Id[/]");
            table.AddColumn("[bold]Name[/]");
            table.AddColumn("[bold]Price[/]");
            table.AddColumn("[bold]Category[/]");

            foreach (var i in items)
                table.AddRow(
                    i.Id.ToString(),
                    Markup.Escape(i.Name),
                    $"[green]{i.Price:C}[/]",
                    Markup.Escape(i.MenuCategory?.Name ?? "?"));

            AnsiConsole.Write(table);
        }

        Layout.Pause();
        return new MainMenuPage(_controller);
    }
}
