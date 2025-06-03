using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class HaberService : IHaberService
    {
        private readonly IHaberRepository _repository;

        public HaberService(IHaberRepository repository)
        {
            _repository = repository;
        }

        public async Task<Haber> AddHaberAsync(Haber haber)
        {
            return await _repository.AddHaberAsync(haber);
        }

        public async Task<bool> DeleteHaberAsync(int id)
        {
            return await _repository.DeleteHaberAsync(id);
        }

        public async Task<IEnumerable<Haber>> GetAllHabersAsync()
        {
            return await _repository.GetAllHabersAsync();
        }

        public async Task<Haber> GetHaberByIdAsync(int id)
        {
            return await _repository.GetHaberByIdAsync(id);
        }

        public async Task<Haber> UpdateHaberAsync(Haber haber)
        {
            return await _repository.UpdateHaberAsync(haber);
        }
    }
}
