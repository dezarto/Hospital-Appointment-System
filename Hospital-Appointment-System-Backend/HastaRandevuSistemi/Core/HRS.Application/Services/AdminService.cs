using AutoMapper;
using HRS.Application.DTOs;
using HRS.Application.Interfaces;
using HRS.Domain.Entities;
using HRS.Domain.Interfaces;

namespace HRS.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IMapper _mapper;
        private readonly IHastaneService _hastaneService;
        private readonly IHastaService _hastaService;
        private readonly IIletisimService _iletisimService;
        private readonly IAdresService _adresService;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IHakkimdaHastaneService _hakkimdaHastaneService;
        private readonly IIlService _ilService;
        private readonly IIlceService _ilceService;
        private readonly IIlIlceService _ilIlceService;
        private readonly IHaberService _haberService;
        private readonly IEtkinlikService _etkinlikService;
        private readonly IDuyuruService _duyuruService;
        private readonly ISliderService _sliderService;
        private readonly IHastaneDuyuruService _hastaneDuyuruService;
        private readonly IHastaneHaberService _hastaneHaberService;
        private readonly IHastaneEtkinlikService _hastaneEtkinlikService;
        private readonly IHastaneSliderService _hastaneSliderService;
        private readonly IHastaneBolumService _hastaneBolumService;
        private readonly IBolumPoliklinikService _bolumPoliklinikService;
        private readonly IBolumService _bolumService;
        private readonly IDoktorService _doktorService;
        private readonly IDoktorUzmanlikService _doktorUzmanlikService;
        private readonly IMesaiService _mesaiService;
        private readonly IDoktorMesaiService _doktorMesaiService;
        private readonly IPoliklinikService _poliklinikService;
        private readonly IRandevuService _randevuService;

        public AdminService(IMapper mapper, IHastaneService hastaneService, IHastaService hastaService, IIletisimService iletisimService, IAdresService adresService, IPasswordHasher passwordHasher, IHakkimdaHastaneService hakkimdaHastaneService, IIlService ilService, IIlceService ilceService, IIlIlceService ilIlceService, IHaberService haberService, IEtkinlikService etkinlikService, IDuyuruService duyuruService, ISliderService sliderService, IHastaneDuyuruService hastaneDuyuruService, IHastaneHaberService hastaneHaberService, IHastaneEtkinlikService hastaneEtkinlikService, IHastaneSliderService hastaneSliderService, IHastaneBolumService hastaneBolumService, IBolumPoliklinikService bolumPoliklinikService, IBolumService bolumService, IDoktorService doktorService, IDoktorUzmanlikService doktorUzmanlikService, IMesaiService mesaiService, IDoktorMesaiService doktorMesaiService, IPoliklinikService poliklinikService, IRandevuService randevuService)
        {
            _mapper = mapper;
            _hastaneService = hastaneService;
            _hastaService = hastaService;
            _iletisimService = iletisimService;
            _adresService = adresService;
            _passwordHasher = passwordHasher;
            _hakkimdaHastaneService = hakkimdaHastaneService;
            _ilService = ilService;
            _ilceService = ilceService;
            _ilIlceService = ilIlceService;
            _haberService = haberService;
            _etkinlikService = etkinlikService;
            _duyuruService = duyuruService;
            _sliderService = sliderService;
            _hastaneDuyuruService = hastaneDuyuruService;
            _hastaneHaberService = hastaneHaberService;
            _hastaneEtkinlikService = hastaneEtkinlikService;
            _hastaneSliderService = hastaneSliderService;
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

        public async Task<bool> AddIlAsync(string ilAdi)
        {
            if (ilAdi == null)
            {
                throw new ArgumentException("İl bilgisi eksik!");
            }

            var mevcutIl = await _ilService.GetByIlNameAsync(ilAdi);
            if (mevcutIl == null)
            {
                mevcutIl = new Il { IlAdi = ilAdi };
                mevcutIl.ID = await _ilService.AddAsync(mevcutIl);
            }

            return true;
        }

        public async Task<bool> AddIlceAsync(string ilceAdi, int ilId)
        {
            var ilceBilgisi = await _ilceService.GetByIlceNameAsync(ilceAdi);

            if (ilceBilgisi == null)
            {
                ilceBilgisi = new Ilce { IlceAdi = ilceAdi };
                ilceBilgisi.ID = await _ilceService.AddAsync(ilceBilgisi);
            }

            bool ililceVarMi = await _ilIlceService.AnyAsync(x => x.Il_ID == ilId && x.Ilce_ID == ilceBilgisi.ID);
            if (!ililceVarMi)
            {
                await _ilIlceService.CustomAddAsync(new IlIlce
                {
                    Il_ID = ilId,
                    Ilce_ID = ilceBilgisi.ID
                });
            }

            return true;
        }

        public async Task<bool> AddNewDuyuru(DuyuruDTO duyuruDTO, int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if(hastane == null)
                return false;

            var newDuyuru = new Duyuru
            {
                Baslik = duyuruDTO.Baslik,
                Icerik = duyuruDTO.Icerik,
                Resim = duyuruDTO.Resim,
                Tarih = DateTime.UtcNow,
            };

            var duyuru = await _duyuruService.AddDuyuruAsync(newDuyuru);

            var newIlıski = new HastaneDuyuru
            {
                Hastane_ID = hastaneId,
                ID_Duyuru = duyuru.ID,
            };

            var succes = await _hastaneDuyuruService.AddHastaneDuyuruAsync(newIlıski);

            if(!succes)
                return false;

            return true;
        }

        public async Task<bool> AddNewEtkinlik(EtkinlikDTO etkinlikDTO, int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null)
                return false;

            var newEtkinlik = new Etkinlik
            {
                Baslik = etkinlikDTO.Baslik,
                Icerik = etkinlikDTO.Icerik,
                Resim = etkinlikDTO.Resim,
                Tarih = DateTime.UtcNow,
            };

            var etkinlik = await _etkinlikService.AddEtkinlikAsync(newEtkinlik);

            var newIlıski = new HastaneEtkinlik
            {
                Hastane_ID = hastaneId,
                Etkinlik_ID = etkinlik.ID,
            };

            var succes = await _hastaneEtkinlikService.AddHastaneEtkinlikAsync(newIlıski);

            if (!succes)
                return false;

            return true;
        }

        public async Task<bool> AddNewHaber(HaberDTO haberDTO, int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null)
                return false;

            var newHaber = new Haber
            {
                Baslik = haberDTO.Baslik,
                Icerik = haberDTO.Icerik,
                Resim = haberDTO.Resim,
                Tarih = DateTime.UtcNow,
            };

            var haber = await _haberService.AddHaberAsync(newHaber);

            var newIlıski = new HastaneHaber
            {
                Hastane_ID = hastaneId,
                Haber_ID = haber.ID,
            };

            var succes = await _hastaneHaberService.AddHastaneHaberAsync(newIlıski);

            if (!succes)
                return false;

            return true;
        }

        public async Task<bool> AddNewHasta(NewHasta newHasta)
        {
            var newIletisim = new Iletisim
            {
                Email = newHasta.Email,
                TelNo = newHasta.TelNo,
                TelNo2 = newHasta.TelNo2,
            };

            var iletisinId = await _iletisimService.AddAsync(newIletisim);

            var newAddress = new Adres
            {
                CaddeSokak = newHasta.CaddeSokak,
                IcKapiNo = newHasta.IcKapiNo,
                DisKapiNo = newHasta.DisKapiNo,
                Mahalle = newHasta.Mahalle,
                Ulke = newHasta.Ulke,
                Ilce_ID = newHasta.Ilce_ID,
                Il_ID = newHasta.Il_ID,
            };

            var adresId = await _adresService.AddAsync(newAddress);

            var hashedPassword = _passwordHasher.HashPassword(newHasta.Sifre);

            var hasta = new Hasta
            {
                AnneAdi = newHasta.AnneAdi,
                BabaAdi = newHasta.BabaAdi,
                Cinsiyet = newHasta.Cinsiyet,
                DogumTarihi = newHasta.DogumTarihi,
                DogumYeri = newHasta.DogumYeri,
                Isim = newHasta.Isim,
                SaglikGecmisi = newHasta.SaglikGecmisi,
                Sifre = hashedPassword,
                Soyisim = newHasta.Soyisim,
                Adres_ID = adresId,
                Iletisim_ID = iletisinId,
                Hasta_TC = newHasta.Hasta_TC,
                Roles = newHasta.Roles,
            };

            await _hastaService.AddAsync(hasta);

            return true;
        }

        public async Task<bool> AddNewHastane(NewHastane newHastane)
        {
            var newAdres = new Adres{
                  CaddeSokak = newHastane.CaddeSokak,
                  DisKapiNo = newHastane.DisKapiNo,
                  IcKapiNo = newHastane.IcKapiNo,
                  Ilce_ID = newHastane.Ilce_ID,
                  Il_ID = newHastane.Il_ID,
                  Mahalle = newHastane.Mahalle,
                  Ulke = newHastane.Ulke,
            };

            var adresId = await _adresService.AddAsync(newAdres);

            var newIletisim = new Iletisim
            {
                Email = newHastane.Email,
                TelNo = newHastane.TelNo,
                TelNo2 = newHastane.TelNo2,
            };

            var iletisimId = await _iletisimService.AddAsync(newIletisim);

            var newHakkimdaHastane = new HakkimdaHastane
            {
                Misyon = newHastane.Misyon,
                Vizyon = newHastane.Vizyon,
            };

            var hakkimdaHastaneId = await _hakkimdaHastaneService.AddAsync(newHakkimdaHastane);

            var newAddHastane = new Hastane
            {
                About_ID = hakkimdaHastaneId,
                Adres_ID = adresId,
                Iletisim_ID = iletisimId,
                Aciklama = newHastane.Aciklama,
                HastaneAdi = newHastane.HastaneAdi,
                YatakKapasitesi = newHastane.YatakKapasitesi,
            };

            await _hastaneService.AddAsync(newAddHastane);

            return true;
        }

        public async Task<bool> DeleteDuyuru(int hastaneId, int duyuruId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if(hastane == null)
                return false;

            var duyuru = await _duyuruService.GetDuyuruByIdAsync(duyuruId);

            if(duyuru == null) return false;

            var success = await _hastaneDuyuruService.DeleteHastaneDuyuruAsync(hastaneId, duyuruId);

            if(!success) return false;

            var successDuyuru = await _duyuruService.DeleteDuyuruAsync(duyuruId);

            if(!successDuyuru) return false;

            return true;
        }

        public async Task<bool> DeleteEtkinlik(int hastaneId, int etkinlikId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null)
                return false;

            var etkinlik = await _etkinlikService.GetEtkinlikByIdAsync(etkinlikId);

            if (etkinlik == null) return false;

            var success = await _hastaneEtkinlikService.DeleteHastaneEtkinlikAsync(hastaneId, etkinlikId);

            if (!success) return false;

            var successEtkinlik = await _etkinlikService.DeleteEtkinlikAsync(etkinlikId);

            if (!successEtkinlik) return false;

            return true;
        }

        public async Task<bool> DeleteHaber(int hastaneId, int haberId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null)
                return false;

            var haber = await _haberService.GetHaberByIdAsync(haberId);

            if (haber == null) return false;

            var success = await _hastaneHaberService.DeleteHastaneHaberAsync(hastaneId, haberId);

            if (!success) return false;

            var successHaber = await _haberService.DeleteHaberAsync(haberId);

            if (!successHaber) return false;

            return true;
        }

        public async Task<bool> DeleteHasta(string hastaTC)
        {
            var hastaExist = await _hastaService.CheckIfHastaExistsAsync(hastaTC);
            if(hastaExist == false) return false;
            var randevular = await _randevuService.GetAllRandevularAsync();

            var filteredRandevular = randevular.Where(r => r.Hasta_TC == hastaTC).ToList();

            foreach (var randevu in filteredRandevular)
            {
                await _randevuService.DeleteRandevuAsync(randevu.RandevuID);
            }

            var hasta = await _hastaService.GetByHastaIdAsync(hastaTC);

            await _hastaService.DeleteAsync(hastaTC);
            await _iletisimService.DeleteAsync(hasta.Iletisim_ID);
            await _adresService.DeleteAsync(hasta.Adres_ID);
            
            return true;
        }

        public async Task<bool> DeleteHastane(int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null || string.IsNullOrEmpty(hastane.HastaneAdi))
                return false;

            var bolumler = await _hastaneBolumService.GetBolumlerByHastaneIdAsync(hastaneId);

            var hastaneDuyurular = await _hastaneDuyuruService.GetDuyurularByHastaneIdAsync(hastaneId);
            var hastaneEtkinlikler = await _hastaneEtkinlikService.GetEtkinliklerByHastaneIdAsync(hastaneId);
            var hastaneHaberler = await _hastaneHaberService.GetHaberlerByHastaneIdAsync(hastaneId);
            var hastaneSlider = await _hastaneSliderService.GetSliderlerByHastaneIdAsync(hastaneId);
            var hakkımdaHastane = await _hakkimdaHastaneService.GetByHakkimdaHastaneIdAsync(hastaneId);

            if (hakkımdaHastane != null)
            {
                await _hakkimdaHastaneService.DeleteAsync(hakkımdaHastane.ID);
            }

            foreach (var duyuru in hastaneDuyurular)
            {
                await _hastaneDuyuruService.DeleteHastaneDuyuruAsync(hastaneId, duyuru.ID_Duyuru);
                await _duyuruService.DeleteDuyuruAsync(duyuru.ID_Duyuru);
            }

            foreach (var etkinlik in hastaneEtkinlikler)
            {
                await _hastaneEtkinlikService.DeleteHastaneEtkinlikAsync(hastaneId, etkinlik.Etkinlik_ID);
                await _etkinlikService.DeleteEtkinlikAsync(etkinlik.Etkinlik_ID);
            }

            foreach (var haber in hastaneHaberler)
            {
                await _hastaneHaberService.DeleteHastaneHaberAsync(hastaneId, haber.Haber_ID);
                await _haberService.DeleteHaberAsync(haber.Haber_ID);
            }

            foreach (var slider in hastaneSlider)
            {
                await _hastaneSliderService.DeleteHastaneSliderAsync(hastaneId, slider.Slider_ID);
                await _sliderService.DeleteSliderAsync(slider.Slider_ID);
            }

            foreach (var bolum in bolumler)
            {
                var bolumBilgisi = await _bolumService.GetBolumByIdAsync(bolum.Bolum_ID);

                var poliklinikler = await _bolumPoliklinikService.GetPolikliniklerByBolumIdAsync(bolum.Bolum_ID);
                var doktorlar = await _doktorService.GetAllDoktorlarAsync();

                var poliklinikIdList = poliklinikler.Select(p => p.Poliklinik_ID).ToList();

                var filterDoktorlar = doktorlar
                    .Where(d => poliklinikIdList.Contains(d.Poliklinik_ID))
                    .ToList();

                var randevular = await _randevuService.GetAllRandevularAsync();
                var filteredRandevular = randevular.Where(r => poliklinikIdList.Contains(r.Poliklinik_ID));
                foreach (var randevu in filteredRandevular)
                {
                    await _randevuService.DeleteRandevuAsync(randevu.RandevuID);
                }

                foreach (var doktor in filterDoktorlar)
                {
                    var doktorMesailer = await _doktorMesaiService.GetMesailerByDoktorIdAsync(doktor.Doktor_TC);

                    foreach (var mesai in doktorMesailer)
                    {
                        await _doktorMesaiService.DeleteDoktorMesaiAsync(doktor.Doktor_TC, mesai.MesaiID);
                        await _mesaiService.DeleteMesaiAsync(mesai.MesaiID);
                    }

                    await _doktorService.DeleteDoktorAsync(doktor.Doktor_TC);
                    await _iletisimService.DeleteAsync(doktor.Iletisim_ID);
                    await _adresService.DeleteAsync(doktor.Adres_ID);
                }

                foreach (var poliklinik in poliklinikler)
                {
                    var poliklinikBilgisi = await _poliklinikService.GetPoliklinikByIdAsync(poliklinik.Poliklinik_ID);

                    await _bolumPoliklinikService.DeleteBolumPoliklinikAsync(bolum.Bolum_ID, poliklinik.Poliklinik_ID);
                    await _poliklinikService.DeletePoliklinikAsync(poliklinik.Poliklinik_ID);

                    if (poliklinikBilgisi != null)
                    {
                        await _iletisimService.DeleteAsync(poliklinikBilgisi.Iletisim_ID);
                        await _adresService.DeleteAsync(poliklinikBilgisi.Adres_ID);
                    }
                }

                await _hastaneBolumService.DeleteHastaneBolumAsync(hastaneId, bolum.Bolum_ID);
                await _bolumService.DeleteBolumAsync(bolum.Bolum_ID);

                if (bolumBilgisi != null)
                {
                    await _iletisimService.DeleteAsync(bolumBilgisi.Iletisim_ID);
                }
            }

            await _hastaneService.DeleteAsync(hastane.ID);
            await _hakkimdaHastaneService.DeleteAsync(hastane.About_ID);
            await _iletisimService.DeleteAsync(hastane.Iletisim_ID);
            await _adresService.DeleteAsync(hastane.Adres_ID);

            return true;
        }

        public async Task<bool> DeleteIlAsync(int ilId)
        {
            // İl, herhangi bir ilçe ile ilişkilendirilmiş mi?
            var ilIlceListesi = await _ilIlceService.CustomGetAllAsync();

            // Silinecek ile bağlı tüm ilçeleri bul ve sil
            var ilceIdsToDelete = ilIlceListesi.Where(x => x.Il_ID == ilId).Select(x => x.Ilce_ID).ToList();
            
            if (ilceIdsToDelete.Any())
            {
                foreach (var ilceId in ilceIdsToDelete)
                {
                    var status = await _ilIlceService.CustomDeleteByIlceIdAsync(ilceId);
                    if (status)
                    {
                        await _ilceService.DeleteAsync(ilceId);  // İlçeyi sil
                    }
                    throw new InvalidOperationException("İlce silinirken hata meydana geldi!");
                }
            }

            // İl kaydını sil
            var il = await _ilService.GetByIlIdAsync(ilId);
            if (il != null)
            {
                await _ilService.DeleteAsync(ilId);  // İl kaydını sil
                return true;  // Silme işlemi başarılı
            }

            return false;  // İl bulunamazsa false döndür
        }

        public async Task<bool> DeleteIlceAsync(int ilceId)
        {
            // İlçe, herhangi bir il ile ilişkilendirilmiş mi?
            var ililceVarMi = await _ilIlceService.AnyAsync(x => x.Ilce_ID == ilceId);
            if (!ililceVarMi)
            {
                throw new InvalidOperationException("Bu ilçe, bir veya daha fazla il ile ilişkilendirildiği için silinemez.");
            }

            // İlçe kaydını sil
            var ilce = await _ilceService.GetByIlceIdAsync(ilceId);
            if (ilce != null)
            {
                var status = await _ilIlceService.CustomDeleteByIlceIdAsync(ilceId);
                if (status)
                {
                    await _ilceService.DeleteAsync(ilceId);
                    return true;
                }
                return false;
            }

            return false;
        }

        public async Task<HakkimdaHastaneDTO> GetAboutUsByHospitalName(int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null)
                return new HakkimdaHastaneDTO();

            var about = await _hakkimdaHastaneService.GetByHakkimdaHastaneIdAsync(hastane.About_ID);

            if (about == null)
                return new HakkimdaHastaneDTO();

            return _mapper.Map<HakkimdaHastaneDTO>(about);
        }

        public async Task<AdresDTO> GetAddressByHastaTC(string hastaTC)
        {
            var hastaExist = await _hastaService.CheckIfHastaExistsAsync(hastaTC);

            if (hastaExist)
            {
                var hasta = await _hastaService.GetByHastaIdAsync(hastaTC);

                var address = await _adresService.GetByAdressIdAsync(hasta.Adres_ID);

                if (address == null)
                    return new AdresDTO();

                return _mapper.Map<AdresDTO>(address);
            }

            return new AdresDTO();
        }

        public async Task<AdresDTO> GetAddressInformationByHospitalId(int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null)
                return new AdresDTO();

            var address = await _adresService.GetByAdressIdAsync(hastane.Adres_ID);

            if (address == null)
                return new AdresDTO();

            return _mapper.Map<AdresDTO>(address);
        }

        public async Task<IEnumerable<HastaDTO>> GetAllHasta()
        {
            return _mapper.Map<IEnumerable<HastaDTO>>(await _hastaService.GetAllAsync());
        }

        public async Task<IletisimDTO> GetCommunicationInformationByHastaTC(string hastaTC)
        {
            var hastaExist = await _hastaService.CheckIfHastaExistsAsync(hastaTC);

            if (hastaExist)
            {
                var hasta = await _hastaService.GetByHastaIdAsync(hastaTC);

                var iletisim = await _iletisimService.GetByIletisimIdAsync(hasta.Iletisim_ID);

                if (iletisim == null)
                    return new IletisimDTO();

                return _mapper.Map<IletisimDTO>(iletisim);
            }

            return new IletisimDTO();
        }

        public async Task<IletisimDTO> GetCommunicationInformationByHospitalId(int HastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(HastaneId);

            if (hastane == null)
                return new IletisimDTO();

            var iletisim = await _iletisimService.GetByIletisimIdAsync(hastane.Iletisim_ID);

            if (iletisim == null)
                return new IletisimDTO();

            return _mapper.Map<IletisimDTO>(iletisim);
        }

        public async Task<DuyuruDTO> GetDuyuruByDuyuruID(int hastaneId, int duyuruId)
        {
            // Hastane bilgilerini al
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            // Eğer hastane bulunmazsa işlem yapılmaz
            if (hastane == null)
                return null;

            // Duyuruyu al
            var duyuru = await _duyuruService.GetDuyuruByIdAsync(duyuruId);

            // Eğer duyuru bulunmazsa işlem yapılmaz
            if (duyuru == null)
                return null;

            // DuyuruDTO'ya dönüştür
            var duyuruDTO = new DuyuruDTO
            {
                ID = duyuru.ID,
                Baslik = duyuru.Baslik,
                Icerik = duyuru.Icerik,
                Tarih = duyuru.Tarih,
                Resim = duyuru.Resim,
            };

            return duyuruDTO;
        }

        public async Task<EtkinlikDTO> GetEtkinlikByEtkinlikID(int hastaneId, int etkinlikId)
        {
            // Hastane bilgilerini al
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            // Eğer hastane bulunmazsa işlem yapılmaz
            if (hastane == null)
                return null;

            // Etkinliği al
            var etkinlik = await _etkinlikService.GetEtkinlikByIdAsync(etkinlikId);

            // Eğer etkinlik bulunmazsa işlem yapılmaz
            if (etkinlik == null)
                return null;

            // EtkinlikDTO'ya dönüştür
            var etkinlikDTO = new EtkinlikDTO
            {
                ID = etkinlik.ID,
                Baslik = etkinlik.Baslik,
                Icerik = etkinlik.Icerik,
                Tarih = etkinlik.Tarih,
                Resim = etkinlik.Resim,
            };

            return etkinlikDTO;
        }

        public async Task<HaberDTO> GetHaberByHaberID(int hastaneId, int haberId)
        {
            // Hastane bilgilerini al
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            // Eğer hastane bulunmazsa işlem yapılmaz
            if (hastane == null)
                return null;

            // Haberi al
            var haber = await _haberService.GetHaberByIdAsync(haberId);

            // Eğer haber bulunmazsa işlem yapılmaz
            if (haber == null)
                return null;

            // HaberDTO'ya dönüştür
            var haberDTO = new HaberDTO
            {
                ID = haber.ID,
                Baslik = haber.Baslik,
                Icerik = haber.Icerik,
                Tarih = haber.Tarih,
                Resim = haber.Resim,
            };

            return haberDTO;
        }

        public async Task<IEnumerable<DuyuruDTO>> GetDuyuruByHastaneID(int hastaneId)
        {
            // Hastane bilgilerini al
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            // Eğer hastane bulunmazsa boş bir liste döndür
            if (hastane == null)
                return Enumerable.Empty<DuyuruDTO>();

            // Hastaneye ait duyuruları al
            var duyurularList = await _hastaneDuyuruService.GetDuyurularByHastaneIdAsync(hastane.ID);

            // Eğer duyuru listesi boşsa, yine boş bir liste döndür
            if (duyurularList == null)
                return Enumerable.Empty<DuyuruDTO>();

            // Duyuruları DTO'ya dönüştür
            var duyuruDTOList = new List<DuyuruDTO>();

            foreach (var item in duyurularList)
            {
                // Duyuru detaylarını al
                var duyuru = await _duyuruService.GetDuyuruByIdAsync(item.ID_Duyuru);

                // Eğer duyuru detayları bulunursa DTO'yu oluştur
                if (duyuru != null)
                {
                    var duyuruDTO = new DuyuruDTO
                    {
                        ID = duyuru.ID,
                        Baslik = duyuru.Baslik,
                        Icerik = duyuru.Icerik,
                        Tarih = duyuru.Tarih,
                        Resim = duyuru.Resim,
                    };

                    // DTO'yu listeye ekle
                    duyuruDTOList.Add(duyuruDTO);
                }
            }

            // Sonuç olarak duyuru DTO'larını döndür
            return duyuruDTOList;
        }

        public async Task<IEnumerable<EtkinlikDTO>> GetEtkinlikByHastaneID(int hastaneId)
        {
            // Hastane bilgilerini al
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            // Eğer hastane bulunmazsa boş bir liste döndür
            if (hastane == null)
                return Enumerable.Empty<EtkinlikDTO>();

            // Hastaneye ait etkinlikleri al
            var etkinliklerList = await _hastaneEtkinlikService.GetEtkinliklerByHastaneIdAsync(hastane.ID);

            // Eğer etkinlik listesi boşsa, yine boş bir liste döndür
            if (etkinliklerList == null)
                return Enumerable.Empty<EtkinlikDTO>();

            // Etkinlikleri DTO'ya dönüştür
            var etkinlikDTOList = new List<EtkinlikDTO>();

            foreach (var item in etkinliklerList)
            {
                // Etkinlik detaylarını al
                var etkinlik = await _etkinlikService.GetEtkinlikByIdAsync(item.Etkinlik_ID);

                // Eğer etkinlik detayları bulunursa DTO'yu oluştur
                if (etkinlik != null)
                {
                    var etkinlikDTO = new EtkinlikDTO
                    {
                        ID = etkinlik.ID,
                        Baslik = etkinlik.Baslik,
                        Icerik = etkinlik.Icerik,
                        Tarih = etkinlik.Tarih,
                        Resim = etkinlik.Resim,
                    };

                    // DTO'yu listeye ekle
                    etkinlikDTOList.Add(etkinlikDTO);
                }
            }

            // Sonuç olarak etkinlik DTO'larını döndür
            return etkinlikDTOList;
        }

        public async Task<IEnumerable<HaberDTO>> GetHaberByHastaneID(int hastaneId)
        {
            // Hastane bilgilerini al
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            // Eğer hastane bulunmazsa boş bir liste döndür
            if (hastane == null)
                return Enumerable.Empty<HaberDTO>();

            // Hastaneye ait haberleri al
            var haberlerList = await _hastaneHaberService.GetHaberlerByHastaneIdAsync(hastane.ID);

            // Eğer haber listesi boşsa, yine boş bir liste döndür
            if (haberlerList == null)
                return Enumerable.Empty<HaberDTO>();

            // Haberleri DTO'ya dönüştür
            var haberDTOList = new List<HaberDTO>();

            foreach (var item in haberlerList)
            {
                // Haber detaylarını al
                var haber = await _haberService.GetHaberByIdAsync(item.Haber_ID);

                // Eğer haber detayları bulunursa DTO'yu oluştur
                if (haber != null)
                {
                    var haberDTO = new HaberDTO
                    {
                        ID = haber.ID,
                        Baslik = haber.Baslik,
                        Icerik = haber.Icerik,
                        Tarih = haber.Tarih,
                        Resim = haber.Resim,
                    };

                    // DTO'yu listeye ekle
                    haberDTOList.Add(haberDTO);
                }
            }

            // Sonuç olarak haber DTO'larını döndür
            return haberDTOList;
        }

        public async Task<HastaDTO> GetHastaInformation(string hastaTC)
        {
            var hastaExist = await _hastaService.CheckIfHastaExistsAsync(hastaTC);

            if (hastaExist)
            {
                var hasta = await _hastaService.GetByHastaIdAsync(hastaTC);

                return _mapper.Map<HastaDTO>(hasta);
            }

            return new HastaDTO();
        }

        public async Task<HastaneDTO> GetHastaneInformationById(int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null)
                return new HastaneDTO();

            return _mapper.Map<HastaneDTO>(hastane);
        }

        public async Task<List<IlveIlceV>> GetIlIlceInformation()
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

        public async Task<bool> UpdateAboutUsByHospitalName(HakkimdaHastaneDTO hakkimdaHastaneDto, int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null)
                return false;

            var aboutUs = await _hakkimdaHastaneService.GetByHakkimdaHastaneIdAsync(hastane.About_ID);

            if (aboutUs == null)
                return false;

            var newAboutUs = new HakkimdaHastane
            {
                Misyon = hakkimdaHastaneDto.Misyon,
                Vizyon = hakkimdaHastaneDto.Vizyon,
                ID = aboutUs.ID,
            };

            await _hakkimdaHastaneService.UpdateAsync(newAboutUs);

            return true;
        }

        public async Task<bool> UpdateAddressByHastaTC(AdresDTO adresDto, string hastaTC)
        {
            var hastaExist = await _hastaService.CheckIfHastaExistsAsync(hastaTC);

            if (hastaExist)
            {
                var hasta = await _hastaService.GetByHastaIdAsync(hastaTC);

                var adres = await _adresService.GetByAdressIdAsync(hasta.Adres_ID);

                if (adres == null)
                    return false;

                var newAdres = new Adres
                {
                    CaddeSokak = adresDto.CaddeSokak,
                    DisKapiNo = adresDto.DisKapiNo,
                    IcKapiNo = adresDto.IcKapiNo,
                    Mahalle = adresDto.Mahalle,
                    Ulke = adresDto.Ulke,
                    Ilce_ID = adresDto.Ilce_ID,
                    Il_ID = adresDto.Il_ID,
                    ID = adres.ID,
                };

                await _adresService.UpdateAsync(newAdres);

                return true;
            }

            return false;
        }

        public async Task<bool> UpdateAddressInformationByHospitalId(AdresDTO adresDto, int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null)
                return false;

            var address = await _adresService.GetByAdressIdAsync(hastane.Adres_ID);

            if (address == null)
                return false;

            var newAddress = new Adres{
                CaddeSokak = adresDto.CaddeSokak,
                DisKapiNo = adresDto.DisKapiNo,
                IcKapiNo = adresDto.IcKapiNo,
                Ilce_ID = adresDto.Ilce_ID,
                Il_ID = adresDto.Il_ID,
                Mahalle = adresDto.Mahalle,
                Ulke = adresDto.Ulke,
                ID = address.ID,
            };

            await _adresService.UpdateAsync(newAddress);

            return true;
        }

        public async Task<bool> UpdateCommunicationInformationByHastaTC(IletisimDTO iletisimDto, string hastaTC)
        {
            var hastaExist = await _hastaService.CheckIfHastaExistsAsync(hastaTC);

            if (hastaExist)
            {
                var hasta = await _hastaService.GetByHastaIdAsync(hastaTC);

                var hastaIletisim = await _iletisimService.GetByIletisimIdAsync(hasta.Iletisim_ID);

                if(hastaIletisim == null)
                {
                    return false;
                }

                var newHastaIletisim = new Iletisim
                {
                    Email = iletisimDto.Email,
                    TelNo = iletisimDto.TelNo,
                    TelNo2 = iletisimDto.TelNo2,
                    ID = hastaIletisim.ID,
                };

                await _iletisimService.UpdateAsync(newHastaIletisim);

                return true;
            }

            return false;
        }

        public async Task<bool> UpdateCommunicationInformationByHospitalId(IletisimDTO iletisimDto, int hospitalId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hospitalId);

            if (hastane == null)
                return false;

            var iletisim = await _iletisimService.GetByIletisimIdAsync(hastane.Iletisim_ID);

            if (iletisim == null)
                return false;

            var newIletisim = new Iletisim
            {
                Email = iletisimDto.Email,
                TelNo = iletisimDto.TelNo,
                TelNo2 = iletisimDto.TelNo2,
                ID = iletisim.ID,
                Facebook = iletisimDto.Facebook,
                Instagram = iletisimDto.Instagram,
                Linkedin = iletisimDto.Linkedin,
                Twitter = iletisimDto.Twitter
            };

            await _iletisimService.UpdateAsync(newIletisim);

            return true;
        }

        public async Task<bool> UpdateDuyuru(DuyuruDTO duyuruDTO, int duyuruId, int hastaneId)
        {
            // Hastane bilgilerini al
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            // Eğer hastane bulunmazsa işlem yapılmaz
            if (hastane == null)
                return false;

            // Güncelleme için duyuru detaylarını al
            var duyuru = await _duyuruService.GetDuyuruByIdAsync(duyuruId);

            // Eğer duyuru bulunmazsa işlem yapılmaz
            if (duyuru == null)
                return false;

            // Duyuruyu güncelle
            duyuru.Baslik = duyuruDTO.Baslik;
            duyuru.Icerik = duyuruDTO.Icerik;
            duyuru.Tarih = duyuruDTO.Tarih;
            duyuru.Resim = duyuruDTO.Resim;

            // Güncellenmiş duyuruyu kaydet
            var result = await _duyuruService.UpdateDuyuruAsync(duyuru);

            return true;
        }

        public async Task<bool> UpdateEtkinlik(EtkinlikDTO etkinlikDTO, int etkinlikId, int hastaneId)
        {
            // Hastane bilgilerini al
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            // Eğer hastane bulunmazsa işlem yapılmaz
            if (hastane == null)
                return false;

            // Güncelleme için etkinlik detaylarını al
            var etkinlik = await _etkinlikService.GetEtkinlikByIdAsync(etkinlikId);

            // Eğer etkinlik bulunmazsa işlem yapılmaz
            if (etkinlik == null)
                return false;

            // Etkinliği güncelle
            etkinlik.Baslik = etkinlikDTO.Baslik;
            etkinlik.Icerik = etkinlikDTO.Icerik;
            etkinlik.Tarih = etkinlikDTO.Tarih;
            etkinlik.Resim = etkinlikDTO.Resim;

            // Güncellenmiş etkinliği kaydet
            var result = await _etkinlikService.UpdateEtkinlikAsync(etkinlik);

            return true;
        }

        public async Task<bool> UpdateHaber(HaberDTO haberDTO, int haberId, int hastaneId)
        {
            // Hastane bilgilerini al
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            // Eğer hastane bulunmazsa işlem yapılmaz
            if (hastane == null)
                return false;

            // Güncelleme için haber detaylarını al
            var haber = await _haberService.GetHaberByIdAsync(haberId);

            // Eğer haber bulunmazsa işlem yapılmaz
            if (haber == null)
                return false;

            // Haberi güncelle
            haber.Baslik = haberDTO.Baslik;
            haber.Icerik = haberDTO.Icerik;
            haber.Tarih = haberDTO.Tarih;
            haber.Resim = haberDTO.Resim;

            // Güncellenmiş haberi kaydet
            var result = await _haberService.UpdateHaberAsync(haber);

            return true;
        }

        public async Task<bool> UpdateHasta(HastaDTO hastaDTO, string hastaTC)
        {
            var hastaExist = await _hastaService.CheckIfHastaExistsAsync(hastaTC);

            if (hastaExist)
            {
                var existHasta = await _hastaService.GetByHastaIdAsync(hastaTC);
                var hasta = _mapper.Map<Hasta>(hastaDTO);

                var newHasta = new Hasta
                {
                    AnneAdi = hasta.AnneAdi,
                    BabaAdi = hasta.BabaAdi,
                    Cinsiyet = hasta.Cinsiyet,
                    DogumYeri = hasta.DogumYeri,
                    DogumTarihi = hasta.DogumTarihi,
                    Isim = hasta.Isim,
                    Roles = hasta.Roles,
                    SaglikGecmisi = hasta.SaglikGecmisi,
                    Sifre = existHasta.Sifre,
                    Soyisim = hasta.Soyisim,
                    Adres_ID = existHasta.Adres_ID,
                    Hasta_TC = existHasta.Hasta_TC,
                    Iletisim_ID = existHasta.Iletisim_ID,
                };

                await _hastaService.UpdateAsync(newHasta);

                return true;
            }

            return false;
        }

        public async Task<bool> UpdateHastane(HastaneDTO hastaneDto, int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            var newHastane = new Hastane
            {
                HastaneAdi = hastaneDto.HastaneAdi,
                About_ID = hastane.About_ID,
                Adres_ID = hastane.Adres_ID,
                ID = hastane.ID,
                Aciklama = hastaneDto.Aciklama,
                Iletisim_ID = hastane.Iletisim_ID,
                YatakKapasitesi = hastaneDto.YatakKapasitesi
            };

            await _hastaneService.UpdateAsync(newHastane);

            return true;
        }

        public async Task<bool> UpdateIlAsync(int ilId, string yeniIlAdi)
        {
            var mevcutIl = await _ilService.GetByIlIdAsync(ilId);
            if (mevcutIl != null)
            {
                mevcutIl.IlAdi = yeniIlAdi;
                await _ilService.UpdateAsync(mevcutIl);
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateIlceAsync(int ilceId, string yeniIlceAdi)
        {
            var mevcutIlce = await _ilceService.GetByIlceIdAsync(ilceId);
            if (mevcutIlce != null)
            {
                mevcutIlce.IlceAdi = yeniIlceAdi;
                await _ilceService.UpdateAsync(mevcutIlce);
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<SliderDTO>> GetSliderByHastaneID(int hastaneId)
        {
            // Hastane bilgilerini al
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            // Eğer hastane bulunmazsa boş bir liste döndür
            if (hastane == null)
                return Enumerable.Empty<SliderDTO>();

            // Hastaneye ait sliderleri al
            var sliderList = await _hastaneSliderService.GetSliderlerByHastaneIdAsync(hastane.ID);

            // Eğer slider listesi boşsa, yine boş bir liste döndür
            if (sliderList == null)
                return Enumerable.Empty<SliderDTO>();

            // sliderleri DTO'ya dönüştür
            var sliderDTOList = new List<SliderDTO>();

            foreach (var item in sliderList)
            {
                // slider detaylarını al
                var slider = await _sliderService.GetSliderByIdAsync(item.Slider_ID);

                // Eğer duyuru detayları bulunursa DTO'yu oluştur
                if (slider != null)
                {
                    var sliderDTO = new SliderDTO
                    {
                        ID = slider.ID,
                        Resim = slider.Resim,
                        SlideBaslik = slider.SlideBaslik,
                    };

                    // DTO'yu listeye ekle
                    sliderDTOList.Add(sliderDTO);
                }
            }

            // Sonuç olarak duyuru DTO'larını döndür
            return sliderDTOList;
        }

        public async Task<SliderDTO> GetSliderBySliderID(int hastaneId, int sliderId)
        {
            // Hastane bilgilerini al
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            // Eğer hastane bulunmazsa işlem yapılmaz
            if (hastane == null)
                return null;

            // slideri al
            var slider = await _sliderService.GetSliderByIdAsync(sliderId);

            // Eğer slider bulunmazsa işlem yapılmaz
            if (slider == null)
                return null;

            // DuyuruDTO'ya dönüştür
            var sliderDTO = new SliderDTO
            {
                ID = slider.ID,
                Resim = slider.Resim,
                SlideBaslik = slider.SlideBaslik,
            };

            return sliderDTO;
        }

        public async Task<bool> AddNewSlider(SliderDTO sliderDTO, int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null)
                return false;

            var newSlider = new Slider
            {
                ID = sliderDTO.ID,
                SlideBaslik = sliderDTO.SlideBaslik,
                Resim = sliderDTO.Resim,
            };

            var slider = await _sliderService.AddSliderAsync(newSlider);

            var newIlıski = new HastaneSlider
            {
                Hastane_ID = hastaneId,
                Slider_ID = slider.ID,
            };

            var succes = await _hastaneSliderService.AddHastaneSliderAsync(newIlıski);

            if (!succes)
                return false;

            return true;
        }

        public async Task<bool> DeleteSlider(int hastaneId, int sliderId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null)
                return false;

            var slider = await _sliderService.GetSliderByIdAsync(sliderId);

            if (slider == null) return false;

            var success = await _hastaneSliderService.DeleteHastaneSliderAsync(hastaneId, sliderId);

            if (!success) return false;

            var successSlider = await _sliderService.DeleteSliderAsync(sliderId);

            if (!successSlider) return false;

            return true;
        }

        public async Task<bool> UpdateSlider(SliderDTO sliderDTO, int sliderId, int hastaneId)
        {
            // Hastane bilgilerini al
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            // Eğer hastane bulunmazsa işlem yapılmaz
            if (hastane == null)
                return false;

            // Güncelleme için slider detaylarını al
            var slider = await _sliderService.GetSliderByIdAsync(sliderId);

            // Eğer duyuru bulunmazsa işlem yapılmaz
            if (slider == null)
                return false;

            // slideri güncelle
            slider.SlideBaslik = sliderDTO.SlideBaslik;
            slider.Resim = sliderDTO.Resim;

            // Güncellenmiş slideri kaydet
            var result = await _sliderService.UpdateSliderAsync(slider);

            return true;
        }

        public async Task<List<AddNewDoktor>> GetDoktorsByHastaneID(int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);
            if (hastane == null) throw new ArgumentNullException(nameof(hastane), "Hastane bilgisi boş olamaz.");

            var hastaneBolumler = await _hastaneBolumService.GetBolumlerByHastaneIdAsync(hastaneId);
            var doktorListesi = new List<AddNewDoktor>();

            foreach (var bolum in hastaneBolumler)
            {
                var tumPoliklinikler = await _bolumPoliklinikService.GetPolikliniklerByBolumIdAsync(bolum.Bolum_ID);

                foreach (var poliklinik in tumPoliklinikler)
                {
                    var tumDoktorlar = await _doktorService.GetAllDoktorlarAsync();
                    var eslesenDoktorlar = tumDoktorlar.Where(d => d.Poliklinik_ID == poliklinik.Poliklinik_ID).ToList();

                    foreach (var doktor in eslesenDoktorlar)
                    {
                        var adres = await _adresService.GetByAdressIdAsync(doktor.Adres_ID);
                        var iletisim = await _iletisimService.GetByIletisimIdAsync(doktor.Iletisim_ID);

                        doktorListesi.Add(new AddNewDoktor
                        {
                            DoktorBilgisi = new DoktorDTO
                            {
                                Doktor_TC = doktor.Doktor_TC,
                                Isim = doktor.Isim,
                                Soyisim = doktor.Soyisim,
                                Poliklinik_ID = doktor.Poliklinik_ID,
                                Cinsiyet = doktor.Cinsiyet,
                                Iletisim_ID = doktor.Iletisim_ID,
                                Adres_ID = doktor.Adres_ID,
                                Uzmanlik_ID = doktor.Uzmanlik_ID,
                            },
                            AdresBilgisi = new AdresDTO
                            {
                                ID = adres.ID,
                                Il_ID = adres.Il_ID,
                                Ilce_ID = adres.Ilce_ID,
                                CaddeSokak = adres.CaddeSokak,
                                DisKapiNo = adres.DisKapiNo,
                                IcKapiNo = adres.IcKapiNo,
                                Mahalle = adres.Mahalle,
                                Ulke = adres.Ulke,
                            },
                            IletisimBilgisi = new IletisimDTO
                            {
                                ID = iletisim.ID,
                                Email = iletisim.Email,
                                Facebook = iletisim.Facebook,
                                Instagram = iletisim.Instagram,
                                Twitter = iletisim.Twitter,
                                Linkedin = iletisim.Linkedin,
                                TelNo = iletisim.TelNo,
                                TelNo2 = iletisim.TelNo2,
                            }
                        });
                    }
                }
            }

            return doktorListesi;
        }

        public async Task<List<AddNewDoktor>> GetDoktorsByPoliklinikID(int poliklinikId)
        {
            var poliklinik = await _poliklinikService.GetPoliklinikByIdAsync(poliklinikId);
            if (poliklinik == null)
                throw new ArgumentNullException(nameof(poliklinik), "Poliklinik bulunamadı!");

            var tumDoktorlar = await _doktorService.GetAllDoktorlarAsync();
            var eslesenDoktorlar = tumDoktorlar.Where(d => d.Poliklinik_ID == poliklinikId).ToList();

            var doktorListesi = new List<AddNewDoktor>();

            foreach (var doktor in eslesenDoktorlar)
            {
                var adres = await _adresService.GetByAdressIdAsync(doktor.Adres_ID);
                var iletisim = await _iletisimService.GetByIletisimIdAsync(doktor.Iletisim_ID);

                doktorListesi.Add(new AddNewDoktor
                {
                    DoktorBilgisi = new DoktorDTO
                    {
                        Doktor_TC = doktor.Doktor_TC,
                        Isim = doktor.Isim,
                        Soyisim = doktor.Soyisim,
                        Poliklinik_ID = doktor.Poliklinik_ID,
                        Cinsiyet = doktor.Cinsiyet,
                        Iletisim_ID = doktor.Iletisim_ID,
                        Adres_ID = doktor.Adres_ID,
                        Uzmanlik_ID = doktor.Uzmanlik_ID,
                    },
                    AdresBilgisi = new AdresDTO
                    {
                        ID = adres.ID,
                        Il_ID = adres.Il_ID,
                        Ilce_ID = adres.Ilce_ID,
                        CaddeSokak = adres.CaddeSokak,
                        DisKapiNo = adres.DisKapiNo,
                        IcKapiNo = adres.IcKapiNo,
                        Mahalle = adres.Mahalle,
                        Ulke = adres.Ulke,
                    },
                    IletisimBilgisi = new IletisimDTO
                    {
                        ID = iletisim.ID,
                        Email = iletisim.Email,
                        Facebook = iletisim.Facebook,
                        Instagram = iletisim.Instagram,
                        Twitter = iletisim.Twitter,
                        Linkedin = iletisim.Linkedin,
                        TelNo = iletisim.TelNo,
                        TelNo2 = iletisim.TelNo2,
                    }
                });
            }

            return doktorListesi;
        }

        public async Task<bool> AddNewDoktor(AddNewDoktor addNewDoktor, int hastaneId, int poliklinikId)
        {
            var doktor = await _doktorService.GetDoktorByTCAsync(addNewDoktor.DoktorBilgisi.Doktor_TC);

            if (doktor != null) throw new ArgumentNullException(nameof(doktor), "Zaten doktor var!!");

            var newAdres = new AdresDTO
            {
                CaddeSokak = addNewDoktor.AdresBilgisi.CaddeSokak,
                DisKapiNo = addNewDoktor.AdresBilgisi.DisKapiNo,
                IcKapiNo = addNewDoktor.AdresBilgisi.IcKapiNo,
                Ilce_ID = addNewDoktor.AdresBilgisi.Ilce_ID,
                Il_ID = addNewDoktor.AdresBilgisi.Il_ID,
                Mahalle = addNewDoktor.AdresBilgisi.Mahalle,
                Ulke = addNewDoktor.AdresBilgisi.Ulke,
            };

            var adresId = await _adresService.AddAsync(_mapper.Map<Adres>(newAdres));

            var newIletisim = new IletisimDTO
            {
                Email = addNewDoktor.IletisimBilgisi.Email,
                Facebook = addNewDoktor.IletisimBilgisi.Facebook,
                Instagram = addNewDoktor.IletisimBilgisi.Instagram,
                Linkedin = addNewDoktor.IletisimBilgisi.Linkedin,
                TelNo = addNewDoktor.IletisimBilgisi.TelNo,
                TelNo2 = addNewDoktor.IletisimBilgisi.TelNo2,
                Twitter = addNewDoktor.IletisimBilgisi.Twitter,
            };

            var iletisimId = await _iletisimService.AddAsync(_mapper.Map<Iletisim>(newIletisim));
            var sifreHash = _passwordHasher.HashPassword(addNewDoktor.DoktorBilgisi.Sifre);

            var newDoktor = new DoktorDTO
            {
                Adres_ID = adresId,
                Iletisim_ID = iletisimId,
                Cinsiyet = addNewDoktor.DoktorBilgisi.Cinsiyet,
                Doktor_TC = addNewDoktor.DoktorBilgisi.Doktor_TC,
                Isim = addNewDoktor.DoktorBilgisi.Isim,
                Sifre = sifreHash,
                Soyisim = addNewDoktor.DoktorBilgisi.Soyisim,
                Uzmanlik_ID = addNewDoktor.DoktorBilgisi.Uzmanlik_ID,
                Poliklinik_ID = addNewDoktor.DoktorBilgisi.Poliklinik_ID,
            };

            await _doktorService.AddDoktorAsync(_mapper.Map<Domain.Entities.Doktor>(newDoktor));

            return true;
        }

        public async Task<bool> DeleteDoktor(string doktorTC)
        {
            var doktor = await _doktorService.GetDoktorByTCAsync(doktorTC);

            if(doktor == null) throw new ArgumentNullException(nameof(doktor), "Doktor bulunamadı!");

            var doktorMesailer = await _doktorMesaiService.GetMesailerByDoktorIdAsync(doktorTC);
            var randevular = await _randevuService.GetAllRandevularAsync();
            var randevularFiltered = randevular.Where(r => r.Doktor_TC == doktorTC).ToList();

            foreach (var randevu in randevularFiltered)
            {
                await _randevuService.DeleteRandevuAsync(randevu.RandevuID);
            }

            foreach (var mesai in doktorMesailer)
            {
                await _doktorMesaiService.DeleteDoktorMesaiAsync(doktorTC, mesai.MesaiID);
                await _mesaiService.DeleteMesaiAsync(mesai.MesaiID);
            }

            await _doktorService.DeleteDoktorAsync(doktorTC);
            await _iletisimService.DeleteAsync(doktor.Iletisim_ID);
            await _adresService.DeleteAsync(doktor.Adres_ID);

            return true;
        }

        public async Task<bool> UpdateDoktor(AddNewDoktor addNewDoktor, string doktorTC)
        {
            var doktor = await _doktorService.GetDoktorByTCAsync(doktorTC);

            if (doktor == null) throw new ArgumentNullException(nameof(doktor), "Doktor bulunamadı!");

            var newAdres = new AdresDTO
            {
                ID = addNewDoktor.AdresBilgisi.ID,
                CaddeSokak = addNewDoktor.AdresBilgisi.CaddeSokak,
                DisKapiNo = addNewDoktor.AdresBilgisi.DisKapiNo,
                IcKapiNo = addNewDoktor.AdresBilgisi.IcKapiNo,
                Ilce_ID = addNewDoktor.AdresBilgisi.Ilce_ID,
                Il_ID = addNewDoktor.AdresBilgisi.Il_ID,
                Mahalle = addNewDoktor.AdresBilgisi.Mahalle,
                Ulke = addNewDoktor.AdresBilgisi.Ulke,
            };

            await _adresService.UpdateAsync(_mapper.Map<Adres>(newAdres));

            var newIletisim = new IletisimDTO
            {
                ID = addNewDoktor.IletisimBilgisi.ID,
                Email = addNewDoktor.IletisimBilgisi.Email,
                Facebook = addNewDoktor.IletisimBilgisi.Facebook,
                Instagram = addNewDoktor.IletisimBilgisi.Instagram,
                Linkedin = addNewDoktor.IletisimBilgisi.Linkedin,
                TelNo = addNewDoktor.IletisimBilgisi.TelNo,
                TelNo2 = addNewDoktor.IletisimBilgisi.TelNo2,
                Twitter = addNewDoktor.IletisimBilgisi.Twitter,
            };

            await _iletisimService.UpdateAsync(_mapper.Map<Iletisim>(newIletisim));
            var sifreHash = _passwordHasher.HashPassword(addNewDoktor.DoktorBilgisi.Sifre);

            var newDoktor = new DoktorDTO
            {
                Adres_ID = addNewDoktor.DoktorBilgisi.Adres_ID,
                Iletisim_ID = addNewDoktor.DoktorBilgisi.Iletisim_ID,
                Cinsiyet = addNewDoktor.DoktorBilgisi.Cinsiyet,
                Doktor_TC = addNewDoktor.DoktorBilgisi.Doktor_TC,
                Isim = addNewDoktor.DoktorBilgisi.Isim,
                Sifre = sifreHash,
                Soyisim = addNewDoktor.DoktorBilgisi.Soyisim,
                Uzmanlik_ID = addNewDoktor.DoktorBilgisi.Uzmanlik_ID,
                Poliklinik_ID = addNewDoktor.DoktorBilgisi.Poliklinik_ID,
            };

            await _doktorService.UpdateDoktorAsync(_mapper.Map<Domain.Entities.Doktor>(newDoktor));

            return true;
        }

        public async Task<List<MesaiDTO>> GetMesailerByHastaneAndDoktorID(int hastaneId, string doktorTC)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);
            if(hastane == null) throw new ArgumentNullException(nameof(hastane), "Hastane bulunamadı!");

            var doktor = await _doktorService.GetDoktorByTCAsync(doktorTC);
            if (doktor == null) throw new ArgumentNullException(nameof(doktor), "Doktor bulunamadı!");

            var doktorMesaiListesi = await _doktorMesaiService.GetMesailerByDoktorIdAsync(doktorTC);

            var newMesaiListesi = new List<MesaiDTO>();

            foreach (var mesai in doktorMesaiListesi)
            {
                var mesaiBilgisi = await _mesaiService.GetMesaiByIdAsync(mesai.MesaiID);

                newMesaiListesi.Add(_mapper.Map<MesaiDTO>(mesaiBilgisi));
            }

            return newMesaiListesi;
        }

        public async Task<bool> AddNewDoktorMesai(MesaiDTO mesaiDTO, string doktorTC)
        {
            var doktor = await _doktorService.GetDoktorByTCAsync(doktorTC);
            if (doktor == null) throw new ArgumentNullException(nameof(doktor), "Doktor bulunamadı!");

            // Başlangıç saati ve bitiş saati arasındaki farkı hesapla
            var currentTime = mesaiDTO.BaslangicSaati;
            var endTime = mesaiDTO.BitisSaati;

            // 15 dakikalık dilimler ile döngü başlat
            while (currentTime < endTime)
            {
                // 15 dakikalık dilimi kaydet
                var newMesaiEntry = new MesaiDTO
                {
                    Aktif = true,
                    Tarih = mesaiDTO.Tarih,
                    BaslangicSaati = currentTime,
                    BitisSaati = currentTime.Add(TimeSpan.FromMinutes(15))
                };

                // Yeni mesai kaydını ekle
                var newMesai = await _mesaiService.AddMesaiAsync(_mapper.Map<Mesai>(newMesaiEntry));

                // Doktor ile mesai ilişkisini ekle
                var newIlıski = new DTOs.DoktorMesai
                {
                    Doktor_TC = doktorTC,
                    MesaiID = newMesai.MesaiID,
                };

                // İlişkili kaydı ekle
                await _doktorMesaiService.AddDoktorMesaiAsync(_mapper.Map<Domain.Entities.DoktorMesai>(newIlıski));

                // 15 dakika ilerle
                currentTime = currentTime.Add(TimeSpan.FromMinutes(15));
            }

            return true;
        }

        public async Task<bool> DeleteDoktorAllMesai(int hastaneId, string doktorTC)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);
            if (hastane == null) throw new ArgumentNullException(nameof(hastane), "Hastane bulunamadı!");
            
            var doktor = await _doktorService.GetDoktorByTCAsync(doktorTC);
            if (doktor == null) throw new ArgumentNullException(nameof(doktor), "Doktor bulunamadı!");

            var doktorMesailer = await _doktorMesaiService.GetMesailerByDoktorIdAsync(doktorTC);

            foreach (var mesai in doktorMesailer)
            {
                await _doktorMesaiService.DeleteDoktorMesaiAsync(doktorTC, mesai.MesaiID);
                await _mesaiService.DeleteMesaiAsync(mesai.MesaiID);
            }

            return true;
        }

        public async Task<bool> DeleteDoktorMesaiByMesaiID(int hastaneId, string doktorTC, int mesaiId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);
            if (hastane == null) throw new ArgumentNullException(nameof(hastane), "Hastane bulunamadı!");

            var doktor = await _doktorService.GetDoktorByTCAsync(doktorTC);
            if (doktor == null) throw new ArgumentNullException(nameof(doktor), "Doktor bulunamadı!");

            await _doktorMesaiService.DeleteDoktorMesaiAsync(doktorTC, mesaiId);
            await _mesaiService.DeleteMesaiAsync(mesaiId);

            return true;
        }

        public async Task<List<RandevuBilgisiV>> GetRandevularByHastaneID(int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if(hastane == null) throw new ArgumentNullException(nameof(hastane), "Hastane bulunamadı!");

            var bolumler = await _hastaneBolumService.GetBolumlerByHastaneIdAsync(hastaneId);
            var randevular = await _randevuService.GetAllRandevularAsync();

            var randevuListesi = new List<RandevuBilgisiV>();

            foreach (var bolum in bolumler)
            {
                var poliklinikler = await _bolumPoliklinikService.GetPolikliniklerByBolumIdAsync(bolum.Bolum_ID);

                foreach (var poliklinik in poliklinikler)
                {
                    foreach (var randevu in randevular)
                    {
                        if(randevu.Poliklinik_ID == poliklinik.Poliklinik_ID)
                        {
                            var doktor = await _doktorService.GetDoktorByTCAsync(randevu.Doktor_TC);
                            var hasta = await _hastaService.GetByHastaIdAsync(randevu.Hasta_TC);
                            var randevuDetay = await _randevuService.GetRandevuByIdAsync(randevu.RandevuID);
                            
                            var newRandevuBilgisi = new RandevuBilgisiV
                            {
                                Doktor = _mapper.Map<DoktorDTO>(doktor),
                                Hasta = _mapper.Map<HastaDTO>(hasta),
                                RandevuID = randevu.RandevuID,
                                RandevuDetay = _mapper.Map<RandevuDTO>(randevuDetay),
                            };

                            randevuListesi.Add(newRandevuBilgisi);
                        }
                    }
                }
            }

            return randevuListesi;
        }

        public async Task<bool> DeleteRandevuByRandevuID(int randevuId)
        {
            var randevu = await _randevuService.GetRandevuByIdAsync(randevuId);

            if(randevu == null) throw new ArgumentNullException(nameof(randevu), "Randevu bulunamadı!");

            await _randevuService.DeleteRandevuAsync(randevuId);

            return true;
        }

        public async Task<List<AddNewBolum>> GetBolumlerByHastaneID(int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null) throw new ArgumentNullException(nameof(hastane), "Hastane bulunamadı!");

            var hastaneBolumler = await _hastaneBolumService.GetBolumlerByHastaneIdAsync(hastaneId);

            var newBolumlerListe = new List<AddNewBolum>();

            foreach (var bolum in hastaneBolumler)
            {
                var bolumBilgisi = await _bolumService.GetBolumByIdAsync(bolum.Bolum_ID);

                var newBolumBilgisi = new BolumDTO
                {
                    BolumID = bolum.Bolum_ID,
                    BolumAdi = bolumBilgisi.BolumAdi,
                    BolumAciklama = bolumBilgisi.BolumAciklama,
                    Iletisim_ID = bolumBilgisi.Iletisim_ID
                };

                var iletisim = await _iletisimService.GetByIletisimIdAsync(bolumBilgisi.Iletisim_ID);

                var newIletisim = new IletisimDTO
                {
                    ID = iletisim.ID,
                    Email = iletisim.Email,
                    Facebook = iletisim.Facebook,
                    Instagram = iletisim.Instagram,
                    Linkedin = iletisim.Linkedin,
                    Twitter = iletisim.Twitter,
                    TelNo = iletisim.TelNo,
                    TelNo2 = iletisim.TelNo2,
                };

                newBolumlerListe.Add(new AddNewBolum
                {
                    BolumBilgisi = newBolumBilgisi,
                    IletisimBilgisi = newIletisim
                });
            }

            return newBolumlerListe;
        }

        public async Task<bool> AddNewBolum(AddNewBolum addNewBolum, int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if(hastane == null) throw new ArgumentNullException(nameof(hastane), "Hastane bulunamadı!");

            var newIletisim = new IletisimDTO
            {
                Email = addNewBolum.IletisimBilgisi.Email,
                Facebook = addNewBolum.IletisimBilgisi.Facebook,
                Instagram = addNewBolum.IletisimBilgisi.Instagram,
                Linkedin = addNewBolum.IletisimBilgisi.Linkedin,
                Twitter = addNewBolum.IletisimBilgisi.Twitter,
                TelNo = addNewBolum.IletisimBilgisi.TelNo,
                TelNo2 = addNewBolum.IletisimBilgisi.TelNo2,
            };

            var addIletisimId = await _iletisimService.AddAsync(_mapper.Map<Domain.Entities.Iletisim>(newIletisim));

            var newBolum = new BolumDTO
            {
                BolumAdi = addNewBolum.BolumBilgisi.BolumAdi,
                BolumAciklama = addNewBolum.BolumBilgisi.BolumAciklama,
                Iletisim_ID = addIletisimId,
            };

            var bolum = await _bolumService.AddBolumAsync(_mapper.Map<Domain.Entities.Bolum>(newBolum));

            var newIlıski = new HastaneBolum
            {
                Bolum_ID = bolum.BolumID,
                Hastane_ID = hastaneId,
            };

            var success = await _hastaneBolumService.AddHastaneBolumAsync(newIlıski);

            if (success)
            {
                return true;
            }

            return false;
        }

        public async Task<bool> DeleteBolum(int hastaneId, int bolumId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if(hastane == null) throw new ArgumentNullException(nameof(hastane), "Hastane bulunamadı!");

            var bolum = await _bolumService.GetBolumByIdAsync(bolumId);

            if (bolum == null) throw new ArgumentNullException(nameof(hastane), "Bolum bulunamadı!");

            await _hastaneBolumService.DeleteHastaneBolumAsync(hastaneId, bolumId);
            await _bolumService.DeleteBolumAsync(bolumId);
            await _iletisimService.DeleteAsync(bolum.Iletisim_ID);

            return true;
        }

        public async Task<bool> UpdateBolum(AddNewBolum addNewBolum, int bolumId, int hastaneId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null) throw new ArgumentNullException(nameof(hastane), "Hastane bulunamadı!");

            var bolum = await _bolumService.GetBolumByIdAsync(bolumId);

            if (bolum == null) throw new ArgumentNullException(nameof(hastane), "Bolum bulunamadı!");

            var newBolum = new BolumDTO
            {
                BolumID = addNewBolum.BolumBilgisi.BolumID,
                BolumAdi = addNewBolum.BolumBilgisi.BolumAdi,
                BolumAciklama = addNewBolum.BolumBilgisi.BolumAciklama,
                Iletisim_ID = addNewBolum.BolumBilgisi.Iletisim_ID
            };

            await _bolumService.UpdateBolumAsync(_mapper.Map<Domain.Entities.Bolum>(newBolum));

            var newIletisim = new IletisimDTO
            {
                ID = addNewBolum.IletisimBilgisi.ID,
                Email = addNewBolum.IletisimBilgisi.Email,
                Facebook = addNewBolum.IletisimBilgisi.Facebook,
                Instagram = addNewBolum.IletisimBilgisi.Instagram,
                Linkedin = addNewBolum.IletisimBilgisi.Linkedin,
                Twitter = addNewBolum.IletisimBilgisi.Twitter,
                TelNo = addNewBolum.IletisimBilgisi.TelNo,
                TelNo2 = addNewBolum.IletisimBilgisi.TelNo2,
            };

            await _iletisimService.UpdateAsync(_mapper.Map<Domain.Entities.Iletisim>(newIletisim));

            return true;
        }

        public async Task<bool> AddNewPoliklinik(AddNewPoliklinik addNewPoliklinik, int hastaneId, int bolumId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null) throw new ArgumentNullException(nameof(hastane), "Hastane bulunamadı!");

            var newIletisim = new IletisimDTO
            {
                Email = addNewPoliklinik.IletisimBilgisi.Email,
                Facebook = addNewPoliklinik.IletisimBilgisi.Facebook,
                Instagram = addNewPoliklinik.IletisimBilgisi.Instagram,
                Linkedin = addNewPoliklinik.IletisimBilgisi.Linkedin,
                Twitter = addNewPoliklinik.IletisimBilgisi.Twitter,
                TelNo = addNewPoliklinik.IletisimBilgisi.TelNo,
                TelNo2 = addNewPoliklinik.IletisimBilgisi.TelNo2,
            };

            var addIletisimId = await _iletisimService.AddAsync(_mapper.Map<Iletisim>(newIletisim));

            var newAdres = new AdresDTO
            {
                CaddeSokak = addNewPoliklinik.AdresBilgisi.CaddeSokak,
                DisKapiNo = addNewPoliklinik.AdresBilgisi.DisKapiNo,
                IcKapiNo = addNewPoliklinik.AdresBilgisi.IcKapiNo,
                Mahalle = addNewPoliklinik.AdresBilgisi.Mahalle,
                Ulke = addNewPoliklinik.AdresBilgisi.Ulke,
                Ilce_ID = addNewPoliklinik.AdresBilgisi.Ilce_ID,
                Il_ID = addNewPoliklinik.AdresBilgisi.Il_ID,
            };

            var addAddressId = await _adresService.AddAsync(_mapper.Map<Adres>(newAdres));

            var newPoliklinik = new PoliklinikDTO
            {
                PoliklinikAdi = addNewPoliklinik.PoliklinikBilgisi.PoliklinikAdi,
                Iletisim_ID = addIletisimId,
                Adres_ID = addAddressId,
            };

            var poliklinik = await _poliklinikService.AddPoliklinikAsync(_mapper.Map<Domain.Entities.Poliklinik>(newPoliklinik));

            var newIlıski = new BolumPoliklinik
            {
                Bolum_ID = bolumId,
                Poliklinik_ID = poliklinik.PoliklinikID,
            };

            var success = await _bolumPoliklinikService.AddBolumPoliklinikAsync(newIlıski);

            if (success)
            {
                return true;
            }

            return false;
        }

        public async Task<bool> DeletePoliklinik(int hastaneId, int poliklinikId, int bolumId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null) throw new ArgumentNullException(nameof(hastane), "Hastane bulunamadı!");

            var bolum = await _bolumService.GetBolumByIdAsync(bolumId);

            if (bolum == null) throw new ArgumentNullException(nameof(bolum), "Bolum bulunamadı!");

            var poliklinik = await _poliklinikService.GetPoliklinikByIdAsync(poliklinikId);

            if (poliklinik == null) throw new ArgumentNullException(nameof(poliklinik), "Poliklinik bulunamadı!");

            await _bolumPoliklinikService.DeleteBolumPoliklinikAsync(bolumId, poliklinikId);
            await _poliklinikService.DeletePoliklinikAsync(poliklinikId);
            await _adresService.DeleteAsync(poliklinik.Adres_ID);
            await _iletisimService.DeleteAsync(poliklinik.Iletisim_ID);

            return true;
        }

        public async Task<bool> UpdatePoliklinik(AddNewPoliklinik addNewPoliklinik, int poliklinikId)
        {
            var poliklinik = await _poliklinikService.GetPoliklinikByIdAsync(poliklinikId);

            if (poliklinik == null) throw new ArgumentNullException(nameof(poliklinik), "Poliklinik bulunamadı!");

            var newIletisim = new IletisimDTO
            {
                ID = poliklinik.Iletisim_ID,
                Email = addNewPoliklinik.IletisimBilgisi.Email,
                Facebook = addNewPoliklinik.IletisimBilgisi.Facebook,
                Instagram = addNewPoliklinik.IletisimBilgisi.Instagram,
                Linkedin = addNewPoliklinik.IletisimBilgisi.Linkedin,
                Twitter = addNewPoliklinik.IletisimBilgisi.Twitter,
                TelNo = addNewPoliklinik.IletisimBilgisi.TelNo,
                TelNo2 = addNewPoliklinik.IletisimBilgisi.TelNo2,
            };

            await _iletisimService.UpdateAsync(_mapper.Map<Iletisim>(newIletisim));

            var newAdres = new AdresDTO
            {
                ID = poliklinik.Adres_ID,
                CaddeSokak = addNewPoliklinik.AdresBilgisi.CaddeSokak,
                DisKapiNo = addNewPoliklinik.AdresBilgisi.DisKapiNo,
                IcKapiNo = addNewPoliklinik.AdresBilgisi.IcKapiNo,
                Mahalle = addNewPoliklinik.AdresBilgisi.Mahalle,
                Ulke = addNewPoliklinik.AdresBilgisi.Ulke,
                Ilce_ID = addNewPoliklinik.AdresBilgisi.Ilce_ID,
                Il_ID = addNewPoliklinik.AdresBilgisi.Il_ID,
            };

            await _adresService.UpdateAsync(_mapper.Map<Adres>(newAdres));

            var newPoliklinik = new PoliklinikDTO
            {
                PoliklinikAdi = addNewPoliklinik.PoliklinikBilgisi.PoliklinikAdi,
                PoliklinikID = poliklinik.PoliklinikID,
                Iletisim_ID = poliklinik.Iletisim_ID,
                Adres_ID = poliklinik.Adres_ID,
            };

            await _poliklinikService.UpdatePoliklinikAsync(_mapper.Map<Domain.Entities.Poliklinik>(newPoliklinik));

            return true;
        }

        public async Task<List<AddNewPoliklinik>> GetPolikliniklerByHastaneID(int hastaneId, int bolumId)
        {
            var hastane = await _hastaneService.GetByHastaneIdAsync(hastaneId);

            if (hastane == null) throw new ArgumentNullException(nameof(hastane), "Hastane bulunamadı!");

            var bolum = await _bolumService.GetBolumByIdAsync(bolumId);

            if (bolum == null) throw new ArgumentNullException(nameof(bolum), "Bolum bulunamadı!");

            var newAddNewPoliklinikList = new List<AddNewPoliklinik>();

            var bolumPoliklinikler = await _bolumPoliklinikService.GetPolikliniklerByBolumIdAsync(bolumId);

            foreach (var poliklinik in bolumPoliklinikler)
            {
                var poliklinikBilgisi = await _poliklinikService.GetPoliklinikByIdAsync(poliklinik.Poliklinik_ID);

                var newPoliklinik = new PoliklinikDTO
                {
                    PoliklinikAdi = poliklinikBilgisi.PoliklinikAdi,
                    PoliklinikID = poliklinikBilgisi.PoliklinikID,
                    Adres_ID = poliklinikBilgisi.Adres_ID,
                    Iletisim_ID = poliklinikBilgisi.Iletisim_ID
                };

                var adres = await _adresService.GetByAdressIdAsync(poliklinikBilgisi.Adres_ID);
                var iletisim = await _iletisimService.GetByIletisimIdAsync(poliklinikBilgisi.Iletisim_ID);

                var newAddNewPoliklinik = new AddNewPoliklinik
                {
                    PoliklinikBilgisi = newPoliklinik,
                    AdresBilgisi = new AdresDTO
                    {
                        CaddeSokak = adres.CaddeSokak,
                        DisKapiNo = adres.DisKapiNo,
                        IcKapiNo = adres.IcKapiNo,
                        Ilce_ID = adres.Ilce_ID,
                        Il_ID = adres.Il_ID,
                        Mahalle = adres.Mahalle,
                        Ulke = adres.Ulke
                    },
                    IletisimBilgisi = new IletisimDTO
                    {
                        Email = iletisim.Email,
                        Facebook = iletisim.Facebook,
                        ID = iletisim.ID,
                        Instagram = iletisim.Instagram,
                        Linkedin = iletisim.Linkedin,
                        TelNo = iletisim.TelNo,
                        TelNo2 = iletisim.TelNo2,
                        Twitter = iletisim.Twitter,
                    }
                };

                newAddNewPoliklinikList.Add(newAddNewPoliklinik);
            }

            return newAddNewPoliklinikList;
        }
    }
}
