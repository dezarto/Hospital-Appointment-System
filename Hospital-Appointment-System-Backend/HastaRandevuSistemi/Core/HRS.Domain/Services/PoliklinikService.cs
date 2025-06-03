using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class PoliklinikService : IPoliklinikService
    {
        private readonly IPoliklinikRepository _repository;

        public PoliklinikService(IPoliklinikRepository repository)
        {
            _repository = repository;
        }

        public async Task<Poliklinik> AddPoliklinikAsync(Poliklinik poliklinik)
        {
            return await _repository.AddPoliklinikAsync(poliklinik);
        }

        public async Task<bool> DeletePoliklinikAsync(int id)
        {
            return await _repository.DeletePoliklinikAsync(id);
        }

        public async Task<IEnumerable<Poliklinik>> GetAllPolikliniklerAsync()
        {
            return await _repository.GetAllPolikliniklerAsync();
        }

        public async Task<Poliklinik> GetPoliklinikByIdAsync(int id)
        {
            return await _repository.GetPoliklinikByIdAsync(id);
        }

        public async Task<Poliklinik> UpdatePoliklinikAsync(Poliklinik poliklinik)
        {
            return await _repository.UpdatePoliklinikAsync(poliklinik);
        }
    }
}
