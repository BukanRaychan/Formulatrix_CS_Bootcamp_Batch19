using EntityFramework.Data;
using EntityFramework.Models;
using Microsoft.EntityFrameworkCore;

namespace EntityFramework.Services;

public class MenuService : IMenuService
{
    private readonly AppDbContext _db;

    public MenuService(AppDbContext db) => _db = db;

    public List<MenuCategory> GetCategories() =>
        _db.MenuCategories
           .Include(c => c.MenuItems)
           .OrderBy(c => c.Name)
           .ToList();

    public MenuCategory AddCategory(string name)
    {
        var category = new MenuCategory { Name = name };
        _db.MenuCategories.Add(category);
        _db.SaveChanges();
        return category;
    }

    public bool DeleteCategory(int id)
    {
        var category = _db.MenuCategories.Find(id);
        if (category is null) return false;

        _db.MenuCategories.Remove(category);
        _db.SaveChanges();
        return true;
    }

    public List<MenuItem> GetItems() =>
        _db.MenuItems
           .Include(i => i.MenuCategory)
           .OrderBy(i => i.Name)
           .ToList();

    public MenuItem? AddItem(string name, decimal price, int categoryId)
    {
        if (_db.MenuCategories.Find(categoryId) is null) return null;

        var item = new MenuItem
        {
            Name = name,
            Price = price,
            MenuCategoryId = categoryId
        };
        _db.MenuItems.Add(item);
        _db.SaveChanges();
        return item;
    }

    public bool DeleteItem(int id)
    {
        var item = _db.MenuItems.Find(id);
        if (item is null) return false;

        _db.MenuItems.Remove(item);
        _db.SaveChanges();
        return true;
    }
}
