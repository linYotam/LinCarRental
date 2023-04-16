using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EllaCarRental
{
    public class CarsLogic : BaseLogic
    {
        //Dependency Injection
        public CarsLogic(EllaCarRentContext db) : base(db){}

        //Get all cars from DB --> Table: CarsForRent
        public List<CarModel> GetAllCars()
        {
            return DB.CarsForRents.Select(car => new CarModel(car)).ToList();
        }

        //Get all rented cars by a user from DB --> Table: RentCar
        public List<RentalModel> GetRentCarsByUserID(int userId)
        {
            return DB.RentCars.Where(car => car.UserId == userId).Select(car => new RentalModel(car)).ToList();
        }

        //Get one rented car by the car number --> Table: RentCar
        public RentalModel GetRentCarByCarNumber(string carNumber)
        {
            return DB.RentCars.Where(car => car.CarNumber == carNumber).Select(car => new RentalModel(car)).SingleOrDefault();
        }

        //Get one car by the car number --> Table: CarsForRent
        public CarModel GetCarByCarNumber(string carNumber)
        {
            return DB.CarsForRents.Where(car => car.CarNumber == carNumber).Select(car => new CarModel(car)).SingleOrDefault();
        }

        //Get one car type by the type id --> Table: CarType
        public CarTypeModel GetCarTypeByTypeId(int typeId)
        {
            return DB.CarTypes.Where(car => car.TypeId == typeId).Select(car => new CarTypeModel(car)).SingleOrDefault();
        }

        //Get all cars from DB that are both proper and available for rent.  --> Table: CarsForRent
        public List<CarModel> GetAllAvailableCars()
        {
            return DB.CarsForRents.Where(car => car.Proper == "Y" && car.Available == "Y").Select(car => new CarModel(car)).ToList();
        }

        //Get all rented cars --> Table: RentCar
        public List<RentalModel> GetAllRentCars()
        {
            return DB.RentCars.Select(car => new RentalModel(car)).ToList();
        }

        //Get all cars type --> Table: CarType
        public List<CarTypeModel> GetAllCarsType()
        {
            return DB.CarTypes.Select(car => new CarTypeModel(car)).ToList(); 
        }

        //Get a specific car by the car number --> Table: CarsForRent
        public CarModel GetCar(string carNumber)
        {
            return DB.CarsForRents.Where(car => car.CarNumber == carNumber).Select(car => new CarModel(car)).SingleOrDefault();
        }

        //Add a new car to the DB --> Table: CarsForRent
        public CarModel AddCar(CarModel carModel)
        {
            CarsForRent car = carModel.ConvertToCar();
            DB.CarsForRents.Add(car);
            DB.SaveChanges();
            carModel.CarNumber = car.CarNumber;
            return carModel;
        }

        //Add a new car type to the DB --> Table: CarType
        public CarType AddCarType(CarType carTypeModel)
        {
            DB.CarTypes.Add(carTypeModel);
            DB.SaveChanges();
            return carTypeModel;
        }

        //Add a new rent order to the DB --> Table: RentCar
        public RentCar AddRentOrder(RentCar car)
        {
            DB.RentCars.Add(car);
            DB.SaveChanges();
            return car;
        }

        //Update car --> Table: CarsForRent
        public CarModel UpdateFullCar(CarModel carModel)
        {

            CarsForRent car = DB.CarsForRents.SingleOrDefault(car => car.CarNumber == carModel.CarNumber);

            //No car with given carId was found in DataBase
            if (car == null)
                return null;

            car.CarNumber = carModel.CarNumber;
            car.TypeId = carModel.TypeId;
            car.Mileage = carModel.Mileage;
            car.Image = carModel.Image;
            car.Proper = carModel.Proper;
            car.Available = carModel.Available;
            car.BranchId = carModel.BranchId;

            DB.SaveChanges();

            return carModel;
        }

        //Update car type --> Table: CarType
        public CarTypeModel UpdateFullCarType(CarTypeModel carTypeModel)
        {
            CarType car = DB.CarTypes.SingleOrDefault(car => car.TypeId == carTypeModel.TypeId);

            //No car with given carId was found in DataBase
            if (car == null)
                return null;

            car.TypeId = carTypeModel.TypeId;
            car.Manufacturer = carTypeModel.Manufacturer;
            car.Model = carTypeModel.Model;
            car.CostPerDay = carTypeModel.CostPerDay;
            car.CostPerDayDelay = carTypeModel.CostPerDayDelay;
            car.Year = carTypeModel.Year;
            car.Gear = carTypeModel.Gear;

            DB.SaveChanges();

            return carTypeModel;
        }

        //Update car rent order --> Table: RentCar
        public RentCar UpdateFullRentCar(RentCar rentCar)
        {
            RentCar car = DB.RentCars.SingleOrDefault(car => car.CarNumber == rentCar.CarNumber);

            //No car with given carId was found in DataBase
            if (car == null)
                return null;

            car.CarNumber = rentCar.CarNumber;
            car.UserId = rentCar.UserId;
            car.StartTime = rentCar.StartTime;
            car.EndTime = rentCar.EndTime;
            car.ReturnTime = rentCar.ReturnTime;

            DB.SaveChanges();

            return rentCar;
        }

        //Update partial data of a car --> Table: CarsForRent
        public CarModel UpdatePartialCar(CarModel carModel)
        {

            CarsForRent car = DB.CarsForRents.SingleOrDefault(car => car.CarNumber == carModel.CarNumber);

            //No car with given carId was found in DataBase
            if (car == null)
                return null;

            if (carModel.TypeId > 0)
                car.TypeId = carModel.TypeId;
            if (carModel.Mileage > 0)
                car.Mileage = carModel.Mileage;
            if (carModel.Image != null)
                car.Image = carModel.Image;
            if (carModel.Proper != null)
                car.Proper = carModel.Proper;
            if (carModel.Available != null)
                car.Available = carModel.Available;
            if (carModel.CarNumber != null)
                car.CarNumber = carModel.CarNumber;
            if (carModel.BranchId > 0)
                car.BranchId = carModel.BranchId;

            DB.SaveChanges();

            return carModel;
        }

        //Delete a car from DB --> Table: CarsForRent
        public void DeleteCar(string carNumber)
        {

            CarsForRent car = DB.CarsForRents.SingleOrDefault(car => car.CarNumber == carNumber);

            //No car with given carId was found in DataBase
            if (car == null)
                return;

            DB.CarsForRents.Remove(car);
            DB.SaveChanges();

        }

        //Delete a car type from DB --> Table: CarType
        public void DeleteCarType(int typeId)
        {

            CarType car = DB.CarTypes.SingleOrDefault(car => car.TypeId == typeId);

            //No car with given carId was found in DataBase
            if (car == null)
                return; 

            DB.CarTypes.Remove(car);
            DB.SaveChanges();

        }

        //Delete a car order from DB --> Table: RentCar
        public void DeleteCarOrder(string carNumber)
        {

            RentCar car = DB.RentCars.SingleOrDefault(car => car.CarNumber == carNumber);

            //No car with given carId was found in DataBase
            if (car == null)
                return;

            DB.RentCars.Remove(car);
            DB.SaveChanges();

        }

        //Get all rented cars by user id --> Table: RentCar
        public List<RentalModel> GetRentedCarsByUserId(int userId)
        {
            return DB.RentCars.Where(car => car.UserId == userId).Select(car => new RentalModel(car)).ToList();
        }

        //Get all cars by type --> Table: CarsForRent
        public List<CarModel> GetCarsByType(int typeId)
        {
            return DB.CarsForRents.Where(car => car.TypeId == typeId).Select(car => new CarModel(car)).ToList();
        }
    }
}
