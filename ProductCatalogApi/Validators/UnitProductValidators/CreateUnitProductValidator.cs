using FluentValidation;
using ProductCatalogAPI.Data;
using ProductCatalogAPI.DTOs.UnitProductDtos;

namespace ProductCatalogAPI.Validators.UnitProductValidators;

public class CreateUnitProductValidator : AbstractValidator<CreateUnitProductDto>
{
    public CreateUnitProductValidator(AppDbContext context)
    {
        RuleFor(x => x.SerialNumber)
            .MaximumLength(50).WithMessage("Serial number cannot exceed 50 characters");

        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("Product ID is required")
            .Must(id => context.Products.Any(p => p.Id == id))
            .WithMessage("Product with this ID does not exist");

        RuleFor(x => x.UserId)
            .Must(id => context.Users.Any(u => u.Id == id))
            .WithMessage("User with this ID does not exist");
    }
}