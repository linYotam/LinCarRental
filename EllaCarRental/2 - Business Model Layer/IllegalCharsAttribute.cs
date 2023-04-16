using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EllaCarRental
{
    public class IllegalCharsAttribute : ValidationAttribute
    {

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null)
                return ValidationResult.Success;

            if (value.ToString().Contains("--"))
                return new ValidationResult("-- Is Illegal Value.");

            if (value.ToString().Contains(";"))
                return new ValidationResult("; Is Illegal Value.");

            return ValidationResult.Success;
        }

    }
}
