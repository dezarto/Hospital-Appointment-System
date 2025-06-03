using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IRandevuRepository
    {
        Task<Randevu> AddRandevuAsync(Randevu randevu);
        Task<IEnumerable<Randevu>> GetAllRandevularAsync();
        Task<Randevu> GetRandevuByIdAsync(int id);
        Task<Randevu> UpdateRandevuAsync(Randevu randevu);
        Task<bool> DeleteRandevuAsync(int id);
    }
}
