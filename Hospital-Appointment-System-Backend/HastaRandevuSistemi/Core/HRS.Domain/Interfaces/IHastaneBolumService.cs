using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IHastaneBolumService
    {
        Task<IEnumerable<HastaneBolum>> GetBolumlerByHastaneIdAsync(int hastaneId);
        Task<bool> AddHastaneBolumAsync(HastaneBolum hastaneBolum);
        Task<bool> DeleteHastaneBolumAsync(int hastaneId, int bolumId);
        Task<IEnumerable<HastaneBolum>> GetAllBolumlerAsync();
    }
}
