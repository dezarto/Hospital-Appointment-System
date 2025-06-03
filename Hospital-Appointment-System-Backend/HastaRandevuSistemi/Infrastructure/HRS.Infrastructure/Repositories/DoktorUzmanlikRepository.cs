using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Domain.Services
{
    public class DoktorUzmanlikRepository : IDoktorUzmanlikRepository
    {
        private readonly SqlDbContext _context;

        public DoktorUzmanlikRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<DoktorUzmanlik> AddDoktorUzmanlikAsync(DoktorUzmanlik doktorUzmanlik)
        {
            await _context.DoktorUzmanliklar.AddAsync(doktorUzmanlik);
            await _context.SaveChangesAsync();
            return doktorUzmanlik;
        }

        public async Task<IEnumerable<DoktorUzmanlik>> GetAllDoktorUzmanlikAsync()
        {
            return await _context.DoktorUzmanliklar.ToListAsync();
        }

        public async Task<DoktorUzmanlik> GetDoktorUzmanlikByIdAsync(int id)
        {
            return await _context.DoktorUzmanliklar.FindAsync(id);
        }

        public async Task<DoktorUzmanlik> UpdateDoktorUzmanlikAsync(DoktorUzmanlik doktorUzmanlik)
        {
            var existingDoktorUzmanlik = await _context.DoktorUzmanliklar.FindAsync(doktorUzmanlik.UzmanlikID);
            if (existingDoktorUzmanlik == null) return null;

            existingDoktorUzmanlik.UzmanlikAdi = existingDoktorUzmanlik.UzmanlikAdi;

            _context.DoktorUzmanliklar.Update(existingDoktorUzmanlik);
            await _context.SaveChangesAsync();
            return existingDoktorUzmanlik;
        }

        public async Task<bool> DeleteDoktorUzmanlikAsync(int id)
        {
            var doktorUzmanlik = await _context.DoktorUzmanliklar.FindAsync(id);
            if (doktorUzmanlik == null) return false;

            _context.DoktorUzmanliklar.Remove(doktorUzmanlik);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
