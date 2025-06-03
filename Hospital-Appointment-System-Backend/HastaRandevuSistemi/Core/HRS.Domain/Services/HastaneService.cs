using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class HastaneService : IHastaneService
    {
        private readonly IGenericRepository<Hastane> _hastaneRepository;

        public HastaneService(IGenericRepository<Hastane> hastaneRepository)
        {
            _hastaneRepository = hastaneRepository;
        }

        public async Task<int> AddAsync(Hastane hastane)
        {
            return await _hastaneRepository.AddAsync(hastane);
        }

        public async Task DeleteAsync(int id)
        {
            await _hastaneRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Hastane>> GetAllAsync()
        {
            return await _hastaneRepository.GetAllAsync();
        }

        public async Task<Hastane> GetByHastaneNameAsync(string hastaneAdi)
        {
            // Arama sonucu null veya boş dönebilir, dolayısıyla kontrol yapıyoruz.
            var hastaneList = await _hastaneRepository.SearchByColumnAsync("HastaneAdi", hastaneAdi);

            if (hastaneList == null || !hastaneList.Any())
            {
                // Eğer sonuç boşsa, yeni bir Hastane nesnesi döndürüyoruz.
                return new Hastane();
            }

            return hastaneList.FirstOrDefault();
        }


        public async Task UpdateAsync(Hastane hastane)
        {
            await _hastaneRepository.UpdateAsync(hastane);
        }

        public async Task<bool> CheckIfHastaExistsAsync(string hastaneAdi)
        {
            var hastaneExist = await _hastaneRepository.SearchByColumnAsync("HastaneAdi", hastaneAdi);
            
            if(hastaneExist != null)
            {
                return true;
            }

            return false;
        }

        public async Task<Hastane> GetByHastaneIdAsync(int id)
        {
            var hastane = await _hastaneRepository.GetByIdAsync(id);

            if (hastane == null)
            {
                throw new Exception("Hastane bulunamadı!");
            }

            return hastane;
        }
    }
}
