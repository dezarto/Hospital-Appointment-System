using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class AdresService : IAdresService
    {
        private readonly IGenericRepository<Adres> _adresRepository;

        public AdresService(IGenericRepository<Adres> adresRepository)
        {
            _adresRepository = adresRepository;
        }

        public async Task<int> AddAsync(Adres adres)
        {
            return await _adresRepository.AddAsync(adres);
        }

        public async Task<Adres> GetByAdressIdAsync(int id)
        {
            return await _adresRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Adres>> GetAllAsync()
        {
            return await _adresRepository.GetAllAsync();
        }

        public async Task UpdateAsync(Adres hasta)
        {
            await _adresRepository.UpdateAsync(hasta);
        }

        public async Task DeleteAsync(int id)
        {
            await _adresRepository.DeleteAsync(id);
        }
    }
}
