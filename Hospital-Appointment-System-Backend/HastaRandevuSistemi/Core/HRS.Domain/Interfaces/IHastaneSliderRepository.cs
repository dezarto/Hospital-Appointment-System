using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IHastaneSliderRepository
    {
        Task<IEnumerable<HastaneSlider>> GetSliderlerByHastaneIdAsync(int hastaneId);
        Task<bool> AddHastaneSliderAsync(HastaneSlider hastaneSlider);
        Task<bool> DeleteHastaneSliderAsync(int hastaneId, int sliderId);
    }
}
