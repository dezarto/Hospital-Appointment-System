using System.Linq.Expressions;
using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IIlceService
    {
        Task<IEnumerable<Ilce>> GetAllAsync();
        Task<Ilce> GetByIlceIdAsync(int id);
        Task<Ilce> GetByIlceNameAsync(string ilceAdi);
        Task<int> AddAsync(Ilce ilce);
        Task UpdateAsync(Ilce ilce);
        Task DeleteAsync(int id);
        
    }
}
