using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IHastaneService
    {
        Task<IEnumerable<Hastane>> GetAllAsync();
        Task<Hastane> GetByHastaneNameAsync(string hastaneAdı);
        Task<Hastane> GetByHastaneIdAsync(int id);
        Task<int> AddAsync(Hastane hastane);
        Task UpdateAsync(Hastane hastane);
        Task DeleteAsync(int id);
    }
}
