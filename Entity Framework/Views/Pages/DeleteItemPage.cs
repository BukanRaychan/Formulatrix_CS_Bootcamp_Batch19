using EntityFramework.Controllers;
using EntityFramework.Models;
using Spectre.Console;

namespace EntityFramework.Views.Pages;

public class DeleteItemPage : IPage
{
    private readonly MenuController _controller;

    public DeleteItemPage(MenuController controller) => _controller = controller;

    public IPage? Index()
    {
        Layout.Header("Delete Item");

        var items = _controller.GetItems();
        if (items.Count == 0)
        {
            Layout.Info("No items to delete.");
            Layout.Pause();
            return new MainMenuPage(_controller);
        }

        // Id 0 is a sentinel for the "cancel" choice.
        var cancel = new MenuItem { Id = 0, Name = "‹ Cancel ›" };
        var choices = new List<MenuItem>(items) { cancel };

        var selected = AnsiConsole.Prompt(
            new SelectionPrompt<MenuItem>()
                .Title("Select an item to [red]delete[/]")
                .HighlightStyle("red")
                .UseConverter(i => i.Id == 0 ? i.Name : $"{i.Name} ({i.Price:C})")
                .AddChoices(choices));

        if (selected.Id == 0)
        {
            Layout.Info("Cancelled.");
        }
        else if (AnsiConsole.Confirm($"Really delete [red]{Markup.Escape(selected.Name)}[/]?", false))
        {
            if (_controller.DeleteItem(selected.Id))
                Layout.Success($"Deleted '{selected.Name}'.");
            else
                Layout.Error("Item not found.");
        }
        else
        {
            Layout.Info("Cancelled.");
        }

        Layout.Pause();
        return new MainMenuPage(_controller);
    }
}
