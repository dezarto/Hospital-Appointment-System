using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class HastaneSliderRepository : IHastaneSliderRepository
    {
        private readonly SqlDbContext _context;

        public HastaneSliderRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HastaneSlider>> GetSliderlerByHastaneIdAsync(int hastaneId)
        {
            return await _context.HastaneSliderler.Where(d => d.Hastane_ID == hastaneId).ToListAsync();
        }

        public async Task<bool> AddHastaneSliderAsync(HastaneSlider hastaneSlider)
        {
            await _context.HastaneSliderler.AddAsync(hastaneSlider);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteHastaneSliderAsync(int hastaneId, int sliderId)
        {
            var entity = await _context.HastaneSliderler.FirstOrDefaultAsync(d => d.Hastane_ID == hastaneId && d.Slider_ID == sliderId);
            if (entity == null) return false;

            _context.HastaneSliderler.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
