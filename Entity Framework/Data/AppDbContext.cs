using Microsoft.EntityFrameworkCore;
using EntityFramework.Models;

namespace EntityFramework.Data;

public class AppDbContext : DbContext
{
    public DbSet<MenuCategory> MenuCategories {get; set;}
    public DbSet<MenuItem> MenuItems {get;set;}

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite(@"Data Source=MyDatabase.db");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuCategory>(entity =>
            {
                entity.HasIndex(e => e.Name).IsUnique();
            });

            modelBuilder.Entity<MenuItem>(entity =>
            {
                entity.HasIndex(e => e.Name).IsUnique();
                
                entity.HasOne(e => e.MenuCategory)
                    .WithMany(e => e.MenuItems)
                    .HasForeignKey(e => e.MenuCategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
} 