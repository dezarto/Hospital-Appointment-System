using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class EtkinlikService : IEtkinlikService
    {
        private readonly IEtkinlikRepository _repository;

        public EtkinlikService(IEtkinlikRepository repository)
        {
            _repository = repository;
        }

        public async Task<Etkinlik> AddEtkinlikAsync(Etkinlik etkinlik)
        {
            return await _repository.AddEtkinlikAsync(etkinlik);
        }

        public async Task<bool> DeleteEtkinlikAsync(int id)
        {
            return await _repository.DeleteEtkinlikAsync(id);
        }

        public async Task<IEnumerable<Etkinlik>> GetAllEtkinliklerAsync()
        {
            return await _repository.GetAllEtkinliklerAsync();
        }

        public async Task<Etkinlik> GetEtkinlikByIdAsync(int id)
        {
            return await _repository.GetEtkinlikByIdAsync(id);
        }

        public async Task<Etkinlik> UpdateEtkinlikAsync(Etkinlik etkinlik)
        {
            return await _repository.UpdateEtkinlikAsync(etkinlik);
        }
    }
}
