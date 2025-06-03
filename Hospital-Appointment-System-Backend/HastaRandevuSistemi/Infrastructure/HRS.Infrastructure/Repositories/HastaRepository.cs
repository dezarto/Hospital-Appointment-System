using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class HastaRepository : IHastaRepository
    {
        private readonly SqlDbContext _context;

        public HastaRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Hasta>> GetAllAsync()
        {
            return await _context.Hastalar.ToListAsync();
        }

        public async Task<Hasta> GetByTCAsync(string tcNo)
        {
            return await _context.Hastalar.FirstOrDefaultAsync(h => h.Hasta_TC == tcNo);
        }

        public async Task AddAsync(Hasta hasta)
        {
            await _context.Hastalar.AddAsync(hasta);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Hasta hasta)
        {
            // Mevcut hastayı veritabanından al
            var existingHasta = await _context.Hastalar
                                              .FirstOrDefaultAsync(h => h.Hasta_TC == hasta.Hasta_TC);

            // Eğer mevcut hasta varsa, izlemeyi durdur
            if (existingHasta != null)
            {
                _context.Entry(existingHasta).State = EntityState.Detached;
            }

            // Yeni hasta ile güncelleme yap
            _context.Hastalar.Update(hasta);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(string hastaTC)
        {
            var hasta = await _context.Hastalar.FindAsync(hastaTC.Trim());
            if (hasta != null)
            {
                _context.Hastalar.Remove(hasta);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> CheckIfHastaExistsAsync(string tcNo)
        {
            return await _context.Hastalar.AnyAsync(h => h.Hasta_TC == tcNo);
        }
    }
}
