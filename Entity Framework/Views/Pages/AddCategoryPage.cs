using EntityFramework.Controllers;
using Microsoft.EntityFrameworkCore;

namespace EntityFramework.Views.Pages;

public class AddCategoryPage : IPage
{
    private readonly MenuController _controller;

    public AddCategoryPage(MenuController controller) => _controller = controller;

    public IPage? Index()
    {
        Layout.Header("Add Category");

        var name = Layout.AskText("Category name");

        try
        {
            var category = _controller.AddCategory(name);
            Layout.Success($"Added category '{category.Name}' (id {category.Id}).");
        }
        catch (DbUpdateException)
        {
            // The Name column has a unique index.
            Layout.Error($"A category named '{name}' already exists.");
        }

        Layout.Pause();
        return new MainMenuPage(_controller);
    }
}
