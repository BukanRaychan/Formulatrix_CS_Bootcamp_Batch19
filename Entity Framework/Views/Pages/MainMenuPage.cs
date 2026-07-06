using EntityFramework.Controllers;
using Spectre.Console;

namespace EntityFramework.Views.Pages;

// The hub. Presents an arrow-key menu and returns the chosen page.
public class MainMenuPage : IPage
{
    private readonly MenuController _controller;

    public MainMenuPage(MenuController controller) => _controller = controller;

    public IPage? Index()
    {
        Layout.Header("Restaurant Menu Manager");

        var choice = AnsiConsole.Prompt(
            new SelectionPrompt<string>()
                .Title("What would you like to do?")
                .HighlightStyle("cyan")
                .AddChoices(
                    "List categories",
                    "Add category",
                    "List items",
                    "Add item",
                    "Delete item",
                    "Exit"));

        return choice switch
        {
            "List categories" => new CategoryListPage(_controller),
            "Add category"    => new AddCategoryPage(_controller),
            "List items"      => new ItemListPage(_controller),
            "Add item"        => new AddItemPage(_controller),
            "Delete item"     => new DeleteItemPage(_controller),
            _                 => null,   // Exit ends the page loop
        };
    }
}
