using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using HRS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRS.Infrastructure.Repositories
{
    public class HaberRepository : IHaberRepository
    {
        private readonly SqlDbContext _context;

        public HaberRepository(SqlDbContext context)
        {
            _context = context;
        }

        // CREATE: Yeni haber ekler
        public async Task<Haber> AddHaberAsync(Haber haber)
        {
            await _context.Haberler.AddAsync(haber);
            await _context.SaveChangesAsync();
            return haber; // Eklenen haberi geri döndürür
        }

        // READ: Tüm haberleri getirir
        public async Task<IEnumerable<Haber>> GetAllHabersAsync()
        {
            return await _context.Haberler.ToListAsync();
        }

        // READ: ID'ye göre haber getirir
        public async Task<Haber> GetHaberByIdAsync(int id)
        {
            return await _context.Haberler.FindAsync(id);
        }

        // UPDATE: Mevcut bir haberi günceller
        public async Task<Haber> UpdateHaberAsync(Haber haber)
        {
            var existingHaber = await _context.Haberler.FindAsync(haber.ID);
            if (existingHaber == null) return null;

            // Mevcut haberin özelliklerini günceller
            existingHaber.Baslik = haber.Baslik;
            existingHaber.Icerik = haber.Icerik;
            existingHaber.Tarih = haber.Tarih;
            existingHaber.Resim = haber.Resim;

            _context.Haberler.Update(existingHaber);
            await _context.SaveChangesAsync();
            return existingHaber;
        }

        // DELETE: Haber siler
        public async Task<bool> DeleteHaberAsync(int id)
        {
            var haber = await _context.Haberler.FindAsync(id);
            if (haber == null) return false;

            _context.Haberler.Remove(haber);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
