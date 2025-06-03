using System.Linq.Expressions;
using HRS.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly DbContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(DbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _dbSet = context.Set<T>();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<int> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            // Entity'nin ID'sini döndürüyoruz (varsayalım ki ID, int türünde)
            var entityId = (int)typeof(T).GetProperty("ID").GetValue(entity);
            return entityId;
        }

        public async Task UpdateAsync(T entity)
        {
            // Check if the entity is being tracked by the DbContext
            var entityKey = (int)typeof(T).GetProperty("ID").GetValue(entity);
            var existingEntity = _context.Set<T>().Local.FirstOrDefault(e => (int)typeof(T).GetProperty("ID").GetValue(e) == entityKey);

            if (existingEntity != null)
            {
                _context.Entry(existingEntity).State = EntityState.Detached;
            }

            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public async Task<IEnumerable<T>> SearchByColumnAsync(string columnName, object value)
        {
            if (value is not string)
            {
                throw new InvalidOperationException("Search value must be a string.");
            }

            var parameter = Expression.Parameter(typeof(T), "entity");
            var property = Expression.Property(parameter, columnName);

            // Sütunun türünü kontrol et
            if (property.Type == typeof(string))
            {
                // Eğer string türünde ise Contains kullan
                var constant = Expression.Constant(value.ToString(), typeof(string));
                var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                var comparison = Expression.Call(property, containsMethod, constant);

                var lambda = Expression.Lambda<Func<T, bool>>(comparison, parameter);
                return await _dbSet.Where(lambda).ToListAsync();
            }
            else if (property.Type == typeof(int))
            {
                // Eğer int türünde ise eşitlik kullan (örnek olarak)
                var constant = Expression.Constant(Convert.ToInt32(value), typeof(int));
                var comparison = Expression.Equal(property, constant);

                var lambda = Expression.Lambda<Func<T, bool>>(comparison, parameter);
                return await _dbSet.Where(lambda).ToListAsync();
            }
            else
            {
                throw new InvalidOperationException("Unsupported column type.");
            }
        }

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.AnyAsync(predicate);
        }
    }
}
