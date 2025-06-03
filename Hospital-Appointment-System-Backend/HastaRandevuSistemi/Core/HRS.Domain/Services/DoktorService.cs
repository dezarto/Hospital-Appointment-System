using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class DoktorService : IDoktorService
    {
        private readonly IDoktorRepository _repository;

        public DoktorService(IDoktorRepository repository)
        {
            _repository = repository;
        }

        public async Task<Doktor> AddDoktorAsync(Doktor doktor)
        {
            return await _repository.AddDoktorAsync(doktor);
        }

        public async Task<bool> DeleteDoktorAsync(string doktorTC)
        {
            return await _repository.DeleteDoktorAsync(doktorTC);
        }

        public async Task<List<Doktor>> GetAllDoktorlarAsync()
        {
            return await _repository.GetAllDoktorlarAsync();
        }

        public async Task<Doktor> GetDoktorByTCAsync(string doktorTC)
        {
            return await _repository.GetDoktorByTCAsync(doktorTC);
        }

        public async Task<Doktor> UpdateDoktorAsync(Doktor doktor)
        {
            return await _repository.UpdateDoktorAsync(doktor);
        }
    }
}
