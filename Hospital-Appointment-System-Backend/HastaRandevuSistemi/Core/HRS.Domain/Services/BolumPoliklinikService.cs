using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class BolumPoliklinikService : IBolumPoliklinikService
    {
        private readonly IBolumPoliklinikRepository _repository;

        public BolumPoliklinikService(IBolumPoliklinikRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AddBolumPoliklinikAsync(BolumPoliklinik bolumPoliklinik)
        {
            return await _repository.AddBolumPoliklinikAsync(bolumPoliklinik);
        }

        public async Task<bool> DeleteBolumPoliklinikAsync(int bolumId, int poliklinikId)
        {
            return await _repository.DeleteBolumPoliklinikAsync(bolumId, poliklinikId);
        }

        public async Task<IEnumerable<BolumPoliklinik>> GetAllPolikliniklerAsync()
        {
            return await _repository.GetAllPolikliniklerAsync();
        }

        public async Task<IEnumerable<BolumPoliklinik>> GetPolikliniklerByBolumIdAsync(int bolumId)
        {
            return await _repository.GetPolikliniklerByBolumIdAsync(bolumId);
        }
    }
}
