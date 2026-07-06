using EntityFramework.Models;
using EntityFramework.Services;

namespace EntityFramework.Controllers;

// The connector between the Views (pages) and the Services. Pages call the
// controller for every data operation, so they never touch IMenuService or
// the DbContext directly. It returns data/results; rendering stays in the views.
public class MenuController
{
    private readonly IMenuService _service;

    public MenuController(IMenuService service) => _service = service;

    // Categories
    public List<MenuCategory> GetCategories() => _service.GetCategories();
    public MenuCategory AddCategory(string name) => _service.AddCategory(name);
    public bool DeleteCategory(int id) => _service.DeleteCategory(id);

    // Items
    public List<MenuItem> GetItems() => _service.GetItems();
    public MenuItem? AddItem(string name, decimal price, int categoryId) =>
        _service.AddItem(name, price, categoryId);
    public bool DeleteItem(int id) => _service.DeleteItem(id);
}
