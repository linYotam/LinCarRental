using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace EllaCarRental
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("LocalhostDevelopment")]
    //[Authorize] //User must have a JWT Token - must be logged in.
    public class CarsController : ControllerBase, IDisposable
    {
        private readonly CarsLogic logic;

        //Dependency Injection
        public CarsController(CarsLogic logic)
        {
            this.logic = logic;
        }

        //Get /api/Cars/getAllCars
        [HttpGet]
        [Route("getAllCars")]
        //Get all cars from DB
        public IActionResult GetAllCars()
        {
            try
            {
                List<CarModel> cars = logic.GetAllCars();
                return Ok(cars);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Get /api/Cars/getAllAvailableCars
        [HttpGet]
        [Route("getAllAvailableCars")]
        //Get all available cars --> proper & avialable == Y
        public IActionResult GetAllAvailableCars()
        {
            try
            {
                List<CarModel> cars = logic.GetAllAvailableCars();
                return Ok(cars);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Get /api/Cars/getAllCarsType
        [HttpGet]
        [Route("getAllCarsType")]
        //Get all cars type from DB
        public IActionResult GetAllCarsType()
        {
            try
            {
                List<CarTypeModel> cars = logic.GetAllCarsType();
                return Ok(cars);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Get /api/Cars/id
        [HttpGet]
        [Route("{carNumber}")]
        //Get a specific car from DB by car number
        public IActionResult GetCar(string carNumber)
        {
            try
            {
                CarModel car = logic.GetCar(carNumber);

                if (car == null)
                {
                    return NotFound($"id {carNumber} not found.");
                }

                return Ok(car);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Get /api/Cars/getAllRentCars
        [HttpGet]
        [Route("getAllRentCars")]
        //Get all rented cars from DB
        public IActionResult GetAllRentCars()
        {
            try
            {
                List<RentalModel> cars = logic.GetAllRentCars();
                return Ok(cars);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Get /api/Cars/getRentCarByCarNumber/carNumber
        [HttpGet]
        [Route("getRentCarByCarNumber/{carNumber}")]
        //Get a specific rented car details by the car number --> Table: RentCar
        public IActionResult GetRentCarByCarNumber(string carNumber)
        {
            try
            {
                RentalModel car = logic.GetRentCarByCarNumber(carNumber);
                return Ok(car);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Get /api/Cars/getCarByCarNumber/carNumber
        [HttpGet]
        [Route("getCarByCarNumber/{carNumber}")]
        //Get a specific car details by the car number --> Table: CarsForRent
        public IActionResult GetCarByCarNumber(string carNumber)
        {
            try
            {
                CarModel car = logic.GetCarByCarNumber(carNumber);
                return Ok(car);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Get /api/Cars/getCarTypeByTypeId/typeId
        [HttpGet]
        [Route("getCarTypeByTypeId/{typeId}")]
        //Get a specific car type details by type id
        public IActionResult GetCarTypeByTypeId(int typeId)
        {
            try
            {
                CarTypeModel car = logic.GetCarTypeByTypeId(typeId);
                return Ok(car);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }


        //Get /api/Cars/getRentCarsByUserID/typeId
        [HttpGet]
        [Route("getRentCarsByUserID/{userId}")]
        //Get all rented cars by user id
        public IActionResult GetCarsByUserId(int userId)
        {
            try
            {
                List<RentalModel> cars = logic.GetRentedCarsByUserId(userId);
                return Ok(cars);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Post /api/Cars
        [HttpPost]
        [Route("addCar")]
        [Authorize(Roles = "M")] //User must have a JWT Token - must be logged in & Manager.
        //Add a new car to DB
        public IActionResult AddCar(CarModel car)
        {
            try
            {
                CarModel addedCar = logic.AddCar(car);
                return Created("api/cars/addCars" + addedCar.CarNumber, addedCar);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Post /api/Cars/addCarType
        [HttpPost]
        [Route("addCarType")]
        [Authorize(Roles = "M")] //User must have a JWT Token - must be logged in & Manager.
        //Add a new car type to DB
        public IActionResult AddCarType(CarType car)
        {
            try
            {
                CarType addedCarType = logic.AddCarType(car);
                return Created("api/Cars/addCarType" + addedCarType.TypeId, addedCarType);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }


        //Post /api/cars
        [HttpPost]
        [Route("addRentOrder")]
        [Authorize] //User must have a JWT Token - must be logged in.
        //Add a new rent order to DB
        public IActionResult AddRentOrder(RentCar car)
        {
            try
            {
                RentCar addedRentOrder = logic.AddRentOrder(car);
                return Created("api/cars/addRentOrder", addedRentOrder);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //PUT /api/Cars/updateCarStock
        [HttpPut]
        [Route("updateCarStock")]
        [Authorize] //User must have a JWT Token - must be logged in.
        //Update car details
        public IActionResult UpdateFullCar(CarModel car)
        {
            try
            {
                string carNumber = car.CarNumber;

                CarModel updatedCar = logic.UpdateFullCar(car);

                if (updatedCar == null)
                    return NotFound($"carNumber {carNumber} Not found.");

                return Ok(car);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        //PUT /api/Cars/updateCarType
        [HttpPut]
        [Route("updateCarType")]
        [Authorize(Roles = "M")] //User must have a JWT Token - must be logged in & Manager.
        //Update car type details
        public IActionResult UpdateCarType(CarTypeModel car)
        {
            try
            {
                int typeId = car.TypeId;

                CarTypeModel updatedCarType = logic.UpdateFullCarType(car);

                if (updatedCarType == null)
                    return NotFound($"Type Id {typeId} Not found.");

                return Ok(car);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        //PUT /api/Cars/updateCarOrder
        [HttpPut]
        [Route("updateCarOrder")]
        [Authorize(Roles = "M, A")] //User must have a JWT Token - must be logged in & Manager or Admin.
        //Update rented car details
        public IActionResult UpdateCarOrder(RentCar car)
        {
            try
            {
                string carNumber = car.CarNumber;

                RentCar updatedRentCar = logic.UpdateFullRentCar(car);

                if (updatedRentCar == null)
                    return NotFound($"Car Number: {carNumber} Not found.");

                return Ok(car);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        //Patch /api/Cars/id
        [HttpPatch]
        [Route("{carNumber}")]
        [Authorize(Roles = "M")] //User must have a JWT Token - must be logged in & Manager.
        //Update partial car details
        public IActionResult UpdatePartialCar(string carNumber, CarModel car)
        {
            try
            {
                car.CarNumber = carNumber;
                //Check what have changed, and update the delta.
                CarModel updatedCar = logic.UpdatePartialCar(car);

                if (updatedCar == null)
                    return NotFound($"carNumber {carNumber} Not found.");

                return Ok(updatedCar);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Delete /api/Cars/deleteCarForRent/id
        [HttpDelete]
        [Route("deleteCarForRent/{carNumber}")]
        [Authorize(Roles = "M")] //User must have a JWT Token - must be logged in & Manager.
        //Delete car from DB
        public IActionResult DeleteCar(string carNumber)
        {
            try
            {
                logic.DeleteCar(carNumber);
                return NoContent();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Delete /api/Cars/deleteCarType/typeId
        [HttpDelete]
        [Route("deleteCarType/{typeId}")]
        [Authorize(Roles = "M")] //User must have a JWT Token - must be logged in & Manager.
        //Delete car type
        public IActionResult DeleteCarType(int typeId)
        {
            try
            {
                logic.DeleteCarType(typeId);
                return NoContent();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        //Delete /api/Cars/deleteCarOrder/carNumber
        [HttpDelete]
        [Route("deleteCarOrder/{carNumber}")]
        [Authorize(Roles = "M")] //User must have a JWT Token - must be logged in & Manager.
        //Delete rented car
        public IActionResult DeleteCarOrder(string carNumber)
        {
            try
            {
                logic.DeleteCarOrder(carNumber);
                return NoContent();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }
        

        //Get /api/cars/bytype/typeId
        [HttpGet]
        [Route("bytype/{typeId}")]
        //Get a specific car by type id
        public IActionResult GetCarsByType(int typeId)
        {
            try
            {
                List<CarModel> cars = logic.GetCarsByType(typeId);
                return Ok(cars);
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
