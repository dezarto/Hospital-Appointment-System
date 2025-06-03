using AutoMapper;
using HRS.Application.DTOs;
using HRS.Application.Interfaces;
using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Application.Services
{
    public class HastaRandevuService : IHastaRandevuService
    {
        private readonly IMapper _mapper;
        private readonly IIletisimService _iletisimService;
        private readonly IAdresService _adresService;
        private readonly IIlService _ilService;
        private readonly IIlceService _ilceService;
        private readonly IIlIlceService _ilIlceService;
        private readonly IHastaService _hastaService;
        private readonly IHastaneService _hastaneService;
        private readonly IHastaneBolumService _hastaneBolumService;
        private readonly IBolumPoliklinikService _bolumPoliklinikService;
        private readonly IBolumService _bolumService;
        private readonly IDoktorService _doktorService;
        private readonly IDoktorUzmanlikService _doktorUzmanlikService;
        private readonly IMesaiService _mesaiService;
        private readonly IDoktorMesaiService _doktorMesaiService;
        private readonly IPoliklinikService _poliklinikService;
        private readonly IRandevuService _randevuService;

        public HastaRandevuService(IMapper mapper, IIletisimService iletisimService, IAdresService adresService, IIlService ilService, IIlceService ilceService, IIlIlceService ilIlceService, IHastaService hastaService, IHastaneService hastaneService, IHastaneBolumService hastaneBolumService, IBolumPoliklinikService bolumPoliklinikService, IBolumService bolumService, IDoktorService doktorService, IDoktorUzmanlikService doktorUzmanlikService, IMesaiService mesaiService, IDoktorMesaiService doktorMesaiService, IPoliklinikService poliklinikService, IRandevuService randevuService)
        {
            _mapper = mapper;
            _iletisimService = iletisimService;
            _adresService = adresService;
            _ilService = ilService;
            _ilceService = ilceService;
            _ilIlceService = ilIlceService;
            _hastaService = hastaService;
            _hastaneService = hastaneService;
            _hastaneBolumService = hastaneBolumService;
            _bolumPoliklinikService = bolumPoliklinikService;
            _bolumService = bolumService;
            _doktorService = doktorService;
            _doktorUzmanlikService = doktorUzmanlikService;
            _mesaiService = mesaiService;
            _doktorMesaiService = doktorMesaiService;
            _poliklinikService = poliklinikService;
            _randevuService = randevuService;
        }

        public async Task<Randevu> ConfirmRandevu(RandevuConfirm randevuConfirm)
        {
            var hasta = await _hastaService.CheckIfHastaExistsAsync(randevuConfirm.Hasta_TC);

            if (hasta == null) throw new ArgumentNullException(nameof(hasta), "Hasta bilgileri null olamaz!");

            var newRandevu = new Randevu
            {
                Hasta_TC = randevuConfirm.Hasta_TC,
                Doktor_TC = randevuConfirm.Doktor_TC,
                Poliklinik_ID = randevuConfirm.PoliklinikID,
                RandevuTarihi = randevuConfirm.Tarih,
                BitisSaati = randevuConfirm.BitisZamani,
                BaslangıcSaati = randevuConfirm.BaslangicZamani
            };

            var mesai = await _mesaiService.GetMesaiByIdAsync(randevuConfirm.MesaiID);

            mesai.Aktif = false;

            await _mesaiService.UpdateMesaiAsync(mesai);

            var randevu = await _randevuService.AddRandevuAsync(newRandevu);

            return randevu;
        }

        public async Task<HastaView> GetHastaDatas(string doktorTC)
        {
            var hasta = await _hastaService.GetByHastaIdAsync(doktorTC);

            if (hasta == null) throw new ArgumentNullException(nameof(hasta), "Hasta bulunamadı!");

            var adres = await _adresService.GetByAdressIdAsync(hasta.Adres_ID);
            var iletisim = await _iletisimService.GetByIletisimIdAsync(hasta.Iletisim_ID);

            var newNewHasta = new HastaView
            {
                HastaBilgisi = _mapper.Map<HastaDTO>(hasta),
                AdresBilgisi = _mapper.Map<AdresDTO>(adres),
                IletisimBilgisi = _mapper.Map<IletisimDTO>(iletisim)
            };

            return newNewHasta;
        }

        public async Task<RandevuBilgisiV> GetRandevuDetayi(string hastaTC, int RandevuID)
        {
            var hasta = await _hastaService.GetByHastaIdAsync(hastaTC);
            if (hasta == null) throw new ArgumentNullException(nameof(hasta), "Hasta bulunamadı!");

            var randevu = await _randevuService.GetRandevuByIdAsync(RandevuID);
            if (randevu == null) throw new ArgumentNullException(nameof(randevu), "Randevu bulunamadı!");

            var doktor = await _doktorService.GetDoktorByTCAsync(randevu.Doktor_TC);
            if (doktor == null) throw new ArgumentNullException(nameof(doktor), "Doktor bulunamadı!");

            var newRandevuBilgisi = new RandevuBilgisiV
            {
                RandevuID = randevu.RandevuID,
                Doktor = new DoktorDTO
                {
                    Doktor_TC = doktor.Doktor_TC,
                    Isim = doktor.Isim,
                    Soyisim = doktor.Soyisim,
                    Cinsiyet = doktor.Cinsiyet,
                },
                Hasta = new HastaDTO
                {
                    Hasta_TC = hasta.Hasta_TC,
                    Isim = hasta.Isim,
                    Soyisim = hasta.Soyisim,
                    AnneAdi = hasta.AnneAdi,
                    BabaAdi = hasta.BabaAdi,
                    Cinsiyet = hasta.Cinsiyet,
                    DogumTarihi = hasta.DogumTarihi,
                    Adres_ID = hasta.Adres_ID,
                    DogumYeri = hasta.DogumYeri,
                    Iletisim_ID = hasta.Iletisim_ID,
                    SaglikGecmisi = hasta.SaglikGecmisi,
                },
                RandevuDetay = new RandevuDTO
                {
                    RandevuID = randevu.RandevuID,
                    Doktor_TC = randevu.Doktor_TC,
                    Hasta_TC = randevu.Hasta_TC,
                    Poliklinik_ID = randevu.Poliklinik_ID,
                    RandevuTarihi = randevu.RandevuTarihi,
                    BaslangıcSaati = randevu.BaslangıcSaati,
                    BitisSaati = randevu.BitisSaati,
                    RandevuNotu = randevu.RandevuNotu,
                }
            };

            return newRandevuBilgisi;
        }

        public async Task<List<RandevuV>> Randevularim(string hastaTC)
        {
            var hasta = await _hastaService.GetByHastaIdAsync(hastaTC);

            if(hasta == null) throw new ArgumentNullException(nameof(hasta), "Hasta bilgileri null olamaz!");

            var tumRandevular = await _randevuService.GetAllRandevularAsync();

            var eslesenRandevular = tumRandevular.Where(r => r.Hasta_TC == hastaTC).ToList();
            var newRandevuVList = new List<RandevuV>();

            foreach (var randevu in eslesenRandevular)
            {
                var doktor = await _doktorService.GetDoktorByTCAsync(randevu.Doktor_TC);
                var poliklinik = await _poliklinikService.GetPoliklinikByIdAsync(randevu.Poliklinik_ID);
                var bolumPoliklinik = await _bolumPoliklinikService.GetAllPolikliniklerAsync();

                var eslesenBolum = bolumPoliklinik.Where(r => r.Poliklinik_ID == randevu.Poliklinik_ID).First();
                var bolum = await _bolumService.GetBolumByIdAsync(eslesenBolum.Bolum_ID);

                var hastaneBolum = await _hastaneBolumService.GetAllBolumlerAsync();
                var eslesenHastane = hastaneBolum.Where(r => r.Bolum_ID == bolum.BolumID).First();
                var hastane = await _hastaneService.GetByHastaneIdAsync(eslesenHastane.Hastane_ID);

                var newRandevuV = new RandevuV
                {
                    RandevuID = randevu.RandevuID,
                    DoktorAdiSoyadi = doktor.Isim + doktor.Soyisim,
                    Hasta_TC = hastaTC,
                    PoliklinikAdi = poliklinik.PoliklinikAdi,
                    BolumAdi = bolum.BolumAdi,
                    HastaneAdi = hastane.HastaneAdi,
                    BaslangıcSaati = randevu.BaslangıcSaati,
                    BitisSaati = randevu.BitisSaati,
                    RandevuTarihi = randevu.RandevuTarihi,
                };

                newRandevuVList.Add(newRandevuV);
            }

            return newRandevuVList;
        }

        public async Task<RandevuAra> SearchRandevu()
        {
            // 1. Get province-district relationships
            var tumIlIlceler = await _ilIlceService.CustomGetAllAsync();

            // 2-4. Get all base data
            var tumIller = await _ilService.GetAllAsync();
            var tumIlceler = await _ilceService.GetAllAsync();
            var tumHastaneler = await _hastaneService.GetAllAsync();

            // 5. Build province structure
            var illerDto = tumIller.Select(il => new IlBilgisiDto
            {
                Id = il.ID,
                IlAdi = il.IlAdi,
                Ilceler = tumIlIlceler.Where(ililce => ililce.Il_ID == il.ID)
                    .Join(tumIlceler,
                        ililce => ililce.Ilce_ID,
                        ilce => ilce.ID,
                        (ililce, ilce) => new IlceBilgisiDto
                        {
                            Id = ilce.ID,
                            IlceAdi = ilce.IlceAdi,
                            Hastaneler = new List<HastaneBilgisi>()
                        }).ToList()
            }).ToList();

            // 6. Get hospital addresses
            var hastaneAdresler = new List<dynamic>();
            foreach (var hastane in tumHastaneler)
            {
                var adres = await _adresService.GetByAdressIdAsync(hastane.Adres_ID);
                hastaneAdresler.Add(new { Hastane = hastane, Adres = adres });
            }

            // 7. Process hospitals sequentially
            foreach (var hastaneAdres in hastaneAdresler)
            {
                var bolumlerListe = new List<DTOs.Bolum>();
                var polikliniklerListe = new List<DTOs.Poliklinik>();

                // Process departments
                var tumBolumler = await _hastaneBolumService.GetBolumlerByHastaneIdAsync(hastaneAdres.Hastane.ID);
                foreach (var bolum in tumBolumler)
                {
                    var bolumBilgisi = await _bolumService.GetBolumByIdAsync(bolum.Bolum_ID);
                    var newBolum = new DTOs.Bolum
                    {
                        BolumID = bolum.Bolum_ID,
                        BolumAciklama = bolumBilgisi.BolumAciklama,
                        BolumAdi = bolumBilgisi.BolumAdi,
                    };

                    // Process clinics
                    var tumPoliklinikler = await _bolumPoliklinikService.GetPolikliniklerByBolumIdAsync(bolum.Bolum_ID);
                    foreach (var poliklinik in tumPoliklinikler)
                    {
                        var poliklinikBilgisi = await _poliklinikService.GetPoliklinikByIdAsync(poliklinik.Poliklinik_ID);

                        // Process doctors sequentially
                        var tumDoktorlar = await _doktorService.GetAllDoktorlarAsync();
                        var poliklinikDoktorlari = tumDoktorlar.Where(d => d.Poliklinik_ID == poliklinik.Poliklinik_ID).ToList();
                        var doktorListesi = new List<DTOs.Doktor>();

                        foreach (var doktor in poliklinikDoktorlari)
                        {
                            // Get doctor shifts sequentially
                            var doktorMesai = await _doktorMesaiService.GetMesailerByDoktorIdAsync(doktor.Doktor_TC);
                            var mesaiListesi = new List<Mesai>();

                            foreach (var m in doktorMesai)
                            {
                                var mesaiBilgi = await _mesaiService.GetMesaiByIdAsync(m.MesaiID);
                                DateTime mesaiBaslangic = mesaiBilgi.Tarih.Date + mesaiBilgi.BaslangicSaati;
                                DateTime mesaiBitis = mesaiBilgi.Tarih.Date + mesaiBilgi.BitisSaati;
                                if (mesaiBilgi.Aktif && mesaiBitis > DateTime.Now) { 
                                    mesaiListesi.Add(new Mesai
                                    {
                                        MesaiID = mesaiBilgi.MesaiID,
                                        Tarih = mesaiBilgi.Tarih,
                                        BaslangicSaati = mesaiBilgi.BaslangicSaati,
                                        BitisSaati = mesaiBilgi.BitisSaati,
                                        Aktif = mesaiBilgi.Aktif,
                                    });
                                }
                            }

                            var uzmanlikBilgi = await _doktorUzmanlikService.GetDoktorUzmanlikByIdAsync(doktor.Uzmanlik_ID);
                            doktorListesi.Add(new DTOs.Doktor
                            {
                                Doktor_TC = doktor.Doktor_TC,
                                Isim = doktor.Isim,
                                Soyisim = doktor.Soyisim,
                                Cinsiyet = doktor.Cinsiyet,
                                UzmanlikAdi = uzmanlikBilgi.UzmanlikAdi,
                                DoktorMesai = mesaiListesi
                            });
                        }

                        polikliniklerListe.Add(new DTOs.Poliklinik
                        {
                            PoliklinikAdi = poliklinikBilgisi.PoliklinikAdi,
                            PoliklinikID = poliklinikBilgisi.PoliklinikID,
                            Doktorlar = doktorListesi
                        });
                    }

                    bolumlerListe.Add(newBolum);
                }

                // Add hospital to district
                var adres = hastaneAdres.Adres;
                if (adres != null)
                {
                    var ilceDto = illerDto.SelectMany(il => il.Ilceler)
                                         .FirstOrDefault(ilce => ilce.Id == adres.Ilce_ID);

                    if (ilceDto != null)
                    {
                        ilceDto.Hastaneler.Add(new HastaneBilgisi
                        {
                            HastaneID = hastaneAdres.Hastane.ID,
                            HastaneAdi = hastaneAdres.Hastane.HastaneAdi,
                            Adres = _mapper.Map<AdresDTO>(adres),
                            Bolumler = bolumlerListe,
                            Poliklinikler = polikliniklerListe
                        });
                    }
                }
            }

            return new RandevuAra
            {
                Iller = illerDto
            };
        }

        public async Task<bool> UpdateHastaDatas(string hastaTC, HastaView hastaView)
        {
            var hasta = await _hastaService.GetByHastaIdAsync(hastaTC);

            if (hasta == null) throw new ArgumentNullException(nameof(hasta), "Hasta bulunamadı!");

            var adres = await _adresService.GetByAdressIdAsync(hasta.Adres_ID);
            var iletisim = await _iletisimService.GetByIletisimIdAsync(hasta.Iletisim_ID);

            hasta.DogumTarihi = hastaView.HastaBilgisi.DogumTarihi;
            hasta.Cinsiyet = hastaView.HastaBilgisi.Cinsiyet;
            hasta.SaglikGecmisi = hastaView.HastaBilgisi.SaglikGecmisi;
            hasta.BabaAdi = hastaView.HastaBilgisi.BabaAdi;
            hasta.AnneAdi = hastaView.HastaBilgisi.AnneAdi;
            hasta.Isim = hastaView.HastaBilgisi.Isim;
            hasta.Soyisim = hastaView.HastaBilgisi.Soyisim;
            hasta.DogumYeri = hastaView.HastaBilgisi.DogumYeri;

            adres.Mahalle = hastaView.AdresBilgisi.Mahalle;
            adres.CaddeSokak = hastaView.AdresBilgisi.CaddeSokak;
            adres.DisKapiNo = hastaView.AdresBilgisi.DisKapiNo;
            adres.IcKapiNo = hastaView.AdresBilgisi.IcKapiNo;
            adres.Il_ID = hastaView.AdresBilgisi.Il_ID;
            adres.Ilce_ID = hastaView.AdresBilgisi.Ilce_ID;
            adres.Ulke = hastaView.AdresBilgisi.Ulke;

            iletisim.Linkedin = hastaView.IletisimBilgisi.Linkedin;
            iletisim.Facebook = hastaView.IletisimBilgisi.Facebook;
            iletisim.Instagram = hastaView.IletisimBilgisi.Instagram;
            iletisim.Twitter = hastaView.IletisimBilgisi.Twitter;
            iletisim.Email = hastaView.IletisimBilgisi.Email;
            iletisim.TelNo = hastaView.IletisimBilgisi.TelNo;
            iletisim.TelNo2 = hastaView.IletisimBilgisi.TelNo2;

            await _adresService.UpdateAsync(adres);
            await _iletisimService.UpdateAsync(iletisim);
            await _hastaService.UpdateAsync(hasta);

            return true;
        }
    }
}
