using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace EllaCarRental
{
    public class JwtHelper
    {

        private readonly SymmetricSecurityKey symmetricSecurityKey;

        public JwtHelper(string key)
        {
            byte[] keyBytes = Encoding.ASCII.GetBytes(key);
            symmetricSecurityKey = new SymmetricSecurityKey(keyBytes);
        }

        public string GetJwtToken(string userName, string role, int userId)
        {
            //Create JWT Claims
            Claim claimByUsername = new Claim(ClaimTypes.Name, userName);
            Claim claimByRole = new Claim(ClaimTypes.Role, role);
            Claim claimByUserId = new Claim(ClaimTypes.PrimarySid, userId.ToString());
            List<Claim> claims = new List<Claim> { claimByUsername, claimByRole, claimByUserId};
            ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims);

            //Encryptions
            SigningCredentials signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha512);

            //Descriptor
            SecurityTokenDescriptor securityTokenDescriptor = new SecurityTokenDescriptor();
            securityTokenDescriptor.Subject = claimsIdentity;
            securityTokenDescriptor.SigningCredentials = signingCredentials;
            securityTokenDescriptor.Expires = DateTime.UtcNow.AddHours(1);

            //Create the security Token for the user
            JwtSecurityTokenHandler jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken = jwtSecurityTokenHandler.CreateToken(securityTokenDescriptor);
            string token = jwtSecurityTokenHandler.WriteToken(securityToken);

            return token;
        }

        //Set the options for the token
        public void SetAuthenticationOptions(AuthenticationOptions options)
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }

        //Set security boundries
        public void SetBearerOptions(JwtBearerOptions options)
        {
            TokenValidationParameters tokenValidationParameters = new TokenValidationParameters();
            tokenValidationParameters.IssuerSigningKey = symmetricSecurityKey; //The security key
            tokenValidationParameters.ValidateIssuer = false; //Don't let miltiple tenants and sign-ins with same keys
            tokenValidationParameters.ValidateAudience = false; //Don't let other sites use of token 
            tokenValidationParameters.ClockSkew = TimeSpan.Zero; //Don't add 5 minutes by default.
            options.TokenValidationParameters = tokenValidationParameters;
        }

    }
}
