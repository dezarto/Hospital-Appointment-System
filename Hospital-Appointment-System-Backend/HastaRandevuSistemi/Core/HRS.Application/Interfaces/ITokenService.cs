using HRS.Application.DTOs;
using HRS.Domain.Entities;

namespace HRS.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(UserInformation userInformation);
        RefreshToken GenerateRefreshToken();
    }
}
