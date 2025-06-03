using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IMesaiRepository
    {
        Task<Mesai> AddMesaiAsync(Mesai mesai);
        Task<IEnumerable<Mesai>> GetAllMesailerAsync();
        Task<Mesai> GetMesaiByIdAsync(int id);
        Task<Mesai> UpdateMesaiAsync(Mesai mesai);
        Task<bool> DeleteMesaiAsync(int id);
    }
}
