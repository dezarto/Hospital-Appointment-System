using HRS.Application.DTOs;
using HRS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, Doktor")]
    public class DoktorController : Controller
    {
        private readonly IDoktorApplicationService _doktorApplicationService;

        public DoktorController(IDoktorApplicationService doktorApplicationService)
        {
            _doktorApplicationService = doktorApplicationService;
        }

        [HttpGet("get-doktor-datas/{doktorTC}")]
        public async Task<ActionResult<DoktorDTO>> GetDoktorDatas(string doktorTC)
        {
            var doktor = await _doktorApplicationService.GetDoktorDatas(doktorTC);
            if (doktor == null) return NotFound("Doktor bulunamadı.");
            return Ok(doktor);
        }

        [HttpPut("update-doktor-datas/{doktorTC}")]
        public async Task<IActionResult> UpdateDoktorDatas([FromBody] DoktorView doktorView, string doktorTC)
        {
            var result = await _doktorApplicationService.UpdateDoktorDatas(doktorTC, doktorView);
            if (!result) return BadRequest("Doktor güncellenemedi.");
            return Ok();
        }

        [HttpGet("get-mesai/{doktorTC}")]
        public async Task<ActionResult<List<MesaiDTO>>> GetMesaiDatas(string doktorTC)
        {
            var mesailer = await _doktorApplicationService.GetMesaiDatas(doktorTC);
            if (mesailer == null || mesailer.Count == 0) return NotFound("Mesai bilgisi bulunamadı.");
            return Ok(mesailer);
        }

        [HttpGet("get-randevular/{doktorTC}")]
        public async Task<ActionResult<List<RandevuBilgisiV>>> GetRandevuListesi(string doktorTC)
        {
            var randevular = await _doktorApplicationService.GetRandevuListesi(doktorTC);
            if (randevular == null || randevular.Count == 0) return NotFound("Randevu bulunamadı.");
            return Ok(randevular);
        }

        [HttpGet("get-randevu-datas/{doktorTC}/{randevuID}")]
        public async Task<ActionResult<RandevuBilgisiV>> GetRandevuDetayi(string doktorTC, int randevuID)
        {
            var randevu = await _doktorApplicationService.GetRandevuDetayi(doktorTC, randevuID);
            if (randevu == null) return NotFound("Randevu bulunamadı.");
            return Ok(randevu);
        }

        [HttpPut("update-randevu-datas/{doktorTC}/{randevuId}/{randevuNotu}")]
        public async Task<IActionResult> UpdateRandevuDatas(string doktorTC, int randevuId, string randevuNotu)
        {
            var result = await _doktorApplicationService.UpdateRandevuDetayi(doktorTC, randevuId, randevuNotu);
            if (!result) return BadRequest("Doktor güncellenemedi.");
            return Ok();
        }
    }
}
