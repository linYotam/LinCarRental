using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EllaCarRental
{
    public class BranchModel : IValidatableObject
    {
        public int BranchId { get; set; }

        [Required(ErrorMessage = "Address is ‏a required field.")]
        public string Address { get; set; }

        [RegularExpression(@"^[-+]?[0 - 9]*\.?[0-9]+$")] //Must be a decimal number
        public decimal? Latitude { get; set; }

        [RegularExpression(@"^[-+]?[0 - 9]*\.?[0-9]+$")] //Must be a decimal number
        public decimal? Longitude { get; set; }

        [Required(ErrorMessage = "Name of Branch is ‏a required field.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Name of City is ‏a required field.")]
        public string City { get; set; }

        public BranchModel(Branch branch)
        {
            BranchId = branch.BranchId;
            Address = branch.Address;
            Latitude = branch.Latitude;
            Longitude = branch.Longitude;
            Name = branch.Name;
            City = branch.City;
        }

        //Validate Location values --> must have values in both Latitude and Longitude fields.
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            List<ValidationResult> errors = new List<ValidationResult>();

            if ((Latitude != null && Latitude != 0 && (Longitude == 0 || Longitude == null)) || (Longitude != null && Longitude != 0 && (Latitude == 0 || Latitude == null)))
            {
                List<string> members = new List<string> { nameof(Latitude), nameof(Longitude)};
                errors.Add(new ValidationResult("The location of a branch must include values for both Latitude and Longitude", members));
            }

            return errors; 
        }
    }
}
