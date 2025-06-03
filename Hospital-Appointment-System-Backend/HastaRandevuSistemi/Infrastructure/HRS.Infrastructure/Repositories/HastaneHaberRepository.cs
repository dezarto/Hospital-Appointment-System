using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class HastaneHaberRepository : IHastaneHaberRepository
    {
        private readonly SqlDbContext _context;

        public HastaneHaberRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HastaneHaber>> GetHaberlerByHastaneIdAsync(int hastaneId)
        {
            return await _context.HastaneHaberler.Where(h => h.Hastane_ID == hastaneId).ToListAsync();
        }

        public async Task<bool> AddHastaneHaberAsync(HastaneHaber hastaneHaber)
        {
            await _context.HastaneHaberler.AddAsync(hastaneHaber);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteHastaneHaberAsync(int hastaneId, int haberId)
        {
            var entity = await _context.HastaneHaberler.FirstOrDefaultAsync(h => h.Hastane_ID == hastaneId && h.Haber_ID == haberId);
            if (entity == null) return false;

            _context.HastaneHaberler.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
