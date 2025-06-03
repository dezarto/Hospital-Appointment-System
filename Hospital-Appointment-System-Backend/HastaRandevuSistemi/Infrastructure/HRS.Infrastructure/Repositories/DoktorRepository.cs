using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class DoktorRepository : IDoktorRepository
    {
        private readonly SqlDbContext _context;

        public DoktorRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<Doktor> AddDoktorAsync(Doktor doktor)
        {
            await _context.Doktorlar.AddAsync(doktor);
            await _context.SaveChangesAsync();
            return doktor;
        }

        public async Task<bool> DeleteDoktorAsync(string doktorTC)
        {
            var doktor = await _context.Doktorlar.FindAsync(doktorTC);
            if (doktor == null) return false;

            _context.Doktorlar.Remove(doktor);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Doktor>> GetAllDoktorlarAsync()
        {
            return await _context.Doktorlar.ToListAsync();
        }

        public async Task<Doktor> GetDoktorByTCAsync(string doktorTC)
        {
            return await _context.Doktorlar.FindAsync(doktorTC);
        }

        public async Task<Doktor> UpdateDoktorAsync(Doktor doktor)
        {
            var existingDoktor = await _context.Doktorlar.FindAsync(doktor.Doktor_TC);
            if (existingDoktor == null) return null;

            existingDoktor.Cinsiyet = doktor.Cinsiyet;
            existingDoktor.Isim = doktor.Isim;
            existingDoktor.Soyisim = doktor.Soyisim;
            existingDoktor.Sifre = doktor.Sifre;

            _context.Doktorlar.Update(existingDoktor);
            await _context.SaveChangesAsync();
            return existingDoktor;
        }
    }
}
