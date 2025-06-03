using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IHakkimdaHastaneService
    {
        Task<IEnumerable<HakkimdaHastane>> GetAllAsync();
        Task<HakkimdaHastane> GetByHakkimdaHastaneIdAsync(int id);
        Task<int> AddAsync(HakkimdaHastane hakkimdaHastane);
        Task UpdateAsync(HakkimdaHastane hakkimdaHastane);
        Task DeleteAsync(int id);
    }
}
