using HRS.Application.Interfaces;
using HRS.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HRS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UnAuthController : ControllerBase
    {
        private readonly IUnAuthService _unAuthService;

        public UnAuthController(IUnAuthService unAuthService)
        {
            _unAuthService = unAuthService;
        }

        [HttpGet("city-district-information")]
        public async Task<IActionResult> CityAndDistrictInformation()
        {
            var result = await _unAuthService.GetAllIlandIlceAsync();

            return Ok(result);
        }

        [HttpGet("get-doktors-by-hastane-id/{hastaneId}")]
        public async Task<IActionResult> GetDoktorsByHastaneId(int hastaneId)
        {
            var result = await _unAuthService.GetDoktorsByHastaneID(hastaneId);

            return Ok(result);
        }

        [HttpGet("get-by-hastane-id-all-information/{hastaneId}")]
        public async Task<IActionResult> GetByHastaneAdiAllInformation(int hastaneId)
        {
            var result = await _unAuthService.GetByHastaneIdAllInformationAsync(hastaneId);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Belirtilen hastane bulunamadı.");
        }

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

        [HttpGet("get-AllSlidersAndEtkinlikAndDuyuruAndHaber-by-hastane-id/{hastaneId}")]
        public async Task<IActionResult> GetAllSlidersAndEtkinlikAndDuyuruAndHaberByHastaneId(int hastaneId)
        {
            var result = await _unAuthService.GetAllSlidersAndEtkinlikAndDuyuruAndHaberByHastaneId(hastaneId);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Belirtilen Sliders bulunamadı.");
        }

        [HttpGet("doktor-uzmanliklar")]
        public async Task<IActionResult> GetDoktorUzmanliklar()
        {
            var result = await _unAuthService.GetDoktorUzmanliklar();

            return Ok(result);
        }
    }
}
