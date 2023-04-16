using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EllaCarRental
{
    public class RentalModel
    {

        public string CarNumber { get; set; }

        [Required(ErrorMessage = "UserId is ‏a required field.")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "StartTime is ‏a required field.")]
        public DateTime StartTime { get; set; }

        [Required(ErrorMessage = "EndTime is ‏a required field.")]
        public DateTime EndTime { get; set; }

        public DateTime? ReturnTime { get; set; }

        public RentalModel(RentCar car)
        {
            CarNumber = car.CarNumber;
            UserId = car.UserId;
            StartTime = car.StartTime;
            EndTime = car.EndTime;
            ReturnTime = car.ReturnTime;
        }

    }
}
