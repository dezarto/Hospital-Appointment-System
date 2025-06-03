using System.Linq.Expressions;
using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IIlIlceService
    {
        Task<IEnumerable<IlIlce>> GetAllAsync();
        Task<int> AddAsync(IlIlce ilIlce);
        Task<bool> AnyAsync(Expression<Func<IlIlce, bool>> predicate);

        Task<IEnumerable<IlIlce>> CustomGetAllAsync();
        Task CustomAddAsync(IlIlce ilIlce);
        Task CustomUpdateAsync(IlIlce ilIlce);
        Task<bool> CustomDeleteByIlceIdAsync(int ilceId);
    }
}
