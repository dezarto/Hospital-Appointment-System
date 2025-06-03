using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class DoktorMesaiService : IDoktorMesaiService
    {
        private readonly IDoktorMesaiRepository _repository;

        public DoktorMesaiService(IDoktorMesaiRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> AddDoktorMesaiAsync(DoktorMesai doktorMesai)
        {
            return await _repository.AddDoktorMesaiAsync(doktorMesai);
        }

        public async Task<bool> DeleteDoktorMesaiAsync(string doktorTC, int mesaiId)
        {
            return await _repository.DeleteDoktorMesaiAsync(doktorTC, mesaiId);
        }

        public async Task<IEnumerable<DoktorMesai>> GetMesailerByDoktorIdAsync(string doktorTC)
        {
            return await _repository.GetMesailerByDoktorIdAsync(doktorTC);
        }
    }
}
