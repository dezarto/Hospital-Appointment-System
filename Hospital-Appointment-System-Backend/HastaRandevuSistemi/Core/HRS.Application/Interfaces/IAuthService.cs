using HRS.Application.DTOs;

namespace HRS.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResult> HastaRegisterAsync(RegisterDTO registerDto);
        Task<AuthResult> HastaLoginAsync(LoginDTO loginDto);
        Task<bool> UpdatePassword(UpdatePassword updatePasssword);
    }
}
