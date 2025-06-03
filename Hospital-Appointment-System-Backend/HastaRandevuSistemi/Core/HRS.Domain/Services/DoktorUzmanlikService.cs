using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class DoktorUzmanlikService : IDoktorUzmanlikService
    {
        private readonly IDoktorUzmanlikRepository _repository;

        public DoktorUzmanlikService(IDoktorUzmanlikRepository repository)
        {
            _repository = repository;
        }

        public async Task<DoktorUzmanlik> AddDoktorUzmanlikAsync(DoktorUzmanlik doktorUzmanlik)
        {
            return await _repository.AddDoktorUzmanlikAsync(doktorUzmanlik);
        }

        public async Task<bool> DeleteDoktorUzmanlikAsync(int id)
        {
            return await _repository.DeleteDoktorUzmanlikAsync(id);
        }

        public async Task<IEnumerable<DoktorUzmanlik>> GetAllDoktorUzmanlikAsync()
        {
            return await _repository.GetAllDoktorUzmanlikAsync();
        }

        public async Task<DoktorUzmanlik> GetDoktorUzmanlikByIdAsync(int id)
        {
            return await _repository.GetDoktorUzmanlikByIdAsync(id);
        }

        public async Task<DoktorUzmanlik> UpdateDoktorUzmanlikAsync(DoktorUzmanlik doktorUzmanlik)
        {
            return await _repository.UpdateDoktorUzmanlikAsync(doktorUzmanlik);
        }
    }
}
