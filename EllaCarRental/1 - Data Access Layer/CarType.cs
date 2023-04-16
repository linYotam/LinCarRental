using System;
using System.Collections.Generic;

#nullable disable

namespace EllaCarRental
{

    //Created by Entity framework --> Car Type table
    public partial class CarType
    {
        public int TypeId { get; set; }
        public string Manufacturer { get; set; }
        public string Model { get; set; }
        public decimal CostPerDay { get; set; } 
        public decimal CostPerDayDelay { get; set; }
        public string Year { get; set; }
        public string Gear { get; set; }

        public virtual ICollection<CarsForRent> CarsForRents { get; set; }
    }
}
