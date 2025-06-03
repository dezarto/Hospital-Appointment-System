using HRS.Application.DTOs;
using HRS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUnAuthService _unAuthService;
        private readonly IAdminService _adminService;

        public AdminController(IUnAuthService unAuthService, IAdminService adminService)
        {
            _unAuthService = unAuthService;
            _adminService = adminService;
        }

        /*Hastane endpointleri*/
        [HttpGet("get-all-hastane")]
        public async Task<IActionResult> GetAllHastaneAdi()
        {
            var result = await _unAuthService.GetAllHastaneAsync();

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastaneler bulunamadı.");
        }

        [HttpPost("add-new-hastane")]
        public async Task<IActionResult> PostAddNewHastane(NewHastane newHastane)
        {
            var result = await _adminService.AddNewHastane(newHastane);

            if (result)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastaneler bulunamadı.");
        }

        [HttpDelete("delete-hastane/{hastaneId}")]
        public async Task<IActionResult> DeleteHastaneByHastaneId(int hastaneId)
        {
            var result = await _adminService.DeleteHastane(hastaneId);

            if (result)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastaneler bulunamadı.");
        }

        [HttpPut("update-hastane/{hastaneId}")]
        public async Task<IActionResult> UpdateHastaneByHastaneId(HastaneDTO hastaneDTO, int hastaneId)
        {
            var result = await _adminService.UpdateHastane(hastaneDTO, hastaneId);

            if (result)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastaneler bulunamadı.");
        }

        [HttpGet("get-hastane-by-id/{hastaneId}")]
        public async Task<IActionResult> GetByHastaneAdi(int hastaneId)
        {
            var result = await _adminService.GetHastaneInformationById(hastaneId);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Belirtilen hastane bulunamadı.");
        }

        [HttpGet("get-communication-info-by-hastane-id/{hastaneId}")]
        public async Task<IActionResult> GetCommunicationInfoByHastaneId(int hastaneId)
        {
            var result = await _adminService.GetCommunicationInformationByHospitalId(hastaneId);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Belirtilen hastane bulunamadı.");
        }

        [HttpPut("put-update-communication-info-by-hastane-id/{hastaneId}")]
        public async Task<IActionResult> PutCommunicationInfoByHastaneId(IletisimDTO iletisimDto, int hastaneId)
        {
            var result = await _adminService.UpdateCommunicationInformationByHospitalId(iletisimDto, hastaneId);

            if (result)
            {
                return Ok(result);
            }

            return NotFound("Belirtilen hastane bulunamadı.");
        }

        [HttpGet("get-about-us-by-hastane-name/{hastaneId}")]
        public async Task<IActionResult> GetByMissionVisionHastaneAdi(int hastaneId)
        {
            var result = await _adminService.GetAboutUsByHospitalName(hastaneId);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Belirtilen hastane bulunamadı.");
        }

        [HttpPut("update-about-us-by-hastane-id/{hastaneId}")]
        public async Task<IActionResult> GetByMissionVisionHastaneAdi(HakkimdaHastaneDTO hakkimdaHastaneDTO, int hastaneId)
        {
            var result = await _adminService.UpdateAboutUsByHospitalName(hakkimdaHastaneDTO, hastaneId);

            if (result)
            {
                return Ok(result);
            }

            return NotFound("Belirtilen hastane bulunamadı.");
        }

        [HttpGet("get-address-by-hastane-id/{hastaneId}")]
        public async Task<IActionResult> GetAddressByHastaneId(int hastaneId)
        {
            var result = await _adminService.GetAddressInformationByHospitalId(hastaneId);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Belirtilen hastane adresi bulunamadı.");
        }

        [HttpPut("update-address-by-hastane-id/{hastaneId}")]
        public async Task<IActionResult> GetByMissionVisionHastaneAdi(AdresDTO adresDTO, int hastaneId)
        {
            var result = await _adminService.UpdateAddressInformationByHospitalId(adresDTO, hastaneId);

            if (result)
            {
                return Ok(result);
            }

            return NotFound("Belirtilen hastane bulunamadı.");
        }

        /********Hasta Enpointleri********/
        [HttpGet("get-all-hasta")]
        public async Task<IActionResult> GetAllHasta()
        {
            var result = await _adminService.GetAllHasta();

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastalar getirilirken bir sorun olustu!");
        }

        [HttpPost("add-new-hasta")]
        public async Task<IActionResult> PostAddNewHasta(NewHasta newHasta)
        {
            var result = await _adminService.AddNewHasta(newHasta);

            if (result)
            {
                return Ok(result);
            }

            return NotFound("Hasta kaydı yapılırken bir sorun oluştu.");
        }

        [HttpGet("get-hasta-by-tc-number/{hastaTC}")]
        public async Task<IActionResult> GetHastaByTCNumber(string hastaTC)
        {
            if (string.IsNullOrWhiteSpace(hastaTC))
            {
                return BadRequest("Hasta TC numarası boş olamaz!");
            }

            var result = await _adminService.GetHastaInformation(hastaTC);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hasta aranırken bir sorun olustu!");
        }

        [HttpDelete("delete-hasta-by-tc-number/{hastaTC}")]
        public async Task<IActionResult> DeleteHastaByTCNumber(string hastaTC)
        {
            if (string.IsNullOrWhiteSpace(hastaTC))
            {
                return BadRequest("Hasta TC numarası boş olamaz!");
            }

            var result = await _adminService.DeleteHasta(hastaTC);

            if (result)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hasta silinirken bir sorun olustu!");
        }

        [HttpPut("update-hasta-information-by-hasta-tc-number/{hastaTC}")]
        public async Task<IActionResult> PutUpdateHastaInformationByHastaTCNumber(HastaDTO hastaDTO, string hastaTC)
        {
            if (string.IsNullOrWhiteSpace(hastaTC))
            {
                return BadRequest("Hasta TC numarası boş olamaz!");
            }

            var result = await _adminService.UpdateHasta(hastaDTO, hastaTC);

            if (result)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hasta silinirken bir sorun olustu!");
        }

        [HttpGet("get-communication-information-by-hasta-tc-number/{hastaTC}")]
        public async Task<IActionResult> GetCommunicationInformationByHastaTCNumber(string hastaTC)
        {
            if (string.IsNullOrWhiteSpace(hastaTC))
            {
                return BadRequest("Hasta TC numarası boş olamaz!");
            }

            var result = await _adminService.GetCommunicationInformationByHastaTC(hastaTC);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastalar getirilirken bir sorun olustu!");
        }

        [HttpPut("update-communication-information-by-hasta-tc-number/{hastaTC}")]
        public async Task<IActionResult> PutCommunicationInformationByHastaTCNumber(IletisimDTO iletisimDto , string hastaTC)
        {
            if (string.IsNullOrWhiteSpace(hastaTC))
            {
                return BadRequest("Hasta TC numarası boş olamaz!");
            }

            var result = await _adminService.UpdateCommunicationInformationByHastaTC(iletisimDto, hastaTC);

            if (result)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastalar getirilirken bir sorun olustu!");
        }

        [HttpGet("get-address-information-by-hasta-tc-number/{hastaTC}")]
        public async Task<IActionResult> GetAddressInformationByHastaTCNumber(string hastaTC)
        {
            if (string.IsNullOrWhiteSpace(hastaTC))
            {
                return BadRequest("Hasta TC numarası boş olamaz!");
            }

            var result = await _adminService.GetAddressByHastaTC(hastaTC);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastalar getirilirken bir sorun olustu!");
        }

        [HttpPut("update-address-information-by-hasta-tc-number/{hastaTC}")]
        public async Task<IActionResult> PutAddressInformationByHastaTCNumber(AdresDTO adresDto, string hastaTC)
        {
            if (string.IsNullOrWhiteSpace(hastaTC))
            {
                return BadRequest("Hasta TC numarası boş olamaz!");
            }

            var result = await _adminService.UpdateAddressByHastaTC(adresDto, hastaTC);

            if (result)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastalar getirilirken bir sorun olustu!");
        }

        /*******Il ve Ilce Endpointleri*******/
        [HttpGet("get-il-ilce-information")]
        public async Task<IActionResult> GetIlIlceInformation()
        {
            var result = await _adminService.GetIlIlceInformation();

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastalar getirilirken bir sorun olustu!");
        }

        [HttpPost("add-il/{ilAdi}")]
        public async Task<IActionResult> AddIl(string ilAdi)
        {
            var result = await _adminService.AddIlAsync(ilAdi);

            if (result)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastalar getirilirken bir sorun olustu!");
        }

        [HttpPost("add-ilce/{ilId}/{ilceAdi}")]
        public async Task<IActionResult> AddIlce(int ilId, string ilceAdi)
        {
            var result = await _adminService.AddIlceAsync(ilceAdi, ilId);

            if (result)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastalar getirilirken bir sorun olustu!");
        }

        [HttpDelete("delete-il/{ilId}")]
        public async Task<IActionResult> DeleteIl(int ilId)
        {
            var result = await _adminService.DeleteIlAsync(ilId);

            if (result)
            {
                return Ok("İl başarıyla silindi.");
            }

            return NotFound("İl bulunamadı veya silinemedi.");
        }

        [HttpDelete("delete-ilce/{ilceId}")]
        public async Task<IActionResult> DeleteIlce(int ilceId)
        {
            var result = await _adminService.DeleteIlceAsync(ilceId);

            if (result)
            {
                return Ok("İlçe başarıyla silindi.");
            }

            return NotFound("İlçe bulunamadı veya silinemedi.");
        }

        [HttpPut("update-il/{ilId}/{yeniIlAdi}")]
        public async Task<IActionResult> UpdateIl(int ilId, string yeniIlAdi)
        {
            var result = await _adminService.UpdateIlAsync(ilId, yeniIlAdi);

            if (result)
            {
                return Ok("İl başarıyla güncellendi.");
            }

            return NotFound("İl bulunamadı veya güncellenemedi.");
        }

        [HttpPut("update-ilce/{ilceId}/{yeniIlceAdi}")]
        public async Task<IActionResult> UpdateIlce(int ilceId, string yeniIlceAdi)
        {
            var result = await _adminService.UpdateIlceAsync(ilceId, yeniIlceAdi);

            if (result)
            {
                return Ok("İlçe başarıyla güncellendi.");
            }

            return NotFound("İlçe bulunamadı veya güncellenemedi.");
        }

        [HttpGet("get-all-duyuru-by-hastane-id/{hastaneId}")]
        public async Task<IActionResult> GetDuyuruByHastaneID(int hastaneId)
        {
            var duyurular = await _adminService.GetDuyuruByHastaneID(hastaneId);
            return Ok(duyurular);
        }

        [HttpGet("get-duyuru-by-id/{hastaneId}/{duyuruId}")]
        public async Task<IActionResult> GetDuyuruByDuyuruID(int hastaneId, int duyuruId)
        {
            var duyuru = await _adminService.GetDuyuruByDuyuruID(hastaneId, duyuruId);
            if (duyuru == null)
                return NotFound("Duyuru bulunamadı.");
            return Ok(duyuru);
        }

        [HttpPost("add-duyuru/{hastaneId}")]
        public async Task<IActionResult> AddNewDuyuru(DuyuruDTO duyuruDTO, int hastaneId)
        {
            var result = await _adminService.AddNewDuyuru(duyuruDTO, hastaneId);
            if (result)
                return Ok();
            return BadRequest("Duyuru eklenemedi.");
        }

        [HttpDelete("delete-duyuru/{hastaneId}/{duyuruId}")]
        public async Task<IActionResult> DeleteDuyuru(int hastaneId, int duyuruId)
        {
            var result = await _adminService.DeleteDuyuru(hastaneId, duyuruId);
            if (result)
                return Ok();
            return BadRequest("Duyuru silinemedi.");
        }

        [HttpPut("update-duyuru/{hastaneId}/{duyuruId}")]
        public async Task<IActionResult> UpdateDuyuru(DuyuruDTO duyuruDTO, int duyuruId, int hastaneId)
        {
            var result = await _adminService.UpdateDuyuru(duyuruDTO, duyuruId, hastaneId);
            if (result)
                return Ok();
            return BadRequest("Duyuru güncellenemedi.");
        }

        [HttpGet("get-all-haber-by-hastane-id/{hastaneId}")]
        public async Task<IActionResult> GetHaberByHastaneID(int hastaneId)
        {
            var haberler = await _adminService.GetHaberByHastaneID(hastaneId);
            return Ok(haberler);
        }

        [HttpGet("get-haber-by-id/{hastaneId}/{haberId}")]
        public async Task<IActionResult> GetHaberByHaberID(int hastaneId, int haberId)
        {
            var haber = await _adminService.GetHaberByHaberID(hastaneId, haberId);
            if (haber == null)
                return NotFound("Haber bulunamadı.");
            return Ok(haber);
        }

        [HttpPost("add-haber/{hastaneId}")]
        public async Task<IActionResult> AddNewHaber(HaberDTO haberDTO, int hastaneId)
        {
            var result = await _adminService.AddNewHaber(haberDTO, hastaneId);
            if (result)
                return Ok();
            return BadRequest("Haber eklenemedi.");
        }

        [HttpDelete("delete-haber/{hastaneId}/{haberId}")]
        public async Task<IActionResult> DeleteHaber(int hastaneId, int haberId)
        {
            var result = await _adminService.DeleteHaber(hastaneId, haberId);
            if (result)
                return Ok();
            return BadRequest("Haber silinemedi.");
        }

        [HttpPut("update-haber/{hastaneId}/{haberId}")]
        public async Task<IActionResult> UpdateHaber(HaberDTO haberDTO, int hastaneId, int haberId)
        {
            var result = await _adminService.UpdateHaber(haberDTO, haberId, hastaneId);
            if (result)
                return Ok();
            return BadRequest("Haber güncellenemedi.");
        }

        [HttpGet("get-all-etkinlik-by-hastane-id/{hastaneId}")]
        public async Task<IActionResult> GetEtkinlikByHastaneID(int hastaneId)
        {
            var etkinlikler = await _adminService.GetEtkinlikByHastaneID(hastaneId);
            return Ok(etkinlikler);
        }

        [HttpGet("get-etkinlik-by-id/{hastaneId}/{etkinlikId}")]
        public async Task<IActionResult> GetEtkinlikByEtkinlikID(int hastaneId, int etkinlikId)
        {
            var etkinlik = await _adminService.GetEtkinlikByEtkinlikID(hastaneId, etkinlikId);
            if (etkinlik == null)
                return NotFound("Etkinlik bulunamadı.");
            return Ok(etkinlik);
        }

        [HttpPost("add-etkinlik/{hastaneId}")]
        public async Task<IActionResult> AddNewEtkinlik(EtkinlikDTO etkinlikDTO, int hastaneId)
        {
            var result = await _adminService.AddNewEtkinlik(etkinlikDTO, hastaneId);
            if (result)
                return Ok();
            return BadRequest("Etkinlik eklenemedi.");
        }

        [HttpDelete("delete-etkinlik/{hastaneId}/{etkinlikId}")]
        public async Task<IActionResult> DeleteEtkinlik(int hastaneId, int etkinlikId)
        {
            var result = await _adminService.DeleteEtkinlik(hastaneId, etkinlikId);
            if (result)
                return Ok();
            return BadRequest("Etkinlik silinemedi.");
        }

        [HttpPut("update-etkinlik/{hastaneId}/{etkinlikId}")]
        public async Task<IActionResult> UpdateEtkinlik(EtkinlikDTO etkinlikDTO, int hastaneId, int etkinlikId)
        {
            var result = await _adminService.UpdateEtkinlik(etkinlikDTO, etkinlikId, hastaneId);
            if (result)
                return Ok();
            return BadRequest("Etkinlik güncellenemedi.");
        }

        [HttpGet("get-all-slider-by-hastane-id/{hastaneId}")]
        public async Task<IActionResult> GetSliderByHastaneID(int hastaneId)
        {
            var sliderler = await _adminService.GetSliderByHastaneID(hastaneId);
            return Ok(sliderler);
        }

        [HttpGet("get-slider-by-id/{hastaneId}/{sliderId}")]
        public async Task<IActionResult> GetSliderByDuyuruID(int hastaneId, int sliderId)
        {
            var slider = await _adminService.GetSliderBySliderID(hastaneId, sliderId);
            if (slider == null)
                return NotFound("slider bulunamadı.");
            return Ok(slider);
        }

        [HttpPost("add-slider/{hastaneId}")]
        public async Task<IActionResult> AddNewSlider(SliderDTO sliderDTO, int hastaneId)
        {
            var result = await _adminService.AddNewSlider(sliderDTO, hastaneId);
            if (result)
                return Ok();
            return BadRequest("slider eklenemedi.");
        }

        [HttpDelete("delete-slider/{hastaneId}/{sliderId}")]
        public async Task<IActionResult> DeleteSlider(int hastaneId, int sliderId)
        {
            var result = await _adminService.DeleteSlider(hastaneId, sliderId);
            if (result)
                return Ok();
            return BadRequest("slider silinemedi.");
        }

        [HttpPut("update-slider/{hastaneId}/{sliderId}")]
        public async Task<IActionResult> UpdateDuyuru(SliderDTO sliderDTO, int sliderId, int hastaneId)
        {
            var result = await _adminService.UpdateSlider(sliderDTO, sliderId, hastaneId);
            if (result)
                return Ok();
            return BadRequest("Duyuru güncellenemedi.");
        }

        /*Yeni ALAN*/
        // Hastane doktor işlemleri
        [HttpGet("doktorlar/{hastaneId}")]
        public async Task<IActionResult> GetDoktorsByHastaneID(int hastaneId)
        {
            var doktorlar = await _adminService.GetDoktorsByHastaneID(hastaneId);
            return Ok(doktorlar);
        }

        [HttpGet("poliklinik-doktorlar/{poliklinikId}")]
        public async Task<IActionResult> GetDoktorsByPoliklinikID(int poliklinikId)
        {
            var doktorlar = await _adminService.GetDoktorsByPoliklinikID(poliklinikId);
            return Ok(doktorlar);
        }

        [HttpPost("add-doktor/{hastaneId}/{poliklinikId}")]
        public async Task<IActionResult> AddNewDoktor([FromBody] AddNewDoktor doktorBilgisi, int hastaneId, int poliklinikId)
        {
            var result = await _adminService.AddNewDoktor(doktorBilgisi, hastaneId, poliklinikId);
            return result ? Ok() : BadRequest();
        }

        [HttpDelete("delete-doktor/{doktorTC}")]
        public async Task<IActionResult> DeleteDoktor(string doktorTC)
        {
            var result = await _adminService.DeleteDoktor(doktorTC);
            return result ? Ok() : BadRequest();
        }

        [HttpPut("update-doktor/{doktorTC}")]
        public async Task<IActionResult> UpdateDoktor([FromBody] AddNewDoktor doktorBilgisi, string doktorTC)
        {
            var result = await _adminService.UpdateDoktor(doktorBilgisi, doktorTC);
            return result ? Ok() : BadRequest();
        }

        // Doktor mesai işlemleri
        [HttpGet("get-mesailer-by-doktor-tc/{hastaneId}/{doktorTC}")]
        public async Task<IActionResult> AddNewDoktorMesai(int hastaneId, string doktorTC)
        {
            var result = await _adminService.GetMesailerByHastaneAndDoktorID(hastaneId, doktorTC);
            return Ok(result);
        }

        [HttpPost("add-doktor/{doktorTC}/mesai")]
        public async Task<IActionResult> AddNewDoktorMesai([FromBody] MesaiDTO mesaiDTO, string doktorTC)
        {
            var result = await _adminService.AddNewDoktorMesai(mesaiDTO, doktorTC);
            return result ? Ok() : BadRequest();
        }

        [HttpDelete("delete-all-mesai-by-doktor/{hastaneId}/{doktorTC}/mesai")]
        public async Task<IActionResult> DeleteDoktorAllMesai(int hastaneId, string doktorTC)
        {
            var result = await _adminService.DeleteDoktorAllMesai(hastaneId, doktorTC);
            return result ? Ok() : BadRequest();
        }

        [HttpDelete("delete-mesai-by-doktor/{hastaneId}/{doktorTC}/{mesaiId}/mesai")]
        public async Task<IActionResult> DeleteDoktorMesai(int hastaneId, string doktorTC, int mesaiId)
        {
            var result = await _adminService.DeleteDoktorMesaiByMesaiID(hastaneId, doktorTC, mesaiId);
            return result ? Ok() : BadRequest();
        }

        // Hastane randevuları
        [HttpGet("randevular/{hastaneId}")]
        public async Task<IActionResult> GetRandevularByHastaneID(int hastaneId)
        {
            var randevular = await _adminService.GetRandevularByHastaneID(hastaneId);
            return Ok(randevular);
        }

        // Hastane randevu silme
        [HttpDelete("delete-randevu/{randevuId}")]
        public async Task<IActionResult> DeleteRandevuByRandevuID(int randevuId)
        {
            var success = await _adminService.DeleteRandevuByRandevuID(randevuId);

            if(success)
                return Ok();

            return BadRequest();
        }

        // Bölüm işlemleri
        [HttpGet("bolumler/{hastaneId}")]
        public async Task<IActionResult> GetBolumlerByHastaneID(int hastaneId)
        {
            var bolumler = await _adminService.GetBolumlerByHastaneID(hastaneId);
            return Ok(bolumler);
        }

        [HttpPost("add-bolum/{hastaneId}")]
        public async Task<IActionResult> AddNewBolum([FromBody] AddNewBolum bolumDTO, int hastaneId)
        {
            var result = await _adminService.AddNewBolum(bolumDTO, hastaneId);
            return result ? Ok() : BadRequest();
        }

        [HttpDelete("delete-bolum/{hastaneId}/{bolumId}")]
        public async Task<IActionResult> DeleteBolum(int hastaneId, int bolumId)
        {
            var result = await _adminService.DeleteBolum(hastaneId, bolumId);
            return result ? Ok() : BadRequest();
        }

        [HttpPut("update-bolum/{hastaneId}/{bolumId}")]
        public async Task<IActionResult> UpdateBolum([FromBody] AddNewBolum addNewBolum, int hastaneId, int bolumId)
        {
            var result = await _adminService.UpdateBolum(addNewBolum, bolumId, hastaneId);
            return result ? Ok() : BadRequest();
        }

        // Poliklinik işlemleri
        [HttpGet("poliklinikler/{hastaneId}/{bolumId}")]
        public async Task<IActionResult> GetPolikliniklerByHastaneID(int hastaneId, int bolumId)
        {
            var poliklinikler = await _adminService.GetPolikliniklerByHastaneID(hastaneId, bolumId);
            return Ok(poliklinikler);
        }

        [HttpPost("add-poliklinik/{hastaneId}/{bolumId}")]
        public async Task<IActionResult> AddNewPoliklinik([FromBody] AddNewPoliklinik poliklinikDTO, int hastaneId, int bolumId)
        {
            var result = await _adminService.AddNewPoliklinik(poliklinikDTO, hastaneId, bolumId);
            return result ? Ok() : BadRequest();
        }

        [HttpDelete("delete-poliklinik/{hastaneId}/{poliklinikId}/{bolumId}")]
        public async Task<IActionResult> DeletePoliklinik(int hastaneId, int poliklinikId, int bolumId)
        {
            var result = await _adminService.DeletePoliklinik(hastaneId, poliklinikId, bolumId);
            return result ? Ok() : BadRequest();
        }

        [HttpPut("update-poliklinik/{hastaneId}/{poliklinikId}")]
        public async Task<IActionResult> UpdatePoliklinik([FromBody] AddNewPoliklinik poliklinikDTO, int poliklinikId, int hastaneId)
        {
            var result = await _adminService.UpdatePoliklinik(poliklinikDTO, poliklinikId);
            return result ? Ok() : BadRequest();
        }
    }
}
