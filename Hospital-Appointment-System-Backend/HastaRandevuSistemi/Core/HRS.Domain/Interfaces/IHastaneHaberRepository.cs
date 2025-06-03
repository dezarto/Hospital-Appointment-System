using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IHastaneHaberRepository
    {
        Task<IEnumerable<HastaneHaber>> GetHaberlerByHastaneIdAsync(int hastaneId);
        Task<bool> AddHastaneHaberAsync(HastaneHaber hastaneHaber);
        Task<bool> DeleteHastaneHaberAsync(int hastaneId, int haberId);
    }
}
