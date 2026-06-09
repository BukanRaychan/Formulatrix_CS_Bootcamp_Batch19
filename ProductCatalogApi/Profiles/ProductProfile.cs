using AutoMapper;
using ProductCatalogAPI.DTOs.ProductDtos;
using ProductCatalogAPI.Models;

namespace ProductCatalogAPI.Profiles;

public class ProductProfile : Profile
{
    public ProductProfile()
    {
        CreateMap<Product, ProductResponseDto>();
        CreateMap<CreateProductDto, Product>();
        CreateMap<UpdateProductDto, Product>();
    }
}