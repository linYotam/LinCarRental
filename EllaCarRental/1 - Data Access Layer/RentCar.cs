using System;
using System.Collections.Generic;

#nullable disable

namespace EllaCarRental
{
    //Created by Entity framework --> Rented Cars table
    public partial class RentCar
    {
        public string CarNumber { get; set; }
        public int UserId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public DateTime? ReturnTime { get; set; }

        public virtual CarsForRent CarNumberNavigation { get; set; }
        public virtual User User { get; set; }
    }
}
