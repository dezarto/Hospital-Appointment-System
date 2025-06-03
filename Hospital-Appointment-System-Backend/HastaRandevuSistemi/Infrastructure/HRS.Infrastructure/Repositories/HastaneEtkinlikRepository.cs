using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class HastaneEtkinlikRepository : IHastaneEtkinlikRepository
    {
        private readonly SqlDbContext _context;

        public HastaneEtkinlikRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HastaneEtkinlik>> GetEtkinliklerByHastaneIdAsync(int hastaneId)
        {
            return await _context.HastaneEtkinlikler.Where(e => e.Hastane_ID == hastaneId).ToListAsync();
        }

        public async Task<bool> AddHastaneEtkinlikAsync(HastaneEtkinlik hastaneEtkinlik)
        {
            await _context.HastaneEtkinlikler.AddAsync(hastaneEtkinlik);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteHastaneEtkinlikAsync(int hastaneId, int etkinlikId)
        {
            var entity = await _context.HastaneEtkinlikler.FirstOrDefaultAsync(e => e.Hastane_ID == hastaneId && e.Etkinlik_ID == etkinlikId);
            if (entity == null) return false;

            _context.HastaneEtkinlikler.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
