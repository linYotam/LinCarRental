using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.

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

        public string GetJwtToken(string userName, string role)
        {
            Claim claimByUsername = new Claim(ClaimTypes.Name, userName);
            Claim claimByRole = new Claim(ClaimTypes.Role, role);

            List<Claim> claims = new List<Claim> { claimByUsername,claimByRole};
            ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims);
            
        }
         
    }
}
