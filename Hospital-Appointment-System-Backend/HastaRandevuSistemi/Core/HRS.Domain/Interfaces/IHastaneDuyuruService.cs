using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IHastaneDuyuruService
    {
        Task<IEnumerable<HastaneDuyuru>> GetDuyurularByHastaneIdAsync(int hastaneId);
        Task<bool> AddHastaneDuyuruAsync(HastaneDuyuru hastaneDuyuru);
        Task<bool> DeleteHastaneDuyuruAsync(int hastaneId, int duyuruId);
    }
}
