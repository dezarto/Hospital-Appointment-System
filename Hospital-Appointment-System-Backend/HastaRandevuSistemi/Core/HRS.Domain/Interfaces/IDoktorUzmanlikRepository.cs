using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IDoktorUzmanlikRepository
    {
        Task<DoktorUzmanlik> AddDoktorUzmanlikAsync(DoktorUzmanlik doktorUzmanlik);
        Task<IEnumerable<DoktorUzmanlik>> GetAllDoktorUzmanlikAsync();
        Task<DoktorUzmanlik> GetDoktorUzmanlikByIdAsync(int id);
        Task<DoktorUzmanlik> UpdateDoktorUzmanlikAsync(DoktorUzmanlik doktorUzmanlik);
        Task<bool> DeleteDoktorUzmanlikAsync(int id);
    }
}
