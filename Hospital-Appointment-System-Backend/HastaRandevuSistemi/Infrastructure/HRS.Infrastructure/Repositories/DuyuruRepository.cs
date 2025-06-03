using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class DuyuruRepository : IDuyuruRepository
    {
        private readonly SqlDbContext _context;

        public DuyuruRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<Duyuru> AddDuyuruAsync(Duyuru duyuru)
        {
            await _context.Duyurular.AddAsync(duyuru);
            await _context.SaveChangesAsync();
            return duyuru;
        }

        public async Task<IEnumerable<Duyuru>> GetAllDuyurularAsync()
        {
            return await _context.Duyurular.ToListAsync();
        }

        public async Task<Duyuru> GetDuyuruByIdAsync(int id)
        {
            return await _context.Duyurular.FindAsync(id);
        }

        public async Task<Duyuru> UpdateDuyuruAsync(Duyuru duyuru)
        {
            var existingDuyuru = await _context.Duyurular.FindAsync(duyuru.ID);
            if (existingDuyuru == null) return null;

            existingDuyuru.Baslik = duyuru.Baslik;
            existingDuyuru.Icerik = duyuru.Icerik;
            existingDuyuru.Tarih = duyuru.Tarih;
            existingDuyuru.Resim = duyuru.Resim;

            _context.Duyurular.Update(existingDuyuru);
            await _context.SaveChangesAsync();
            return existingDuyuru;
        }

        public async Task<bool> DeleteDuyuruAsync(int id)
        {
            var duyuru = await _context.Duyurular.FindAsync(id);
            if (duyuru == null) return false;

            _context.Duyurular.Remove(duyuru);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
