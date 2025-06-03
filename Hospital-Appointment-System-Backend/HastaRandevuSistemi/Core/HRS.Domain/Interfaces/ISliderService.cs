using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface ISliderService
    {
        Task<Slider> AddSliderAsync(Slider slider);
        Task<IEnumerable<Slider>> GetAllSliderlerAsync();
        Task<Slider> GetSliderByIdAsync(int id);
        Task<Slider> UpdateSliderAsync(Slider slider);
        Task<bool> DeleteSliderAsync(int id);
    }
}
