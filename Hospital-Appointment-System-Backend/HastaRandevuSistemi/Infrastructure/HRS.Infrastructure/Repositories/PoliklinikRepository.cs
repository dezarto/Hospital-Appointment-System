using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class PoliklinikRepository : IPoliklinikRepository
    {
        private readonly SqlDbContext _context;

        public PoliklinikRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<Poliklinik> AddPoliklinikAsync(Poliklinik poliklinik)
        {
            await _context.Poliklinikler.AddAsync(poliklinik);
            await _context.SaveChangesAsync();
            return poliklinik;
        }

        public async Task<IEnumerable<Poliklinik>> GetAllPolikliniklerAsync()
        {
            return await _context.Poliklinikler.ToListAsync();
        }

        public async Task<Poliklinik> GetPoliklinikByIdAsync(int id)
        {
            return await _context.Poliklinikler.FindAsync(id);
        }

        public async Task<Poliklinik> UpdatePoliklinikAsync(Poliklinik poliklinik)
        {
            var existingPoliklinik = await _context.Poliklinikler.FindAsync(poliklinik.PoliklinikID);
            if (existingPoliklinik == null) return null;

            existingPoliklinik.PoliklinikAdi = poliklinik.PoliklinikAdi;

            _context.Poliklinikler.Update(existingPoliklinik);
            await _context.SaveChangesAsync();
            return existingPoliklinik;
        }

        public async Task<bool> DeletePoliklinikAsync(int id)
        {
            var poliklinik = await _context.Poliklinikler.FindAsync(id);
            if (poliklinik == null) return false;

            _context.Poliklinikler.Remove(poliklinik);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
