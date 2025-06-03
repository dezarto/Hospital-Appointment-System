using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IHastaService
    {
        Task<IEnumerable<Hasta>> GetAllAsync();
        Task<Hasta> GetByHastaIdAsync(string hastaTC);
        Task AddAsync(Hasta hasta);
        Task UpdateAsync(Hasta hasta);
        Task DeleteAsync(string hastaTC);
        Task<bool> CheckIfHastaExistsAsync(string tcNo);
    }
}
