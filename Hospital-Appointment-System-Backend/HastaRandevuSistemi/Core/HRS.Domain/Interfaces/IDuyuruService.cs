using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IDuyuruService
    {
        Task<Duyuru> AddDuyuruAsync(Duyuru duyuru);
        Task<IEnumerable<Duyuru>> GetAllDuyurularAsync();
        Task<Duyuru> GetDuyuruByIdAsync(int id);
        Task<Duyuru> UpdateDuyuruAsync(Duyuru duyuru);
        Task<bool> DeleteDuyuruAsync(int id);
    }
}
