using EntityFramework.Controllers;
using Spectre.Console;

namespace EntityFramework.Views.Pages;

public class CategoryListPage : IPage
{
    private readonly MenuController _controller;

    public CategoryListPage(MenuController controller) => _controller = controller;

    public IPage? Index()
    {
        Layout.Header("Categories");

        var categories = _controller.GetCategories();
        if (categories.Count == 0)
        {
            Layout.Info("No categories yet.");
        }
        else
        {
            var table = new Table()
                .Border(TableBorder.Rounded)
                .BorderColor(Color.Grey);

            table.AddColumn("[bold]Id[/]");
            table.AddColumn("[bold]Name[/]");
            table.AddColumn("[bold]Items[/]");

            foreach (var c in categories)
                table.AddRow(
                    c.Id.ToString(),
                    Markup.Escape(c.Name),
                    c.MenuItems.Count.ToString());

            AnsiConsole.Write(table);
        }

        Layout.Pause();
        return new MainMenuPage(_controller);
    }
}
