using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class MesaiRepository : IMesaiRepository
    {
        private readonly SqlDbContext _context;

        public MesaiRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<Mesai> AddMesaiAsync(Mesai mesai)
        {
            await _context.Mesailer.AddAsync(mesai);
            await _context.SaveChangesAsync();
            return mesai;
        }

        public async Task<IEnumerable<Mesai>> GetAllMesailerAsync()
        {
            return await _context.Mesailer.ToListAsync();
        }

        public async Task<Mesai> GetMesaiByIdAsync(int id)
        {
            return await _context.Mesailer.FindAsync(id);
        }

        public async Task<Mesai> UpdateMesaiAsync(Mesai mesai)
        {
            var existingMesai = await _context.Mesailer.FindAsync(mesai.MesaiID);
            if (existingMesai == null) return null;

            existingMesai.BaslangicSaati = mesai.BaslangicSaati;
            existingMesai.BitisSaati = mesai.BitisSaati;
            existingMesai.Tarih = mesai.Tarih;

            _context.Mesailer.Update(existingMesai);
            await _context.SaveChangesAsync();
            return existingMesai;
        }

        public async Task<bool> DeleteMesaiAsync(int id)
        {
            var mesai = await _context.Mesailer.FindAsync(id);
            if (mesai == null) return false;

            _context.Mesailer.Remove(mesai);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
