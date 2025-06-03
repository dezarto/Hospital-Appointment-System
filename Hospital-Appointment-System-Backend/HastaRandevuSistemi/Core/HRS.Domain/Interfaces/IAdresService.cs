using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IAdresService
    {
        Task<IEnumerable<Adres>> GetAllAsync();
        Task<Adres> GetByAdressIdAsync(int id);
        Task<int> AddAsync(Adres adres);
        Task UpdateAsync(Adres adres);
        Task DeleteAsync(int id);
    }
}
