using HRS.Application.DTOs;
using HRS.Domain.Entities;

namespace HRS.Application.Interfaces
{
    public interface IUnAuthService
    {
        Task<List<IlveIlceV>> GetAllIlandIlceAsync();
        Task<IEnumerable<Hastane>> GetAllHastaneAsync();
        Task<AllHastaneInformation> GetByHastaneIdAllInformationAsync(int hastaneId);
        Task<AllSlidersAndEtkinlikAndDuyuruAndHaber> GetAllSlidersAndEtkinlikAndDuyuruAndHaberByHastaneId(int hastaneId);
        Task<List<DoktorDTO>> GetDoktorsByHastaneID(int hastaneId);
        Task<List<HRS.Application.DTOs.DoktorUzmanlik>> GetDoktorUzmanliklar();
    }
}
