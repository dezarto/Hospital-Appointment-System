using HRS.Application.DTOs;
using HRS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IHttpClientFactory _httpClientFactory;

        public AuthController(IAuthService authService, IHttpClientFactory httpClientFactory)
        {
            _authService = authService;
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost("hasta-register")]
        public async Task<IActionResult> HastaRegister([FromBody] RegisterDTO registerDto)
        {
            var result = await _authService.HastaRegisterAsync(registerDto);

            if (!result.Success)
            {
                return BadRequest(result.Errors);
            }

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> HastaLogin([FromBody] LoginDTO loginDto)
        {
            var result = await _authService.HastaLoginAsync(loginDto);

            if (!result.Success)
            {
                return BadRequest(result.Errors);
            }

            return Ok(result);
        }

        [Authorize(Roles = "Admin, Hasta, Doktor")]
        [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePassword updatePassword)
        {
            var result = await _authService.UpdatePassword(updatePassword);

            if (!result)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
