using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebApi.Entities;

namespace WebApi.Services
{
    public interface ITokenService
    {
        Task<string> generateJwtToken(AppUser account);
        
    }
    public class TokenService : ITokenService
    { 
        private readonly SymmetricSecurityKey _key;

        private readonly UserManager<AppUser> _userManager;

        public TokenService(IConfiguration configuration, UserManager<AppUser> userManager)
        {

            _userManager = userManager;
            _key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["Secret"]));
        }

        public async Task<string> generateJwtToken(AppUser account)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, account.Id.ToString()),
                
            };
            var roles = await _userManager.GetRolesAsync(account);

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var creds = new SigningCredentials( _key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddMinutes(15),
                SigningCredentials = creds
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
