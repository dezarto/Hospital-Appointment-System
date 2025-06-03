using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class DuyuruService : IDuyuruService
    {
        private readonly IDuyuruRepository _repository;

        public DuyuruService(IDuyuruRepository repository)
        {
            _repository = repository;
        }

        public async Task<Duyuru> AddDuyuruAsync(Duyuru duyuru)
        {
            return await _repository.AddDuyuruAsync(duyuru);
        }

        public async Task<bool> DeleteDuyuruAsync(int id)
        {
            return await _repository.DeleteDuyuruAsync(id);
        }

        public async Task<IEnumerable<Duyuru>> GetAllDuyurularAsync()
        {
            return await _repository.GetAllDuyurularAsync();
        }

        public async Task<Duyuru> GetDuyuruByIdAsync(int id)
        {
            return await _repository.GetDuyuruByIdAsync(id);
        }

        public async Task<Duyuru> UpdateDuyuruAsync(Duyuru duyuru)
        {
            return await _repository.UpdateDuyuruAsync(duyuru);
        }
    }
}
