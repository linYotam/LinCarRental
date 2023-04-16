
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EllaCarRental
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("LocalhostDevelopment")]
    public class UsersController : ControllerBase, IDisposable
    {
        private readonly UsersLogic logic;
        private readonly JwtHelper jwtHelper;

        //Dependency Injection
        public UsersController(JwtHelper jwtHelper, UsersLogic logic)
        {
            this.jwtHelper = jwtHelper; //User Token
            this.logic = logic; 
        }

        //Post /api/Users/isAuthenticated
        [HttpPost]
        [Route("isAuthenticated")]
        //Login a user to the system
        public IActionResult Login(CredentialsModel credentials)
        {
            //Check if credentials are valid
            UserModel user = logic.GetUserByCredentials(credentials);

            if (user == null)
                return Unauthorized("Incorrect Email or Password");

            try
            {
                //If credentials valid --> get token for the user
                user.JwtToken = jwtHelper.GetJwtToken(user.UserName, user.RoleType, user.UserId);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        //Post /api/Users/register
        [HttpPost]
        [Route("register")]
        //Add a new user to the DB
        public IActionResult AddUser(UserModel user)
        {
            
            if (logic.IsUsernameExists(user.UserName))
                return BadRequest("UserName already taken.");

            try
            {
                UserModel addedUser = logic.AddUser(user);
                //After creating a new user --> get a token for him
                user.JwtToken = jwtHelper.GetJwtToken(user.UserName, user.RoleType, user.UserId);

                return Created("api/users/" + addedUser.UserId, addedUser);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        //Get /api/Users
        [HttpGet]
        //Get all users from DB
        public IActionResult GetAllUsers()
        {
            try
            {
                List<UserModel> users = logic.GetAllUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Get /api/Users/getFavoritesByUserId/userId
        [HttpGet]
        [Route("getFavoritesByUserId/{userId}")]
        //Get list of all the favorite cars by the user 
        public IActionResult GetFavoritesByUserId(int userId)
        {
            try
            {
                List<FavoriteModel> favorites = logic.GetFavoritesByUserId(userId);
                return Ok(favorites);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        

        //Get /api/Users/getUserByUserId/userId
        [HttpGet]
        [Route("getUserByUserId/{userId}")]
        //Get user info by the user id
        public IActionResult GetUserByUserId(int userId)
        {
            try
            {
                UserModel user = logic.GetUserByUserId(userId);

                if (user == null)
                {
                    return NotFound($"user id {userId} not found.");
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Post /api/Users/addFavorite
        [HttpPost]
        [Route("addFavorite")]
        [Authorize] //User must have a JWT Token - must be logged in.
        //Add a new favorite car for the user
        public IActionResult AddFavorite(Favorites favorite)
        {

            try
            {
                Favorites addedfavorite = logic.AddFavorite(favorite);

                return Created("api/Users/addFavorite", addedfavorite);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        //PUT /api/Users/updateUser
        [HttpPut]
        [Route("updateUser")]
        [Authorize] //User must have a JWT Token - must be logged in.
        //Update user details 
        public IActionResult UpdateFullUser(UserModel user)
        {
            try
            {
                string id = user.Id;

                UserModel updatedUser = logic.UpdateFullUser(user);


                if (updatedUser == null)
                    return NotFound($"id {id} Not found.");

                return Ok(updatedUser);

            }
            catch (Exception ex) 
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        //PUT /api/Users/updateUserWithPassword
        [HttpPut]
        [Route("updateUserWithPassword")]
        [Authorize] //User must have a JWT Token - must be logged in.
        //Update user with password change
        public IActionResult UpdateUserWithPassword(UserModel user)
        {
            try
            {
                string id = user.Id;

                //Unlike regular user update, if password has changed, we need to encrypt the new password --> different function.
                UserModel updatedUser = logic.UpdateUserWithPassword(user);


                if (updatedUser == null)
                    return NotFound($"id {id} Not found.");

                return Ok(updatedUser);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        

        //Patch /api/Users/id
        [HttpPatch]
        [Route("{id}")]
        [Authorize] //User must have a JWT Token - must be logged in.
        //Update partial user details
        public IActionResult UpdatePartialUser(int id, UserModel user)
        {
            try
            {
                user.UserId = id;
                //We send "new" user details, and check what have changed.
                UserModel updatedUser = logic.UpdatePartialUser(user);

                if (updatedUser == null)
                    return NotFound($"id {id} Not found.");

                return Ok(updatedUser);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Delete /api/Users/deleteUser/userId
        [HttpDelete]
        [Route("deleteUser/{id}")]
        [Authorize(Roles = "M")] //User must have a JWT Token - must be logged in & Manager.
        //Delete a user by user id
        public IActionResult DeleteUser(string id)
        {
            try
            {
                logic.DeleteUser(id);
                return NoContent();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        //Post /api/Users/deleteFavorite
        [HttpPost]
        [Route("deleteFavorite")]
        [Authorize] //User must have a JWT Token - must be logged in.
        //Delete favorite car from DB
        public IActionResult DeleteFavorite(Favorites favorite)
        {
            try
            {
                logic.DeleteFavorite(favorite);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        public void Dispose()
        {
            logic.Dispose(); 
        }
    }
}
