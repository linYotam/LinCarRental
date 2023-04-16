using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EllaCarRental
{
    public class FavoriteModel
    {
        public int FavoriteId { get; set; }

        [Required(ErrorMessage = "UserId is ‏a required field.")]
        public int UserId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Please enter a value bigger than {1}")]
        [Required(ErrorMessage = "Car Number is ‏a required field.")]
        public string CarNumber { get; set; }

        public FavoriteModel(Favorites favorite)
        {
            FavoriteId = favorite.FavoriteId;
            UserId = favorite.UserId;
            CarNumber = favorite.CarNumber;
        }

        //If needed, before connecting to the DB, we place the values in the right name convention to make sure the right value goes to the right field in the DB
        public Favorites ConvertToFavorite()
        {
            Favorites favorite = new Favorites
            {
                FavoriteId = this.FavoriteId,
                UserId = this.UserId,
                CarNumber = this.CarNumber
            };

            return favorite;
        }

    }
}
