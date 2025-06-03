using HRS.Domain.Entities;

namespace HRS.Domain.Interfaces
{
    public interface IDoktorMesaiService
    {
        Task<IEnumerable<DoktorMesai>> GetMesailerByDoktorIdAsync(string doktorTC);
        Task<bool> AddDoktorMesaiAsync(DoktorMesai doktorMesai);
        Task<bool> DeleteDoktorMesaiAsync(string doktorTC, int mesaiId);
    }
}
