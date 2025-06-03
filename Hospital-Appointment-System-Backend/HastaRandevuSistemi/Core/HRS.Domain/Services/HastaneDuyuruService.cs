using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class HastaneDuyuruService : IHastaneDuyuruService
    {
        private readonly IHastaneDuyuruRepository _duyuruRepository;

        public HastaneDuyuruService(IHastaneDuyuruRepository duyuruRepository)
        {
            _duyuruRepository = duyuruRepository;
        }

        public async Task<IEnumerable<HastaneDuyuru>> GetDuyurularByHastaneIdAsync(int hastaneId)
        {
            return await _duyuruRepository.GetDuyurularByHastaneIdAsync(hastaneId);
        }

        public async Task<bool> AddHastaneDuyuruAsync(HastaneDuyuru hastaneDuyuru)
        {
            return await _duyuruRepository.AddHastaneDuyuruAsync(hastaneDuyuru);
        }

        public async Task<bool> DeleteHastaneDuyuruAsync(int hastaneId, int duyuruId)
        {
            return await _duyuruRepository.DeleteHastaneDuyuruAsync(hastaneId, duyuruId);
        }
    }
}
