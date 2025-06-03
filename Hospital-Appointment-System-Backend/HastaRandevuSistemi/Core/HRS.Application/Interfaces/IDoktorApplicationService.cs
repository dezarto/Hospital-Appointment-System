using HRS.Application.DTOs;

namespace HRS.Application.Interfaces
{
    public interface IDoktorApplicationService
    {
        Task<DoktorView> GetDoktorDatas(string doktorTC);
        Task<bool> UpdateDoktorDatas(string doktorTC, DoktorView doktorView);
        Task<List<MesaiDTO>>  GetMesaiDatas(string doktorTC);
        Task<List<RandevuBilgisiV>> GetRandevuListesi(string doktorTC);
        Task<RandevuBilgisiV> GetRandevuDetayi(string doktorTC, int RandevuID);
        Task<bool> UpdateRandevuDetayi(string doktorTC, int RandevuID, string randevuNotu);
    }
}
