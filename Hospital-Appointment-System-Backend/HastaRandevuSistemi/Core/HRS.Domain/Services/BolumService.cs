using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class BolumService : IBolumService
    {
        private readonly IBolumRepository _repository;

        public BolumService(IBolumRepository repository)
        {
            _repository = repository;
        }

        public async Task<Bolum> AddBolumAsync(Bolum bolum)
        {
            return await _repository.AddBolumAsync(bolum);
        }

        public async Task<bool> DeleteBolumAsync(int id)
        {
            return await _repository.DeleteBolumAsync(id);
        }

        public async Task<Bolum> GetBolumByIdAsync(int id)
        {
            return await _repository.GetBolumByIdAsync(id);
        }

        public async Task<Bolum> UpdateBolumAsync(Bolum bolum)
        {
            return await _repository.UpdateBolumAsync(bolum);
        }
    }
}
