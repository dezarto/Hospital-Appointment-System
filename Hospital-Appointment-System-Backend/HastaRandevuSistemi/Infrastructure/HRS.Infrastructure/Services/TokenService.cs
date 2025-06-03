using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HRS.Application.DTOs;
using HRS.Application.Interfaces;
using HRS.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;

namespace HRS.Infrastructure.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(UserInformation userInformation)
        {
            // Token oluşturma mantığı
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]); // appsettings.json'dan alınan gizli anahtar
            var now = DateTime.UtcNow;

            // Kullanıcının rollerini burada alıyoruz
            var roles = userInformation.Roles; // customerDto içerisinde rollerin olduğu bir alan olmalı

            var claims = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, userInformation.TC.ToString()),
            });

            // Roller ekleniyor
            foreach (var role in roles)
            {
                claims.AddClaim(new Claim(ClaimTypes.Role, role));
            }
             
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddHours(2), // Token geçerlilik süresi
                NotBefore = now,  //  Şu anki zamandan önce kullanılamaz
                IssuedAt = now,  //  Token'in oluşturulduğu zaman
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token); // Oluşturulan token'ı döndür
        }

        public RefreshToken GenerateRefreshToken()
        {
            // Refresh token oluşturma mantığı
            return new RefreshToken
            {
                Token = Guid.NewGuid().ToString(),
                Expiration = DateTime.UtcNow.AddHours(1)
            };
        }
    }
}
