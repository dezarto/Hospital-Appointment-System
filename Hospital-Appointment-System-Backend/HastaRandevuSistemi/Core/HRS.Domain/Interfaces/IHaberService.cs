using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IHaberService
    {
        // Haber ekleme
        Task<Haber> AddHaberAsync(Haber haber);

        // Tüm haberleri getirme
        Task<IEnumerable<Haber>> GetAllHabersAsync();

        // ID'ye göre haber getirme
        Task<Haber> GetHaberByIdAsync(int id);

        // Haber güncelleme
        Task<Haber> UpdateHaberAsync(Haber haber);

        // Haber silme
        Task<bool> DeleteHaberAsync(int id);
    }
}
