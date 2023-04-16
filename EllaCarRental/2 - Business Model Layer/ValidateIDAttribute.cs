using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace EllaCarRental
{
    class ValidateIDAttribute : ValidationAttribute
    {

        // DEFINE RETURN VALUES
        public enum TzStatus
        {
            R_NOT_VALID = -2,
            R_ELEGAL_INPUT = -1,
            R_VALID = 1
        };

        //Check validation of an Israeli ID.
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if(value == null)
                return new ValidationResult("ID Value is null");

            string IDNum = value.ToString();

            // Validate correct input
            if (!System.Text.RegularExpressions.Regex.IsMatch(IDNum, @"^\d{5,9}$"))
                return new ValidationResult("ID Value is illigal");

            // The number is too short - add leading 0000
            if (IDNum.Length < 9)
            {
                while (IDNum.Length < 9)
                {
                    IDNum = '0' + IDNum;
                }
            }

            // Check the ID number
            int mone = 0;
            int incNum;
            for (int i = 0; i < 9; i++)
            {
                incNum = Convert.ToInt32(IDNum[i].ToString());
                incNum *= (i % 2) + 1;
                if (incNum > 9)
                    incNum -= 9;
                mone += incNum;
            }
            if (mone % 10 == 0)
                return ValidationResult.Success;
            else
                return new ValidationResult("ID Value is illigal");
        }
    }
}
