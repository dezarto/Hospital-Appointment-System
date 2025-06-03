using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class IletisimService : IIletisimService
    {
        private readonly IGenericRepository<Iletisim> _iletisimRepository;

        public IletisimService(IGenericRepository<Iletisim> iletisimRepository)
        {
            _iletisimRepository = iletisimRepository;
        }

        public async Task<int> AddAsync(Iletisim iletisim)
        {
           return await _iletisimRepository.AddAsync(iletisim);
        }

        public async Task<Iletisim> GetByIletisimIdAsync(int id)
        {
            return await _iletisimRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Iletisim>> GetAllAsync()
        {
            return await _iletisimRepository.GetAllAsync();
        }

        public async Task UpdateAsync(Iletisim iletisim)
        {
            await _iletisimRepository.UpdateAsync(iletisim);
        }

        public async Task DeleteAsync(int id)
        {
            await _iletisimRepository.DeleteAsync(id);
        }
    }
}
