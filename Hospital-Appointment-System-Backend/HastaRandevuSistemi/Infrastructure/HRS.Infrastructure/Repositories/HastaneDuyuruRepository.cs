using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class HastaneDuyuruRepository : IHastaneDuyuruRepository
    {
        private readonly SqlDbContext _context;

        public HastaneDuyuruRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HastaneDuyuru>> GetDuyurularByHastaneIdAsync(int hastaneId)
        {
            return await _context.HastaneDuyurular.Where(d => d.Hastane_ID == hastaneId).ToListAsync();
        }

        public async Task<bool> AddHastaneDuyuruAsync(HastaneDuyuru hastaneDuyuru)
        {
            await _context.HastaneDuyurular.AddAsync(hastaneDuyuru);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteHastaneDuyuruAsync(int hastaneId, int duyuruId)
        {
            var entity = await _context.HastaneDuyurular.FirstOrDefaultAsync(d => d.Hastane_ID == hastaneId && d.ID_Duyuru == duyuruId);
            if (entity == null) return false;

            _context.HastaneDuyurular.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
