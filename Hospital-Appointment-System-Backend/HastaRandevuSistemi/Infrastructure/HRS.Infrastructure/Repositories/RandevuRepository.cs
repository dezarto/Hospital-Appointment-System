using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class RandevuRepository : IRandevuRepository
    {
        private readonly SqlDbContext _context;

        public RandevuRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<Randevu> AddRandevuAsync(Randevu randevu)
        {
            await _context.Randevular.AddAsync(randevu);
            await _context.SaveChangesAsync();
            return randevu;
        }

        public async Task<IEnumerable<Randevu>> GetAllRandevularAsync()
        {
            return await _context.Randevular.ToListAsync();
        }

        public async Task<Randevu> GetRandevuByIdAsync(int id)
        {
            return await _context.Randevular.FindAsync(id);
        }

        public async Task<Randevu> UpdateRandevuAsync(Randevu randevu)
        {
            var existingRandevu = await _context.Randevular.FindAsync(randevu.RandevuID);
            if (existingRandevu == null) return null;

            existingRandevu.RandevuTarihi = randevu.RandevuTarihi;
            existingRandevu.BaslangıcSaati = randevu.BaslangıcSaati;
            existingRandevu.BitisSaati = randevu.BitisSaati;

            _context.Randevular.Update(existingRandevu);
            await _context.SaveChangesAsync();
            return existingRandevu;
        }

        public async Task<bool> DeleteRandevuAsync(int id)
        {
            var Randevu = await _context.Randevular.FindAsync(id);
            if (Randevu == null) return false;

            _context.Randevular.Remove(Randevu);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
