using System.Linq.Expressions;
using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class IlceService : IIlceService
    {
        private readonly IGenericRepository<Ilce> _ilceRepository;

        public IlceService(IGenericRepository<Ilce> ilceRepository)
        {
            _ilceRepository = ilceRepository;
        }

        public async Task<int> AddAsync(Ilce iletisim)
        {
            return await _ilceRepository.AddAsync(iletisim);
        }

        public async Task<Ilce> GetByIlceIdAsync(int id)
        {
            return await _ilceRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Ilce>> GetAllAsync()
        {
            return await _ilceRepository.GetAllAsync();
        }

        public async Task UpdateAsync(Ilce iletisim)
        {
            await _ilceRepository.UpdateAsync(iletisim);
        }

        public async Task DeleteAsync(int id)
        {
            await _ilceRepository.DeleteAsync(id);
        }

        public async Task<Ilce> GetByIlceNameAsync(string ilceAdi)
        {
            return (await _ilceRepository.SearchByColumnAsync("IlceAdi", ilceAdi)).FirstOrDefault();
        }

        
    }
}
