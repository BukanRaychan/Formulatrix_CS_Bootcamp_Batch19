using EntityFramework.Models;

namespace EntityFramework.Services;

// The "Model" layer of MVC: all data access lives here so controllers
// stay thin and never touch the DbContext directly.
public interface IMenuService
{
    // Categories
    List<MenuCategory> GetCategories();
    MenuCategory AddCategory(string name);
    bool DeleteCategory(int id);

    // Items
    List<MenuItem> GetItems();
    MenuItem? AddItem(string name, decimal price, int categoryId);
    bool DeleteItem(int id);
}
