using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IBolumPoliklinikService
    {
        Task<IEnumerable<BolumPoliklinik>> GetPolikliniklerByBolumIdAsync(int bolumId);
        Task<bool> AddBolumPoliklinikAsync(BolumPoliklinik bolumPoliklinik);
        Task<bool> DeleteBolumPoliklinikAsync(int bolumId, int poliklinikId);
        Task<IEnumerable<BolumPoliklinik>> GetAllPolikliniklerAsync();
    }
}
