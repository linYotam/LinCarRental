using System;
using System.Collections.Generic;

#nullable disable

namespace EllaCarRental
{

    //Created by Entity framework --> Favorite Cars table
    public partial class Favorites
    {
        public int FavoriteId { get; set; }
        public int UserId { get; set; }
        public string CarNumber { get; set; }

        public Favorites(){}

        public Favorites(int favoriteId, int userId, string carNumber)
        {
            this.FavoriteId = favoriteId;
            this.UserId = userId;
            this.CarNumber = carNumber;
        }
        
    }
}
