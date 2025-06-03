using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IBolumPoliklinikRepository
    {
        Task<IEnumerable<BolumPoliklinik>> GetPolikliniklerByBolumIdAsync(int bolumId);
        Task<bool> AddBolumPoliklinikAsync(BolumPoliklinik bolumPoliklinik);
        Task<bool> DeleteBolumPoliklinikAsync(int blolumId, int poliklinikId);
        Task<IEnumerable<BolumPoliklinik>> GetAllPolikliniklerAsync();
    }
}
