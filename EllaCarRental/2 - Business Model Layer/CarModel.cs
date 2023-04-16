using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EllaCarRental
{
    public class CarModel : IValidatableObject
    {

        [Required(ErrorMessage = "Car Number is ‏a required field.")]
        [Range(1, int.MaxValue, ErrorMessage = "Please enter a value bigger than {1}")]
        public string CarNumber { get; set; }

        [Required(ErrorMessage = "Car Type Id is ‏a required field.")]
        [Range(1, int.MaxValue, ErrorMessage = "Please enter a value bigger than 0")]
        public int TypeId { get; set; } 

        [Required(ErrorMessage = "Car Mileage is ‏a required field.")]
        [Range(1, int.MaxValue, ErrorMessage = "Please enter a value bigger than {1}")]
        public long Mileage { get; set; }
         
        public string Image { get; set; }

        [Required(ErrorMessage = "Proper is ‏a required field.")]
        [RegularExpression("^[y|Y]|[n|N]$")]
        public string Proper { get; set; }

        [Required(ErrorMessage = "Available is ‏a required field.")]
        [RegularExpression("^[y|Y]|[n|N]$")]
        public string Available { get; set; }

        [Required(ErrorMessage = "Branch Id is ‏a required field.")]
        [Range(1, int.MaxValue, ErrorMessage = "Please enter a value bigger than {1}")]
        public int BranchId { get; set; }

        public CarModel(){}

        public CarModel(CarsForRent car)
        {
          CarNumber = car.CarNumber;
          TypeId = car.TypeId;
          Mileage = car.Mileage;
          Image = car.Image;
          Proper = car.Proper;
          Available = car.Available;
          BranchId = car.BranchId;
        }

        //If needed, before connecting to the DB, we place the values in the right name convention to make sure the right value goes to the right field in the DB
        public CarsForRent ConvertToCar()
        {
             CarsForRent car = new CarsForRent
             {
                CarNumber = this.CarNumber,
                TypeId = this.TypeId,
                Mileage = this.Mileage,
                Image = this.Image,
                Proper = this.Proper,
                Available = this.Available,
                BranchId = this.BranchId
            };

            return car;
        }

        //Validate condition of car --> if the car is not in proper condition, the car cannot be available for rent.
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            List<ValidationResult> errors = new List<ValidationResult>();

            if (Proper == "N" && Available == "Y")
            {
                List<string> members = new List<string> { nameof(Proper), nameof(Available) };
                errors.Add(new ValidationResult("When a car isn't inOrder, it must not be vacant.", members));
            }

            return errors;
        }
    }
}
