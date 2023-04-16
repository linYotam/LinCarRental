using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;


namespace EllaCarRental
{
    public class UserModel
    {
        public int UserId { get; set; }

        [Required(ErrorMessage = "FirstName is ‏a required field.")]
        [IllegalChars]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "LastName is ‏a required field.")]
        [IllegalChars]
        public string LastName { get; set; }

        [Required(ErrorMessage = "UserName is ‏a required field.")]
        [IllegalChars]
        public string UserName { get; set; }

        [Required(ErrorMessage = "User ID is ‏a required field.")]
        [ValidateIDAttribute]
        public string Id { get; set; }

        [ValidateDateAttribute]
        public string DateOfBirth { get; set; }

        [Required(ErrorMessage = "Gender is ‏a required field.")]
        [RegularExpression(@"^(?:m|M|f|F)$")]
        public string Gender { get; set; }

        [Required(ErrorMessage = "Email is ‏a required field.")]
        [RegularExpression(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is ‏a required field.")]
        public string Password { get; set; }

        public string Image { get; set; }

        public string RoleType { get; set; } = "C"; //Default Value
        
        public string JwtToken { get; set; }

        public UserModel()
        {
            
        }

        public UserModel(User user)
        {
            UserId = user.UserId;
            FirstName = user.FirstName;
            LastName = user.LastName;
            UserName = user.UserName;
            Id = user.Id;
            DateOfBirth = user.DateOfBirth;
            Gender = user.Gender;
            Email = user.Email;
            Password = user.Password;
            Image = user.Image;
            RoleType = user.RoleType;
        }

        //If needed, before connecting to the DB, we place the values in the right name convention to make sure the right value goes to the right field in the DB
        public User ConvertToUser()
        {
            User user = new User
            {
                UserId = this.UserId,
                FirstName = this.FirstName,
                LastName = this.LastName,
                UserName = this.UserName,
                Id = this.Id,
                DateOfBirth = this.DateOfBirth,
                Gender = this.Gender,
                Email = this.Email,
                Password = this.Password,
                Image = this.Image,
                RoleType = this.RoleType
            };

            return user;
        }
    }
}
