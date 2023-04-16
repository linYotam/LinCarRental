using System;
using System.Collections.Generic;

#nullable disable

namespace EllaCarRental
{
    public partial class Branch
    {
        //Created by Entity framework --> Branch table
        public Branch()
        {
            CarsForRents = new HashSet<CarsForRent>();
        }

        public int BranchId { get; set; }
        public string Address { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public string Name { get; set; }
        public string City { get; set; } 

        public virtual ICollection<CarsForRent> CarsForRents { get; set; }
    }
}
