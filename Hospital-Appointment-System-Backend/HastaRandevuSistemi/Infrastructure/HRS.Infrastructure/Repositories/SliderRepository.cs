using HRS.Domain.Entities;
using HRS.Domain.Interfaces;
using HRS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HRS.Infrastructure.Repositories
{
    public class SliderRepository : ISliderRepository
    {
        private readonly SqlDbContext _context;

        public SliderRepository(SqlDbContext context)
        {
            _context = context;
        }

        public async Task<Slider> AddSliderAsync(Slider slider)
        {
            await _context.Sliderler.AddAsync(slider);
            await _context.SaveChangesAsync();
            return slider;
        }

        public async Task<IEnumerable<Slider>> GetAllSliderlerAsync()
        {
            return await _context.Sliderler.ToListAsync();
        }

        public async Task<Slider> GetSliderByIdAsync(int id)
        {
            return await _context.Sliderler.FindAsync(id);
        }

        public async Task<Slider> UpdateSliderAsync(Slider slider)
        {
            var existingSlider = await _context.Sliderler.FindAsync(slider.ID);
            if (existingSlider == null) return null;

            existingSlider.SlideBaslik = slider.SlideBaslik;
            existingSlider.Resim = slider.Resim;

            _context.Sliderler.Update(existingSlider);
            await _context.SaveChangesAsync();
            return existingSlider;
        }

        public async Task<bool> DeleteSliderAsync(int id)
        {
            var slider = await _context.Sliderler.FindAsync(id);
            if (slider == null) return false;

            _context.Sliderler.Remove(slider);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
