using AutoMapper;
using HRS.Application.DTOs;
using HRS.Domain.Entities;

namespace HRS.API.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Hasta, HastaDTO>().ReverseMap();
            CreateMap<Iletisim, IletisimDTO>().ReverseMap();
            CreateMap<Adres, AdresDTO>().ReverseMap();
            CreateMap<Hastane, HastaneDTO>().ReverseMap();
            CreateMap<HakkimdaHastane, HakkimdaHastaneDTO>().ReverseMap();
            CreateMap<Duyuru, DuyuruDTO>().ReverseMap();
            CreateMap<Haber, HaberDTO>().ReverseMap();
            CreateMap<Etkinlik, EtkinlikDTO>().ReverseMap();
            CreateMap<HRS.Domain.Entities.Bolum, BolumDTO>().ReverseMap();
            CreateMap<HRS.Domain.Entities.Poliklinik, PoliklinikDTO>().ReverseMap();
            CreateMap<HRS.Domain.Entities.Doktor, DoktorDTO>().ReverseMap();
            CreateMap<Mesai, MesaiDTO>().ReverseMap();
            CreateMap<HRS.Domain.Entities.DoktorMesai, Application.DTOs.DoktorMesai>().ReverseMap();
            CreateMap<HRS.Domain.Entities.Randevu, RandevuDTO>().ReverseMap();
        }
    }
}
