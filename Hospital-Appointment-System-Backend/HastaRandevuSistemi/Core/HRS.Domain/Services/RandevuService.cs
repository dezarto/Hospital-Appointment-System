using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class RandevuService : IRandevuService
    {
        private readonly IRandevuRepository _repository;

        public RandevuService(IRandevuRepository repository)
        {
            _repository = repository;
        }

        public async Task<Randevu> AddRandevuAsync(Randevu randevu)
        {
            return await _repository.AddRandevuAsync(randevu);
        }

        public async Task<bool> DeleteRandevuAsync(int id)
        {
            return await _repository.DeleteRandevuAsync(id);
        }

        public async Task<IEnumerable<Randevu>> GetAllRandevularAsync()
        {
            return await _repository.GetAllRandevularAsync();
        }

        public async Task<Randevu> GetRandevuByIdAsync(int id)
        {
            return await _repository.GetRandevuByIdAsync(id);
        }

        public async Task<Randevu> UpdateRandevuAsync(Randevu randevu)
        {
            return await _repository.UpdateRandevuAsync(randevu);
        }
    }
}
