using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IIlIlceRepository
    {
        Task<IEnumerable<IlIlce>> GetAllAsync();
        Task AddAsync(IlIlce ilIlce);
        Task UpdateAsync(IlIlce ilIlce);
        Task DeleteByIlceIdAsync(int ilceId);
    }
}
