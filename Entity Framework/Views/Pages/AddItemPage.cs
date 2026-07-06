using EntityFramework.Controllers;
using EntityFramework.Models;
using Microsoft.EntityFrameworkCore;
using Spectre.Console;

namespace EntityFramework.Views.Pages;

public class AddItemPage : IPage
{
    private readonly MenuController _controller;

    public AddItemPage(MenuController controller) => _controller = controller;

    public IPage? Index()
    {
        Layout.Header("Add Item");

        var categories = _controller.GetCategories();
        if (categories.Count == 0)
        {
            Layout.Error("Add a category first — every item needs one.");
            Layout.Pause();
            return new MainMenuPage(_controller);
        }

        var name = Layout.AskText("Item name");
        var price = Layout.AskDecimal("Price");

        // Pick the category from a list instead of typing an id.
        var category = AnsiConsole.Prompt(
            new SelectionPrompt<MenuCategory>()
                .Title("Choose a [green]category[/]")
                .HighlightStyle("cyan")
                .UseConverter(c => c.Name)
                .AddChoices(categories));

        try
        {
            var item = _controller.AddItem(name, price, category.Id);
            if (item is null)
                Layout.Error("Category not found.");
            else
                Layout.Success($"Added item '{item.Name}' to '{category.Name}'.");
        }
        catch (DbUpdateException)
        {
            Layout.Error($"An item named '{name}' already exists.");
        }

        Layout.Pause();
        return new MainMenuPage(_controller);
    }
}
