using System.ComponentModel.DataAnnotations;

namespace EntityFramework.Models;

public class MenuCategory
{
    public int Id {get; set;}

    [Required]
    public string Name {get;set;} = string.Empty;

    public List<MenuItem> MenuItems {get;set;} = [];
}