using AutoMapper;
using HRS.Application.DTOs;
using HRS.Application.Interfaces;
using HRS.Domain.Interfaces;

namespace HRS.Application.Services
{
    public class DoktorApplicationService : IDoktorApplicationService
    {
        private readonly IMapper _mapper;
        private readonly IDoktorService _doktorService;
        private readonly IIletisimService _iletisimService;
        private readonly IAdresService _addressService;
        private readonly IPoliklinikService _poliklinikService;
        private readonly IHastaneService _hastaneService;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IMesaiService _mesaiService;
        private readonly IDoktorMesaiService _doktorMesaiService;
        private readonly IRandevuService _randevuService;
        private readonly IHastaService _hastaService;
        private readonly IDoktorUzmanlikService _doktorUzmanlikService;

        public DoktorApplicationService(IMapper mapper, IDoktorService doktorService, IIletisimService iletisimService, IAdresService addressService, IPoliklinikService poliklinikService, IHastaneService hastaneService, IPasswordHasher passwordHasher, IMesaiService mesaiService, IDoktorMesaiService doktorMesaiService, IRandevuService randevuService, IHastaService hastaService, IDoktorUzmanlikService doktorUzmanlikService)
        {
            _mapper = mapper;
            _doktorService = doktorService;
            _iletisimService = iletisimService;
            _addressService = addressService;
            _poliklinikService = poliklinikService;
            _hastaneService = hastaneService;
            _passwordHasher = passwordHasher;
            _mesaiService = mesaiService;
            _doktorMesaiService = doktorMesaiService;
            _randevuService = randevuService;
            _hastaService = hastaService;
            _doktorUzmanlikService = doktorUzmanlikService;
        }

        public async Task<DoktorView> GetDoktorDatas(string doktorTC)
        {
            var doktor = await _doktorService.GetDoktorByTCAsync(doktorTC);

            if (doktor == null) throw new ArgumentNullException(nameof(doktor), "Doktor bulunamadı!");

            var adres = await _addressService.GetByAdressIdAsync(doktor.Adres_ID);
            var iletisim = await _iletisimService.GetByIletisimIdAsync(doktor.Iletisim_ID);
            var uzmanlik = await _doktorUzmanlikService.GetDoktorUzmanlikByIdAsync(doktor.Uzmanlik_ID);
            var poliklinik = await _poliklinikService.GetPoliklinikByIdAsync(doktor.Poliklinik_ID);

            var newDoktorV = new DoktorV
            {
                Doktor_TC = doktorTC,
                Cinsiyet = doktor.Cinsiyet,
                Isim = doktor.Isim,
                Soyisim = doktor.Soyisim,
                Sifre = doktor.Sifre,
                UzmanlikAdi = uzmanlik.UzmanlikAdi,
                PoliklinikAdi = poliklinik.PoliklinikAdi,
            };

            var newAddNewDoktor = new DoktorView
            { 
                DoktorBilgisi = newDoktorV,
                AdresBilgisi = _mapper.Map<AdresDTO>(adres),
                IletisimBilgisi = _mapper.Map<IletisimDTO>(iletisim)
            };

            return newAddNewDoktor;
        }

        public async Task<List<MesaiDTO>> GetMesaiDatas(string doktorTC)
        {
            var doktor = await _doktorService.GetDoktorByTCAsync(doktorTC);

            if (doktor == null) throw new ArgumentNullException(nameof(doktor), "Doktor bulunamadı!");

            var doktorMesailer = await _doktorMesaiService.GetMesailerByDoktorIdAsync(doktorTC);

            var newMesaiListesi = new List<MesaiDTO>();

            foreach (var mesai in doktorMesailer)
            {
                var mesaiBilgisi = await _mesaiService.GetMesaiByIdAsync(mesai.MesaiID);

                var newMesai = new MesaiDTO
                {
                    MesaiID = mesaiBilgisi.MesaiID,
                    Aktif = mesaiBilgisi.Aktif,
                    BaslangicSaati = mesaiBilgisi.BaslangicSaati,
                    BitisSaati = mesaiBilgisi.BitisSaati,
                    Tarih = mesaiBilgisi.Tarih
                };

                newMesaiListesi.Add(newMesai);
            }

            return newMesaiListesi;
        }

