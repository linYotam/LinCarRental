using System;
using System.Collections.Generic;

#nullable disable

namespace EllaCarRental
{
    //Created by Entity framework --> Cars table
    public partial class CarsForRent
    {
        public string CarNumber { get; set; }
        public int TypeId { get; set; }
        public long Mileage { get; set; }
        public string Proper { get; set; }
        public string Available { get; set; }
        public int BranchId { get; set; }
        public string Image { get; set; }
        public virtual Branch Branch { get; set; }
        public virtual CarType Type { get; set; }
        public virtual RentCar RentCar { get; set; }
    }
}
