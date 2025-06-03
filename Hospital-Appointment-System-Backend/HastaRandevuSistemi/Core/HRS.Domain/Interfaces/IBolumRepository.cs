using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IBolumRepository
    {
        Task<Bolum> AddBolumAsync(Bolum bolum);
        Task<Bolum> GetBolumByIdAsync(int id);
        Task<Bolum> UpdateBolumAsync(Bolum bolum);
        Task<bool> DeleteBolumAsync(int id);
    }
}
