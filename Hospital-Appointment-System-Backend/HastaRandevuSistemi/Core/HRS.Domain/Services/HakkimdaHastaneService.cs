using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class HakkimdaHastaneService : IHakkimdaHastaneService
    {
        private readonly IGenericRepository<HakkimdaHastane> _hakkimdaHastaneRepository;

        public HakkimdaHastaneService(IGenericRepository<HakkimdaHastane> hakkimdaHastaneRepository)
        {
            _hakkimdaHastaneRepository = hakkimdaHastaneRepository;
        }

        public async Task<int> AddAsync(HakkimdaHastane iletisim)
        {
            return await _hakkimdaHastaneRepository.AddAsync(iletisim);
        }

        public async Task<HakkimdaHastane> GetByHakkimdaHastaneIdAsync(int id)
        {
            return await _hakkimdaHastaneRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<HakkimdaHastane>> GetAllAsync()
        {
            return await _hakkimdaHastaneRepository.GetAllAsync();
        }

        public async Task UpdateAsync(HakkimdaHastane hakkimdaHastane)
        {
            await _hakkimdaHastaneRepository.UpdateAsync(hakkimdaHastane);
        }

        public async Task DeleteAsync(int id)
        {
            await _hakkimdaHastaneRepository.DeleteAsync(id);
        }
    }
}
