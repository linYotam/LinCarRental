using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace EllaCarRental
{
    
    class ValidateDateAttribute : ValidationAttribute
    {

        //Check validation of date
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {

            if (value == null)
                return ValidationResult.Success;

            string dateString = value.ToString();
            DateTime dateValue;

            if (DateTime.TryParse(dateString, out dateValue))
                return ValidationResult.Success;
            else
                return new ValidationResult("Date Value is illigal");
        }
    }
}
