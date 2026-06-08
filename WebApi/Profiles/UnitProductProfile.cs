using AutoMapper;
using ProductCatalogAPI.DTOs.UnitProductDtos;
using ProductCatalogAPI.Models;

namespace ProductCatalogAPI.Profiles;

public class UnitProductProfile : Profile
{
    public UnitProductProfile()
    {
        CreateMap<UnitProduct, UnitProductResponseDto>();
        CreateMap<CreateUnitProductDto, UnitProduct>();
    }
}