using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class IlService : IIlService
    {
        private readonly IGenericRepository<Il> _ilRepository;

        public IlService(IGenericRepository<Il> ilRepository)
        {
            _ilRepository = ilRepository;
        }

        public async Task<int> AddAsync(Il il)
        {
            return await _ilRepository.AddAsync(il);
        }

        public async Task<Il> GetByIlIdAsync(int id)
        {
            return await _ilRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Il>> GetAllAsync()
        {
            return await _ilRepository.GetAllAsync();
        }

        public async Task UpdateAsync(Il il)
        {
            await _ilRepository.UpdateAsync(il);
        }

        public async Task DeleteAsync(int id)
        {
            await _ilRepository.DeleteAsync(id);
        }

        public async Task<Il> GetByIlNameAsync(string ilAdi)
        {
            return (await _ilRepository.SearchByColumnAsync("IlAdi", ilAdi)).FirstOrDefault();
        }

    }
}
