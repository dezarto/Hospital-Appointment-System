using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class BolumPoliklinikRepository : IBolumPoliklinikRepository
    {
        private readonly SqlDbContext _context;

        public BolumPoliklinikRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BolumPoliklinik>> GetPolikliniklerByBolumIdAsync(int bolumId)
        {
            return await _context.BolumPoliklinikler.Where(e => e.Bolum_ID == bolumId).ToListAsync();
        }

        public async Task<bool> AddBolumPoliklinikAsync(BolumPoliklinik bolumPoliklinik)
        {
            await _context.BolumPoliklinikler.AddAsync(bolumPoliklinik);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteBolumPoliklinikAsync(int bolumId, int poliklinikId)
        {
            var entity = await _context.BolumPoliklinikler.FirstOrDefaultAsync(e => e.Bolum_ID == bolumId && e.Poliklinik_ID == poliklinikId);
            if (entity == null) return false;

            _context.BolumPoliklinikler.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<BolumPoliklinik>> GetAllPolikliniklerAsync()
        {
            return await _context.BolumPoliklinikler.ToListAsync();
        }
    }
}
