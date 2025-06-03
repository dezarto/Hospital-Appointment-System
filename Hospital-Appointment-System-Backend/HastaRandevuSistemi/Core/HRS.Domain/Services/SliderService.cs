using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class SliderService : ISliderService
    {
        private readonly ISliderRepository _repository;

        public SliderService(ISliderRepository repository)
        {
            _repository = repository;
        }

        public async Task<Slider> AddSliderAsync(Slider slider)
        {
            return await _repository.AddSliderAsync(slider);
        }

        public async Task<bool> DeleteSliderAsync(int id)
        {
            return await _repository.DeleteSliderAsync(id);
        }

        public async Task<IEnumerable<Slider>> GetAllSliderlerAsync()
        {
            return await _repository.GetAllSliderlerAsync();
        }

        public async Task<Slider> GetSliderByIdAsync(int id)
        {
            return await _repository.GetSliderByIdAsync(id);
        }

        public async Task<Slider> UpdateSliderAsync(Slider slider)
        {
            return await _repository.UpdateSliderAsync(slider);
        }
    }
}
