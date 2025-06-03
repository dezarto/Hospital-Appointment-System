using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IHastaneEtkinlikService
    {
        Task<IEnumerable<HastaneEtkinlik>> GetEtkinliklerByHastaneIdAsync(int hastaneId);
        Task<bool> AddHastaneEtkinlikAsync(HastaneEtkinlik hastaneEtkinlik);
        Task<bool> DeleteHastaneEtkinlikAsync(int hastaneId, int etkinlikId);
    }
}
