using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IPoliklinikService
    {
        Task<Poliklinik> AddPoliklinikAsync(Poliklinik poliklinik);
        Task<IEnumerable<Poliklinik>> GetAllPolikliniklerAsync();
        Task<Poliklinik> GetPoliklinikByIdAsync(int id);
        Task<Poliklinik> UpdatePoliklinikAsync(Poliklinik poliklinik);
        Task<bool> DeletePoliklinikAsync(int id);
    }
}
