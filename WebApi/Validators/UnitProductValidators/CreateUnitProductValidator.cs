using FluentValidation;
using ProductCatalogAPI.DTOs.UnitProductDtos;

namespace ProductCatalogAPI.Validators.UnitProductValidators;

public class CreateUnitProductValidator : AbstractValidator<CreateUnitProductDto>
{
    public CreateUnitProductValidator()
    {
        RuleFor(x => x.SerialNumber)
            .MaximumLength(50).WithMessage("Serial number cannot exceed 50 characters");

        RuleFor(x => x.ProductId)
            .GreaterThan(0).WithMessage("Product ID must be greater than 0");

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");
    }
}   