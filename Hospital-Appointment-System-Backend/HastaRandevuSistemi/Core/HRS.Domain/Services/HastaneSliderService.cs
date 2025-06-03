using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class HastaneSliderService : IHastaneSliderService
    {
        private readonly IHastaneSliderRepository _sliderRepository;

        public HastaneSliderService(IHastaneSliderRepository sliderRepository)
        {
            _sliderRepository = sliderRepository;
        }

        public async Task<IEnumerable<HastaneSlider>> GetSliderlerByHastaneIdAsync(int hastaneId)
        {
            return await _sliderRepository.GetSliderlerByHastaneIdAsync(hastaneId);
        }

        public async Task<bool> AddHastaneSliderAsync(HastaneSlider hastaneSlider)
        {
            return await _sliderRepository.AddHastaneSliderAsync(hastaneSlider);
        }

        public async Task<bool> DeleteHastaneSliderAsync(int hastaneId, int sliderId)
        {
            return await _sliderRepository.DeleteHastaneSliderAsync(hastaneId, sliderId);
        }
    }
}
