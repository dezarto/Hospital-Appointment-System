using HRS.Application.DTOs;
using HRS.Application.Interfaces;
using HRS.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, Hasta")]
    public class HastaController : ControllerBase
    {
        private readonly IHastaRandevuService _hastaRandevuService;

        public HastaController(IHastaRandevuService hastaRandevuService)
        {
            _hastaRandevuService = hastaRandevuService;
        }

        [HttpGet("get-randevu-data")]
        public async Task<IActionResult> GetRandevuData()
        {
            var result = await _hastaRandevuService.SearchRandevu();

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastaneler bulunamadı.");
        }

        [HttpGet("get-randevularim/{hastaTC}")]
        public async Task<IActionResult> GetRandevularim(string hastaTC)
        {
            var result = await _hastaRandevuService.Randevularim(hastaTC);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastaneler bulunamadı.");
        }

        [HttpPost("confirm-randevu")]
        public async Task<IActionResult> PostConfirmRandevu(RandevuConfirm randevuConfirm)
        {
            var result = await _hastaRandevuService.ConfirmRandevu(randevuConfirm);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Kayıtlı hastaneler bulunamadı.");
        }

        [HttpGet("get-hasta-datas/{hastaTC}")]
        public async Task<ActionResult<DoktorDTO>> GetDoktorDatas(string hastaTC)
        {
            var hasta = await _hastaRandevuService.GetHastaDatas(hastaTC);
            if (hasta == null) return NotFound("Hasta bulunamadı.");
            return Ok(hasta);
        }

        [HttpPut("update-hasta-datas/{hastaTC}")]
        public async Task<IActionResult> UpdateDoktorDatas(string hastaTC, [FromBody] HastaView hastaView)
        {
            var result = await _hastaRandevuService.UpdateHastaDatas(hastaTC, hastaView);
            if (!result) return BadRequest("Hasta güncellenemedi.");
            return Ok();
        }

        [HttpGet("get-randevu-datas/{hastaTC}/{randevuID}")]
        public async Task<ActionResult<RandevuBilgisiV>> GetRandevuDetayi(string hastaTC, int randevuID)
        {
            var randevu = await _hastaRandevuService.GetRandevuDetayi(hastaTC, randevuID);
            if (randevu == null) return NotFound("Randevu bulunamadı.");
            return Ok(randevu);
        }
    }
}
