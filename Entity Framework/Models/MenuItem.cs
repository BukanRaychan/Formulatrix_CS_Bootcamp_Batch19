using System.ComponentModel.DataAnnotations;

namespace EntityFramework.Models;

public class MenuItem
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public decimal Price { get; set; }
    
    [Required]
    public int MenuCategoryId { get; set; }
    
    public MenuCategory? MenuCategory { get; set; }
}