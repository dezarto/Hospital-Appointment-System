using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IDoktorRepository
    {
        Task<Doktor> AddDoktorAsync(Doktor doktor);
        Task<Doktor> GetDoktorByTCAsync(string doktorTC);
        Task<Doktor> UpdateDoktorAsync(Doktor doktor);
        Task<bool> DeleteDoktorAsync(string doktorTC);
        Task<List<Doktor>> GetAllDoktorlarAsync();
    }
}
