using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Domain.Services
{
    public class HastaneHaberService : IHastaneHaberService
    {
        private readonly IHastaneHaberRepository _haberRepository;

        public HastaneHaberService(IHastaneHaberRepository haberRepository)
        {
            _haberRepository = haberRepository;
        }

        public async Task<IEnumerable<HastaneHaber>> GetHaberlerByHastaneIdAsync(int hastaneId)
        {
            return await _haberRepository.GetHaberlerByHastaneIdAsync(hastaneId);
        }

        public async Task<bool> AddHastaneHaberAsync(HastaneHaber hastaneHaber)
        {
            return await _haberRepository.AddHastaneHaberAsync(hastaneHaber);
        }

        public async Task<bool> DeleteHastaneHaberAsync(int hastaneId, int haberId)
        {
            return await _haberRepository.DeleteHastaneHaberAsync(hastaneId, haberId);
        }
    }

}