        public async Task<RandevuBilgisiV> GetRandevuDetayi(string doktorTC, int RandevuID)
        {
            var doktor = await _doktorService.GetDoktorByTCAsync(doktorTC);
            if (doktor == null) throw new ArgumentNullException(nameof(doktor), "Doktor bulunamadı!");

            var randevu = await _randevuService.GetRandevuByIdAsync(RandevuID);
            if (randevu == null) throw new ArgumentNullException(nameof(randevu), "Randevu bulunamadı!");

            var hasta = await _hastaService.GetByHastaIdAsync(randevu.Hasta_TC);
            if (hasta == null) throw new ArgumentNullException(nameof(hasta), "Hasta bulunamadı!");

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
                    BabaAdi = hasta.BabaAdi,
                    AnneAdi = hasta.AnneAdi,
                    Cinsiyet = hasta.Cinsiyet,
                    DogumYeri = hasta.DogumYeri,
                    DogumTarihi = hasta.DogumTarihi,
                    SaglikGecmisi = hasta.SaglikGecmisi,
                    Adres_ID = hasta.Adres_ID,
                    Iletisim_ID = hasta.Iletisim_ID,
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

        public async Task<bool> UpdateRandevuDetayi(string doktorTC, int RandevuID, string randevuNotu)
        {
            var doktor = await _doktorService.GetDoktorByTCAsync(doktorTC);
            if (doktor == null) throw new ArgumentNullException(nameof(doktor), "Doktor bulunamadı!");

            var randevu = await _randevuService.GetRandevuByIdAsync(RandevuID);
            if (randevu == null) throw new ArgumentNullException(nameof(randevu), "Randevu bulunamadı!");

            randevu.RandevuNotu = randevuNotu;

            await _randevuService.UpdateRandevuAsync(randevu);

            return true;
        }

        public async Task<List<RandevuBilgisiV>> GetRandevuListesi(string doktorTC)
        {
            var doktor = await _doktorService.GetDoktorByTCAsync(doktorTC);
            if (doktor == null) throw new ArgumentNullException(nameof(doktor), "Doktor bulunamadı!");

            var randevular = await _randevuService.GetAllRandevularAsync();

            // Belirtilen DoktorTC'ye uyan randevuları filtrele
            var doktorRandevulari = randevular.Where(r => r.Doktor_TC == doktorTC).ToList();

            // Randevuları DTO nesnesine çevirerek listeye ekle
            var randevuListesi = new List<RandevuBilgisiV>();

            foreach (var randevu in doktorRandevulari)
            {
                var hasta = await _hastaService.GetByHastaIdAsync(randevu.Hasta_TC);

                randevuListesi.Add(new RandevuBilgisiV
                {
                    RandevuID = randevu.RandevuID,
                    Doktor = new DoktorDTO
                    {
                        Doktor_TC = doktor.Doktor_TC,
                        Isim = doktor.Isim,
                        Soyisim = doktor.Soyisim
                    },
                    Hasta = new HastaDTO
                    {
                        Hasta_TC = hasta.Hasta_TC,
                        Isim = hasta.Isim,
                        Soyisim = hasta.Soyisim
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
                });
            }

            return randevuListesi;
        }

        public async Task<bool> UpdateDoktorDatas(string doktorTC, DoktorView doktorView)
        {
            var doktor = await _doktorService.GetDoktorByTCAsync(doktorTC);

            if (doktor == null) throw new ArgumentNullException(nameof(doktor), "Doktor bulunamadı!");

            var adres = await _addressService.GetByAdressIdAsync(doktor.Adres_ID);
            var iletisim = await _iletisimService.GetByIletisimIdAsync(doktor.Iletisim_ID);

            doktor.Isim = doktorView.DoktorBilgisi.Isim;
            doktor.Soyisim = doktorView.DoktorBilgisi.Soyisim;
            doktor.Cinsiyet = doktorView.DoktorBilgisi.Cinsiyet;
            adres.Mahalle = doktorView.AdresBilgisi.Mahalle;
            adres.CaddeSokak = doktorView.AdresBilgisi.CaddeSokak;
            adres.DisKapiNo = doktorView.AdresBilgisi.DisKapiNo;
            adres.IcKapiNo = doktorView.AdresBilgisi.IcKapiNo;
            adres.Il_ID = doktorView.AdresBilgisi.Il_ID;
            adres.Ilce_ID = doktorView.AdresBilgisi.Ilce_ID;
            iletisim.Linkedin = doktorView.IletisimBilgisi.Linkedin;
            iletisim.Facebook = doktorView.IletisimBilgisi.Facebook;
            iletisim.Instagram = doktorView.IletisimBilgisi.Instagram;
            iletisim.Twitter = doktorView.IletisimBilgisi.Twitter;
            iletisim.Email = doktorView.IletisimBilgisi.Email;
            iletisim.TelNo = doktorView.IletisimBilgisi.TelNo;
            iletisim.TelNo2 = doktorView.IletisimBilgisi.TelNo2;

            await _addressService.UpdateAsync(adres);
            await _iletisimService.UpdateAsync(iletisim);
            await _doktorService.UpdateDoktorAsync(doktor);

            return true;
        }
    }
}
