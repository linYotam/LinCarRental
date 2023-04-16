using System;
using System.Collections.Generic;

#nullable disable

namespace EllaCarRental
{
    //Created by Entity framework --> Users table
    public partial class User
    {
        public User()
        {
            RentCars = new HashSet<RentCar>();
        }

        public int UserId { get; set; }
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Image { get; set; }
        public string RoleType { get; set; }

        public virtual ICollection<RentCar> RentCars { get; set; }
    }
}
