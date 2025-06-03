using HRS.Application.DTOs;

namespace HRS.Application.Interfaces
{
    public interface IAdminService
    {
        Task<bool> AddNewHastane(NewHastane newHastane);
        Task<bool> DeleteHastane(int hastaneId);
        Task<bool> UpdateHastane(HastaneDTO hastaneDto, int hastaneId);
        Task<HastaneDTO> GetHastaneInformationById(int hastaneId);
        Task<IletisimDTO> GetCommunicationInformationByHospitalId(int HastaneId);
        Task<bool> UpdateCommunicationInformationByHospitalId(IletisimDTO iletisimDto, int hospitalId);
        Task<HakkimdaHastaneDTO> GetAboutUsByHospitalName(int hastaneId);
        Task<bool> UpdateAboutUsByHospitalName(HakkimdaHastaneDTO hakkimdaHastaneDto, int hastaneId);
        Task<AdresDTO> GetAddressInformationByHospitalId(int hastaneId);
        Task<bool> UpdateAddressInformationByHospitalId(AdresDTO adresDto, int hastaneId);
        
        Task<IEnumerable<HastaDTO>> GetAllHasta();
        Task<bool> AddNewHasta(NewHasta newHasta);
        Task<bool> DeleteHasta(string hastaTC);
        Task<bool> UpdateHasta(HastaDTO hastaDTO, string hastaTC);
        Task<HastaDTO> GetHastaInformation(string hastaTC);
        Task<IletisimDTO> GetCommunicationInformationByHastaTC(string hastaTC);
        Task<bool> UpdateCommunicationInformationByHastaTC(IletisimDTO iletisimDto, string hastaTC);
        Task<AdresDTO> GetAddressByHastaTC(string hastaTC);
        Task<bool> UpdateAddressByHastaTC(AdresDTO adresDto, string hastaTC);

        Task<List<IlveIlceV>> GetIlIlceInformation();
        Task<bool> AddIlAsync(string ilAdi);
        Task<bool> AddIlceAsync(string ilceAdi, int ilId);
        Task<bool> DeleteIlAsync(int ilId);
        Task<bool> DeleteIlceAsync(int ilceId);
        Task<bool> UpdateIlAsync(int ilId, string yeniIlAdi);
        Task<bool> UpdateIlceAsync(int ilceId, string yeniIlceAdi);

        Task<IEnumerable<DuyuruDTO>> GetDuyuruByHastaneID(int hastaneId);
        Task<DuyuruDTO> GetDuyuruByDuyuruID(int hastaneId, int duyuruId);
        Task<bool> AddNewDuyuru(DuyuruDTO duyuruDTO, int hastaneId);
        Task<bool> DeleteDuyuru(int hastaneId, int duyuruId);
        Task<bool> UpdateDuyuru(DuyuruDTO duyuruDTO, int duyuruId, int hastaneId);

        Task<IEnumerable<HaberDTO>> GetHaberByHastaneID(int hastaneId);
        Task<HaberDTO> GetHaberByHaberID(int hastaneId, int haberId);
        Task<bool> AddNewHaber(HaberDTO haberDTO, int hastaneId);
        Task<bool> DeleteHaber(int hastaneId, int haberId);
        Task<bool> UpdateHaber(HaberDTO haberDTO, int haberId, int hastaneId);

        Task<IEnumerable<EtkinlikDTO>> GetEtkinlikByHastaneID(int hastaneId);
        Task<EtkinlikDTO> GetEtkinlikByEtkinlikID(int hastaneId, int etkinlikId);
        Task<bool> AddNewEtkinlik(EtkinlikDTO etkinlikDTO, int hastaneId);
        Task<bool> DeleteEtkinlik(int hastaneId, int etkinlikId);
        Task<bool> UpdateEtkinlik(EtkinlikDTO etkinlikDTO, int etkinlikId, int hastaneId);

        Task<IEnumerable<SliderDTO>> GetSliderByHastaneID(int hastaneId);
        Task<SliderDTO> GetSliderBySliderID(int hastaneId, int sliderId);
        Task<bool> AddNewSlider(SliderDTO sliderDTO, int hastaneId);
        Task<bool> DeleteSlider(int hastaneId, int sliderId);
        Task<bool> UpdateSlider(SliderDTO sliderDTO, int sliderId, int hastaneId);
        //Hastane doktor işlemleri
        Task<List<AddNewDoktor>> GetDoktorsByHastaneID(int hastaneId);
        Task<List<AddNewDoktor>> GetDoktorsByPoliklinikID(int poliklinikId);
        Task<bool> AddNewDoktor(AddNewDoktor addNewDoktor, int hastaneId, int poliklinikId);
        Task<bool> DeleteDoktor(string doktorTC);
        Task<bool> UpdateDoktor(AddNewDoktor addNewDoktor, string doktorTC);
        //Mesailer
        Task<List<MesaiDTO>> GetMesailerByHastaneAndDoktorID(int hastaneId, string doktorTC);
        Task<bool> AddNewDoktorMesai(MesaiDTO mesaiDTO, string doktorTC);
        Task<bool> DeleteDoktorAllMesai(int hastaneId, string doktorTC);
        Task<bool> DeleteDoktorMesaiByMesaiID(int hastaneId, string doktorTC, int mesaiId);
        // Hastane randevuları
        Task<List<RandevuBilgisiV>> GetRandevularByHastaneID(int hastaneId);
        Task<bool> DeleteRandevuByRandevuID(int randevuId);
        // Bolum islemleri
        Task<List<AddNewBolum>> GetBolumlerByHastaneID(int hastaneId);
        Task<bool> AddNewBolum(AddNewBolum bolumDTO, int hastaneId);
        Task<bool> DeleteBolum(int hastaneId, int bolumId);
        Task<bool> UpdateBolum(AddNewBolum addNewBolum, int bolumId, int hastaneId);
        // Poliklinik islemleri
        Task<List<AddNewPoliklinik>> GetPolikliniklerByHastaneID(int hastaneId, int bolumId);
        Task<bool> AddNewPoliklinik(AddNewPoliklinik addNewPoliklinik, int hastaneId, int bolumId);
        Task<bool> DeletePoliklinik(int hastaneId, int poliklinikId, int bolumId);
        Task<bool> UpdatePoliklinik(AddNewPoliklinik addNewPoliklinik, int poliklinikId);
    }
}
