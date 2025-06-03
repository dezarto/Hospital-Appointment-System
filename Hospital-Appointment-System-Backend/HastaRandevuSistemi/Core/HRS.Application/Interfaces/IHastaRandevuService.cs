using HRS.Application.DTOs;
using HRS.Domain.Entities;

namespace HRS.Application.Interfaces
{
    public interface IHastaRandevuService
    {
        Task<RandevuAra> SearchRandevu();
        Task<Randevu> ConfirmRandevu(RandevuConfirm randevuConfirm);
        Task<List<RandevuV>> Randevularim(string hastaTC);

        Task<HastaView> GetHastaDatas(string doktorTC);
        Task<bool> UpdateHastaDatas(string hastaTC, HastaView hastaView);
        Task<RandevuBilgisiV> GetRandevuDetayi(string hastaTC, int RandevuID);
    }
}
