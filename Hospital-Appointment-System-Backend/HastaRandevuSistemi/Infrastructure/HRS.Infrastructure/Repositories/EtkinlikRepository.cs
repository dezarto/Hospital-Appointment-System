using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class EtkinlikRepository : IEtkinlikRepository
    {
        private readonly SqlDbContext _context;

        public EtkinlikRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<Etkinlik> AddEtkinlikAsync(Etkinlik etkinlik)
        {
            await _context.Etkinlikler.AddAsync(etkinlik);
            await _context.SaveChangesAsync();
            return etkinlik;
        }

        public async Task<IEnumerable<Etkinlik>> GetAllEtkinliklerAsync()
        {
            return await _context.Etkinlikler.ToListAsync();
        }

        public async Task<Etkinlik> GetEtkinlikByIdAsync(int id)
        {
            return await _context.Etkinlikler.FindAsync(id);
        }

        public async Task<Etkinlik> UpdateEtkinlikAsync(Etkinlik etkinlik)
        {
            var existingEtkinlik = await _context.Etkinlikler.FindAsync(etkinlik.ID);
            if (existingEtkinlik == null) return null;

            existingEtkinlik.Baslik = etkinlik.Baslik;
            existingEtkinlik.Icerik = etkinlik.Icerik;
            existingEtkinlik.Tarih = etkinlik.Tarih;
            existingEtkinlik.Resim = etkinlik.Resim;

            _context.Etkinlikler.Update(existingEtkinlik);
            await _context.SaveChangesAsync();
            return existingEtkinlik;
        }

        public async Task<bool> DeleteEtkinlikAsync(int id)
        {
            var etkinlik = await _context.Etkinlikler.FindAsync(id);
            if (etkinlik == null) return false;

            _context.Etkinlikler.Remove(etkinlik);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
