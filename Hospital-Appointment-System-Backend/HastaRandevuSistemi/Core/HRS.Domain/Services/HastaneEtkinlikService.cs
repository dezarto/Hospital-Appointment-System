using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class HastaneEtkinlikService : IHastaneEtkinlikService
    {
        private readonly IHastaneEtkinlikRepository _etkinlikRepository;

        public HastaneEtkinlikService(IHastaneEtkinlikRepository etkinlikRepository)
        {
            _etkinlikRepository = etkinlikRepository;
        }

        public async Task<IEnumerable<HastaneEtkinlik>> GetEtkinliklerByHastaneIdAsync(int hastaneId)
        {
            return await _etkinlikRepository.GetEtkinliklerByHastaneIdAsync(hastaneId);
        }

        public async Task<bool> AddHastaneEtkinlikAsync(HastaneEtkinlik hastaneEtkinlik)
        {
            return await _etkinlikRepository.AddHastaneEtkinlikAsync(hastaneEtkinlik);
        }

        public async Task<bool> DeleteHastaneEtkinlikAsync(int hastaneId, int etkinlikId)
        {
            return await _etkinlikRepository.DeleteHastaneEtkinlikAsync(hastaneId, etkinlikId);
        }
    }
}
