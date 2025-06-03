using HRS.Application.DTOs;
using HRS.Application.Interfaces;
using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Application.Services
{
    public class UnAuthService : IUnAuthService
    {
        private readonly IIlService _ilService;
        private readonly IIlceService _ilceService;
        private readonly IIlIlceService _ilIlceService;
        private readonly IHastaneService _hastaneService;
        private readonly IHakkimdaHastaneService _hakkimdaHastaneService;
        private readonly IIletisimService _iletisimService;
        private readonly IAdresService _adresService;
        private readonly ISliderService _sliderService;
        private readonly IHastaneSliderService _hastaneSliderService;
        private readonly IHaberService _haberService;
        private readonly IHastaneHaberService _hastaneHaberService;
        private readonly IEtkinlikService _etkinlikService;
        private readonly IHastaneEtkinlikService _hastaneEtkinlikService;
        private readonly IDuyuruService _duyuruService;
        private readonly IHastaneDuyuruService _hastaneDuyuruService;
        private readonly IHastaneBolumService _hastaneBolumService;
        private readonly IBolumPoliklinikService _bolumPoliklinikService;
        private readonly IDoktorService _doktorService;
        private readonly IDoktorUzmanlikService _doktorUzmanlikService;

        public UnAuthService(IIlService ilService, IIlceService ilceService, IIlIlceService ilIlceService, IHastaneService hastaneService, IHakkimdaHastaneService hakkimdaHastaneService, IIletisimService iletisimService, IAdresService adresService, ISliderService sliderService, IHastaneSliderService hastaneSliderService, IHaberService haberService, IHastaneHaberService hastaneHaberService, IEtkinlikService etkinlikService, IHastaneEtkinlikService hastaneEtkinlikService, IDuyuruService duyuruService, IHastaneDuyuruService hastaneDuyuruService, IHastaneBolumService hastaneBolumService, IBolumPoliklinikService bolumPoliklinikService, IDoktorService doktorService, IDoktorUzmanlikService doktorUzmanlikService)
        {
            _ilService = ilService;
            _ilceService = ilceService;
            _ilIlceService = ilIlceService;
            _hastaneService = hastaneService;
            _hakkimdaHastaneService = hakkimdaHastaneService;
            _iletisimService = iletisimService;
            _adresService = adresService;
            _sliderService = sliderService;
            _hastaneSliderService = hastaneSliderService;
            _haberService = haberService;
            _hastaneHaberService = hastaneHaberService;
            _etkinlikService = etkinlikService;
            _hastaneEtkinlikService = hastaneEtkinlikService;
            _duyuruService = duyuruService;
            _hastaneDuyuruService = hastaneDuyuruService;
            _hastaneBolumService = hastaneBolumService;
            _bolumPoliklinikService = bolumPoliklinikService;
            _doktorService = doktorService;
            _doktorUzmanlikService = doktorUzmanlikService;
        }

        public async Task<IEnumerable<Hastane>> GetAllHastaneAsync()
        {
            return await _hastaneService.GetAllAsync();
        }

        public async Task<List<IlveIlceV>> GetAllIlandIlceAsync()
        {
            var iller = (await _ilService.GetAllAsync()).ToList();
            var ilceler = (await _ilceService.GetAllAsync()).ToList();
            var ililceList = (await _ilIlceService.GetAllAsync()).ToList();

            var newIlIlceler = iller.Select(il => new IlveIlceV
            {
                IlId = il.ID,
                IlAdi = il.IlAdi,
                IlceBilgisi = ilceler
                    .Where(ilce => ililceList.Any(ii => ii.Il_ID == il.ID && ii.Ilce_ID == ilce.ID))
                    .Select(ilce => new IlceDTO
                    {
                        ID = ilce.ID,
                        IlceAdi = ilce.IlceAdi
                    })
                    .ToList() // Birden fazla ilçe almak için listeye çevrildi
            }).ToList();

            return newIlIlceler;
        }

        public async Task<AllSlidersAndEtkinlikAndDuyuruAndHaber> GetAllSlidersAndEtkinlikAndDuyuruAndHaberByHastaneId(int hastaneId)
        {
            // Fetching data from services
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);
            if (hastane == null)
            {
                throw new Exception("Hastane bulunamadı.");
            }

            // Creating the final DTO object
            var allSlidersAndEtkinlikAndDuyuruAndHaber = new AllSlidersAndEtkinlikAndDuyuruAndHaber()
            {
                Sliders = new List<SliderDTO>(),
                Haberler = new List<HaberDTO>(),
                Etkinlikler = new List<EtkinlikDTO>(),
                Duyurular = new List<DuyuruDTO>(),
            };

            var sliderList = await _hastaneSliderService.GetSliderlerByHastaneIdAsync(hastaneId);
            var haberList = await _hastaneHaberService.GetHaberlerByHastaneIdAsync(hastaneId);
            var etkinlikList = await _hastaneEtkinlikService.GetEtkinliklerByHastaneIdAsync(hastaneId);
            var duyuruList = await _hastaneDuyuruService.GetDuyurularByHastaneIdAsync(hastaneId);


            // Processing sliders
            foreach (var item in sliderList)
            {
                var slider = await _sliderService.GetSliderByIdAsync(item.Slider_ID);

                if (slider == null) { continue; }

                var sliderDto = new SliderDTO
                {
                    ID = slider.ID,
                    SlideBaslik = slider.SlideBaslik,
                    Resim = slider.Resim,
                };

                allSlidersAndEtkinlikAndDuyuruAndHaber.Sliders.Add(sliderDto);
            }

            // Processing haberler (news)
            foreach (var item in haberList)
            {
                var haber = await _haberService.GetHaberByIdAsync(item.Haber_ID);

                if (haber == null) { continue; }

                var haberDto = new HaberDTO
                {
                    ID = haber.ID,
                    Baslik = haber.Baslik,
                    Icerik = haber.Icerik,
                    Resim = haber.Resim,
                    Tarih = haber.Tarih,
                };

                allSlidersAndEtkinlikAndDuyuruAndHaber.Haberler.Add(haberDto);
            }

            // Processing etkinlikler (events)
            foreach (var item in etkinlikList)
            {
                var etkinlik = await _etkinlikService.GetEtkinlikByIdAsync(item.Etkinlik_ID);

                if (etkinlik == null) { continue; }

                var etkinlikDto = new EtkinlikDTO
                {
                    ID = etkinlik.ID,
                    Baslik = etkinlik.Baslik,
                    Icerik = etkinlik.Icerik,
                    Resim = etkinlik.Resim,
                    Tarih = etkinlik.Tarih,
                };

                allSlidersAndEtkinlikAndDuyuruAndHaber.Etkinlikler.Add(etkinlikDto);
            }

            // Processing duyurular (announcements)
            foreach (var item in duyuruList)
            {
                var duyuru = await _duyuruService.GetDuyuruByIdAsync(item.ID_Duyuru);

                if (duyuru == null) { continue; }

                var duyuruDto = new DuyuruDTO
                {
                    ID = duyuru.ID,
                    Baslik = duyuru.Baslik,
                    Icerik = duyuru.Icerik,
                    Tarih = duyuru.Tarih,
                    Resim = duyuru.Resim,
                };

                allSlidersAndEtkinlikAndDuyuruAndHaber.Duyurular.Add(duyuruDto);
            }

            return allSlidersAndEtkinlikAndDuyuruAndHaber;
        }


        public async Task<AllHastaneInformation> GetByHastaneIdAllInformationAsync(int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);
            var hakkimdaHastane = await _hakkimdaHastaneService.GetByHakkimdaHastaneIdAsync(hastane.About_ID);
            var iletisim = await _iletisimService.GetByIletisimIdAsync(hastane.Iletisim_ID);
            var adres = await _adresService.GetByAdressIdAsync(hastane.Adres_ID);
            var il = await _ilService.GetByIlIdAsync(adres.Il_ID);
            var ilce = await _ilceService.GetByIlceIdAsync(adres.Ilce_ID);

            var newAllHastaneInformation = new AllHastaneInformation
            {
                About_ID = hastane.About_ID,
                Aciklama = hastane.Aciklama,
                Adres_ID = hastane.Adres_ID,
                CaddeSokak = adres.CaddeSokak,
                DisKapiNo = adres.DisKapiNo,
                Email = iletisim.Email,
                HastaneAdi = hastane.HastaneAdi,
                IcKapiNo = adres.IcKapiNo,
                Il = il.IlAdi,
                Ilce = ilce.IlceAdi,
                Mahalle = adres.Mahalle,
                Misyon = hakkimdaHastane.Misyon,
                TelNo = iletisim.TelNo,
                TelNo2 = iletisim.TelNo2,
                Ulke = adres.Ulke,
                Vizyon = hakkimdaHastane.Vizyon,
                YatakKapasitesi = hastane.YatakKapasitesi,
                Iletisim_ID = iletisim.ID,
                ID = hastane.ID,
                Twitter = iletisim.Twitter,
                Linkedin = iletisim.Linkedin,
                Instagram = iletisim.Instagram,
                Facebook = iletisim.Facebook
            };

            return newAllHastaneInformation;
        }

        public async Task<List<DoktorDTO>> GetDoktorsByHastaneID(int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);
            if (hastane == null) throw new ArgumentNullException(nameof(hastane), "Hastane bilgisi boş olamaz.");

            var hastaneBolumler = await _hastaneBolumService.GetBolumlerByHastaneIdAsync(hastaneId);
            var doktorListesi = new List<DoktorDTO>();

            foreach (var bolum in hastaneBolumler)
            {
                var tumPoliklinikler = await _bolumPoliklinikService.GetPolikliniklerByBolumIdAsync(bolum.Bolum_ID);

                foreach (var poliklinik in tumPoliklinikler)
                {
                    var tumDoktorlar = await _doktorService.GetAllDoktorlarAsync();
                    var eslesenDoktorlar = tumDoktorlar.Where(d => d.Poliklinik_ID == poliklinik.Poliklinik_ID).ToList();

                    foreach (var doktor in eslesenDoktorlar)
                    {
                        var newDoktorBilgisi = new DoktorDTO
                        {
                            Isim = doktor.Isim,
                            Soyisim = doktor.Soyisim,
                            Cinsiyet = doktor.Cinsiyet,
                        };

                        doktorListesi.Add(newDoktorBilgisi);
                    }
                }
            }

            return doktorListesi;
        }

        public async Task<List<DTOs.DoktorUzmanlik>> GetDoktorUzmanliklar()
        {
            var doktorUzmanliklar = await _doktorUzmanlikService.GetAllDoktorUzmanlikAsync(); // Task'in tamamlanmasını bekle
            return doktorUzmanliklar.Select(d => new DTOs.DoktorUzmanlik
            {
                UzmanlikID = d.UzmanlikID,
                UzmanlikAdi = d.UzmanlikAdi
            }).ToList();
        }
    }
}
