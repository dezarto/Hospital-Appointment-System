using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IIlService
    {
        Task<IEnumerable<Il>> GetAllAsync();
        Task<Il> GetByIlIdAsync(int id);
        Task<Il> GetByIlNameAsync(string ilAdi);
        Task<int> AddAsync(Il il);
        Task UpdateAsync(Il il);
        Task DeleteAsync(int id);
    }
}
