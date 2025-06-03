using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IEtkinlikRepository
    {
        Task<Etkinlik> AddEtkinlikAsync(Etkinlik etkinlik);
        Task<IEnumerable<Etkinlik>> GetAllEtkinliklerAsync();
        Task<Etkinlik> GetEtkinlikByIdAsync(int id);
        Task<Etkinlik> UpdateEtkinlikAsync(Etkinlik etkinlik);
        Task<bool> DeleteEtkinlikAsync(int id);
    }
}
