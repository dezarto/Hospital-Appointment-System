using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class HastaneBolumService : IHastaneBolumService
    {
        private readonly IHastaneBolumRepository _repository;

        public HastaneBolumService(IHastaneBolumRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<HastaneBolum>> GetBolumlerByHastaneIdAsync(int hastaneId)
        {
            return await _repository.GetBolumlerByHastaneIdAsync(hastaneId);
        }

        public async Task<bool> AddHastaneBolumAsync(HastaneBolum hastaneBolum)
        {
            return await _repository.AddHastaneBolumAsync(hastaneBolum);
        }

        public async Task<bool> DeleteHastaneBolumAsync(int hastaneId, int bolumId)
        {
            return await _repository.DeleteHastaneBolumAsync(hastaneId, bolumId);
        }

        public async Task<IEnumerable<HastaneBolum>> GetAllBolumlerAsync()
        {
            return await _repository.GetAllBolumlerAsync();
        }
    }
}
