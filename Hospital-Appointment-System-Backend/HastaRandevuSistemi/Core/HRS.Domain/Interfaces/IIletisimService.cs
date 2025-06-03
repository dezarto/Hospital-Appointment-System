using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IIletisimService
    {
        Task<IEnumerable<Iletisim>> GetAllAsync();
        Task<Iletisim> GetByIletisimIdAsync(int id);
        Task<int> AddAsync(Iletisim iletisim);
        Task UpdateAsync(Iletisim iletisim);
        Task DeleteAsync(int id);
    }
}
