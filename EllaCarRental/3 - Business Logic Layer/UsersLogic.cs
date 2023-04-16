using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace EllaCarRental
{
    public class UsersLogic : BaseLogic
    {
        //Dependency Injection
        public UsersLogic(EllaCarRentContext db) : base(db){}

        //Check if user exists in DB
        public bool IsUsernameExists(string userName)
        {
            return DB.Users.Any(user => user.UserName == userName);
        }

        //Get all users from DB
        public List<UserModel> GetAllUsers()
        {
            return DB.Users.Select(user => new UserModel(user)).ToList();
        }

        //Get one user by user id
        public UserModel GetUserByUserId(int userId)
        { 
            UserModel user = DB.Users.Where(user => user.UserId == userId).Select(user => new UserModel(user)).SingleOrDefault();
            user.Password = StringCipher.Decrypt(user.Password, user.Email);
            return user;
        }


        //Get the list of favorite cars of a user by the user id
        public List<FavoriteModel> GetFavoritesByUserId(int userId)
        {

            return DB.Favorites.Where(favorite => favorite.UserId == userId).Select(favorite => new FavoriteModel(favorite)).ToList();

        }

        //Get user info when login into system
        public UserModel GetUserByCredentials(CredentialsModel credentials)
        {
            string encryptPassword = StringCipher.Encrypt(credentials.Password, credentials.Email);
            return DB.Users.Where(user => user.Email == credentials.Email && user.Password == encryptPassword).Select(user => new UserModel(user)).SingleOrDefault();
        } 

        //Add a new user to the DB
        public UserModel AddUser(UserModel userModel)
        {

            User user = userModel.ConvertToUser();

            //Encrypt password when saving a new user to the DB
            user.Password = StringCipher.Encrypt(user.Password, user.Email); 

            DB.Users.Add(user);
            DB.SaveChanges();

            userModel.UserId = user.UserId;
            return userModel;
        }

        //Add favorite car to the Favorites table in DB
        public Favorites AddFavorite(Favorites favorite)
        {
            //Check if favorite car already exist for this user
            Favorites favoriteDB = DB.Favorites.SingleOrDefault(f => f.UserId == favorite.UserId && f.CarNumber == favorite.CarNumber);

            //favorite car already exists
            if (favoriteDB != null && favoriteDB.FavoriteId > 0)
                return null;

            DB.Favorites.Add(favorite);
            DB.SaveChanges();

            return favorite;
        }

        //Update User with password
        public UserModel UpdateUserWithPassword(UserModel userModel)
        {

            User user = DB.Users.SingleOrDefault(user => user.Id == userModel.Id);

            //No User with given ID was found in DataBase
            if (user == null)
                return null;

            user.FirstName = userModel.FirstName;
            user.LastName = userModel.LastName;
            user.UserName = userModel.UserName;
            user.Id = userModel.Id;
            user.DateOfBirth = userModel.DateOfBirth;
            user.Gender = userModel.Gender;
            user.Email = userModel.Email;
            user.Password = StringCipher.Encrypt(userModel.Password, userModel.Email); //Encrypt password 
            user.Image = userModel.Image;
            user.RoleType = userModel.RoleType;

            DB.SaveChanges();

            return userModel;
        }

        //Update user without a change in his password
        public UserModel UpdateFullUser(UserModel userModel)
        {
            
            User user = DB.Users.SingleOrDefault(user => user.Id == userModel.Id);

            //No car with given carId was found in DataBase
            if (user == null)
                return null;

            user.FirstName = userModel.FirstName;
            user.LastName = userModel.LastName;
            user.UserName = userModel.UserName;
            user.Id = userModel.Id;
            user.DateOfBirth = userModel.DateOfBirth;
            user.Gender = userModel.Gender;
            user.Email = userModel.Email;
            user.Password = userModel.Password;
            user.Image = userModel.Image;
            user.RoleType = userModel.RoleType;

            DB.SaveChanges();

            return userModel;
        }

        //Update partial data in user
        public UserModel UpdatePartialUser(UserModel userModel)
        {

            User user = DB.Users.SingleOrDefault(user => user.UserId == userModel.UserId);

            //No car with given carId was found in DataBase
            if (user == null)
                return null;

            //Check what to update
            if (userModel.FirstName != null)
                user.FirstName = userModel.FirstName;
            if (userModel.LastName != null)
                user.LastName = userModel.LastName;
            if (userModel.UserName != null)
                user.UserName = userModel.UserName;
            if (userModel.Id != null)
                user.Id = userModel.Id;
            if (userModel.DateOfBirth != null)
                user.DateOfBirth = userModel.DateOfBirth;
            if (userModel.Gender != null)
                user.Gender = userModel.Gender;
            if (userModel.Email != null)
                user.Email = userModel.Email;
            if (userModel.Password != null)
                user.Password = userModel.Password;
            if (userModel.Image != null)
                user.Image = userModel.Image;
            if (userModel.RoleType != null)
                user.RoleType = userModel.RoleType;

        DB.SaveChanges();

            return userModel;
        }


        //Delete user from DB
        public void DeleteUser(string id)
        {

            User user = DB.Users.SingleOrDefault(user => user.Id == id);

            //No user with given Id was found in DataBase
            if (user == null)
                return;

            DB.Users.Remove(user);
            DB.SaveChanges(); 

        }


        //Delete favorite car from DB
        public void DeleteFavorite(Favorites favoriteCar)
        {

            Favorites favorite = DB.Favorites.SingleOrDefault(favorite => favorite.UserId == favoriteCar.UserId && favorite.CarNumber == favoriteCar.CarNumber);

            //No favorite with given userId and carNumber was found in DataBase
            if (favorite == null)
                return;

            DB.Favorites.Remove(favorite);
            DB.SaveChanges();

        }
    }
}
