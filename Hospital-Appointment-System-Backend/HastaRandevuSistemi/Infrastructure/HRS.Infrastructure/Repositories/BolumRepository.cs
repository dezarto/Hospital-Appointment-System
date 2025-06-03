using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;

namespace HRS.Infrastructure.Repositories
{
    public class BolumRepository : IBolumRepository
    {
        private readonly SqlDbContext _context;

        public BolumRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<Bolum> AddBolumAsync(Bolum bolum)
        {
            await _context.Bolumler.AddAsync(bolum);
            await _context.SaveChangesAsync();
            return bolum;
        }

        public async Task<bool> DeleteBolumAsync(int id)
        {
            var bolum = await _context.Bolumler.FindAsync(id);
            if (bolum == null) return false;

            _context.Bolumler.Remove(bolum);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Bolum> GetBolumByIdAsync(int id)
        {
            return await _context.Bolumler.FindAsync(id);
        }

        public async Task<Bolum> UpdateBolumAsync(Bolum bolum)
        {
            var existingBolum = await _context.Bolumler.FindAsync(bolum.BolumID);
            if (existingBolum == null) return null;

            existingBolum.BolumAdi = bolum.BolumAdi;
            existingBolum.BolumAciklama = bolum.BolumAciklama;

            _context.Bolumler.Update(existingBolum);
            await _context.SaveChangesAsync();
            return existingBolum;
        }
    }
}
