using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class DoktorMesaiRepository : IDoktorMesaiRepository
    {
        private readonly SqlDbContext _context;

        public DoktorMesaiRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DoktorMesai>> GetMesailerByDoktorIdAsync(string doktorTC)
        {
            return await _context.DoktorMesailer.Where(d => d.Doktor_TC == doktorTC).ToListAsync();
        }

        public async Task<bool> AddDoktorMesaiAsync(DoktorMesai doktorMesai)
        {
            await _context.DoktorMesailer.AddAsync(doktorMesai);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDoktorMesaiAsync(string doktorTC, int mesaiId)
        {
            var entity = await _context.DoktorMesailer.FirstOrDefaultAsync(d => d.Doktor_TC == doktorTC && d.MesaiID == mesaiId);
            if (entity == null) return false;

            _context.DoktorMesailer.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
