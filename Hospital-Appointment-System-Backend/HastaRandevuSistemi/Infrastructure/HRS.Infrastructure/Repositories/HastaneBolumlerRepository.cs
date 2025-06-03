using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class HastaneBolumRepository : IHastaneBolumRepository
    {
        private readonly SqlDbContext _context;

        public HastaneBolumRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HastaneBolum>> GetBolumlerByHastaneIdAsync(int hastaneId)
        {
            return await _context.HastaneBolumler.Where(e => e.Hastane_ID == hastaneId).ToListAsync();
        }

        public async Task<bool> AddHastaneBolumAsync(HastaneBolum hastaneBolum)
        {
            await _context.HastaneBolumler.AddAsync(hastaneBolum);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteHastaneBolumAsync(int hastaneId, int bolumId)
        {
            var entity = await _context.HastaneBolumler.FirstOrDefaultAsync(e => e.Hastane_ID == hastaneId && e.Bolum_ID == bolumId);
            if (entity == null) return false;

            _context.HastaneBolumler.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<HastaneBolum>> GetAllBolumlerAsync()
        {
            return await _context.HastaneBolumler.ToListAsync();
        }
    }
}
