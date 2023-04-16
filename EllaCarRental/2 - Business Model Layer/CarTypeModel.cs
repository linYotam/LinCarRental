using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace EllaCarRental
{
    public class CarTypeModel
    {
        public int TypeId { get; set; }

        [Required(ErrorMessage = "Manufacturer is ‏a required field.")]
        public string Manufacturer { get; set; }

        [Required(ErrorMessage = "Model is ‏a required field.")]
        public string Model { get; set; }

        [Required(ErrorMessage = "Cost Per Day is ‏a required field.")]
        [RegularExpression(@"^[-+]?[0 - 9]*\.?[0-9]+$")] //Can be a decimal number
        public decimal CostPerDay { get; set; }

        [Required(ErrorMessage = "Cost Per Day Delay is ‏a required field.")]
        [RegularExpression(@"^[-+]?[0 - 9]*\.?[0-9]+$")] //Can be a decimal number
        public decimal CostPerDayDelay { get; set; }

        [Required(ErrorMessage = "Year is ‏a required field.")]
        public string Year { get; set; }

        [Required(ErrorMessage = "Gear is ‏a required field.")]
        public string Gear { get; set; }

        public CarTypeModel()
        {

        }

        public CarTypeModel(CarType car)
        {
            TypeId = car.TypeId;
            Manufacturer = car.Manufacturer;
            Model = car.Model;
            CostPerDay = car.CostPerDay;
            CostPerDayDelay = car.CostPerDayDelay;
            Year = car.Year;
            Gear = car.Gear;
        }
    }
}
