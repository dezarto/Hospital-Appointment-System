using System.Linq.Expressions;

namespace HRS.Domain.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<int> AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task<IEnumerable<T>> SearchByColumnAsync(string columnName, object value);
        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
    }
}
