using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class IlIlceRepository : IIlIlceRepository
    {
        private readonly SqlDbContext _context;

        public IlIlceRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<IlIlce>> GetAllAsync()
        {
            return await _context.IlIlceler.ToListAsync();
        }

        public async Task AddAsync(IlIlce ilIlce)
        {
            await _context.IlIlceler.AddAsync(ilIlce);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(IlIlce ilIlce)
        {
            _context.IlIlceler.Update(ilIlce);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteByIlceIdAsync(int ilceId)
        {
            var ilIlce = await _context.IlIlceler
                .FirstOrDefaultAsync(i => i.Ilce_ID == ilceId);

            if (ilIlce != null)
            {
                _context.IlIlceler.Remove(ilIlce);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new KeyNotFoundException("İlçe bulunamadı.");
            }
        }
    }
}
