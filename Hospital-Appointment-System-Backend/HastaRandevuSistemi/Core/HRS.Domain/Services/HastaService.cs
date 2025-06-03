using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class HastaService : IHastaService
    {
        private readonly IHastaRepository _hastaRepository;

        public HastaService(IHastaRepository hastaRepository)
        {
            _hastaRepository = hastaRepository;
        }

        public async Task AddAsync(Hasta hasta)
        {
            await _hastaRepository.AddAsync(hasta);
        }

        public async Task DeleteAsync(string hastaTC)
        {
            await _hastaRepository.DeleteAsync(hastaTC);
        }

        public async Task<IEnumerable<Hasta>> GetAllAsync()
        {
            return await _hastaRepository.GetAllAsync();
        }

        public async Task<Hasta> GetByHastaIdAsync(string tcNo)
        {
            return await _hastaRepository.GetByTCAsync(tcNo);
        }

        public async Task UpdateAsync(Hasta hasta)
        {
            await _hastaRepository.UpdateAsync(hasta);
        }

        public async Task<bool> CheckIfHastaExistsAsync(string tcNo)
        {
            return await _hastaRepository.CheckIfHastaExistsAsync(tcNo);
        }
    }
}
