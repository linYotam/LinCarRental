import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

//Dependency injection
@Injectable()
export class CarsService {

  constructor(private http: HttpClient) { }

  //Get all cars types from DB
  public async  getAllCarsType() {
    const carsType = await this.http.get<any>(environment.baseUrl+`/Cars/getAllCarsType`).toPromise();
    return carsType;
  }

  //Get all cars from DB
  public async  getAllCars() {
    const allCars = await this.http.get<any>(environment.baseUrl+`/Cars/getAllCars`).toPromise();
    return allCars;
  }

  //Get all available cars from DB (Proper == Y and avialable == Y) 
  public async getAllAvailableCars() {
    const allCars = await this.http.get<any>(environment.baseUrl+`/Cars/getAllAvailableCars`).toPromise();
    return allCars;
  } 

  //Get all rented cars from DB
  public async  getAllRentCars() {
    const allRentCars = await this.http.get<any>(environment.baseUrl+`/Cars/getAllRentCars`).toPromise();
    return allRentCars;
  }

  //Get List of user rented cars by user id from DB
  public async getRentCarsByUserID(userId: number) {

    const rentCarsByUserID = await this.http.get<any>(environment.baseUrl+`/Cars/getRentCarsByUserID/`+ userId ).toPromise();
    return rentCarsByUserID;
  }

  //Get car by car number from DB
  public async getCarByCarNumber(carNumber:string){
    const CarByCarNumber = await this.http.get<any>(environment.baseUrl+`/Cars/getCarByCarNumber/`+ carNumber ).toPromise();
    return CarByCarNumber;
  } 

  //Get car type by type id from DB
  public async getCarTypeByTypeId(typeId:number){
    const CarTypeByTypeId = await this.http.get<any>(environment.baseUrl+`/Cars/getCarTypeByTypeId/`+ typeId ).toPromise();
    return CarTypeByTypeId;
  }

  //Get rent car by car number from DB
  public async getRentCarByCarNumber(carNumber: string) {
  
    const rentCarsByCarNumber = await this.http.get<any>(environment.baseUrl+`/Cars/getRentCarByCarNumber/` + carNumber ).toPromise();
    return rentCarsByCarNumber;
  }

  //Update car in DB
  public async updateCarStock(car: any) {

    if(car.image != null && car.image.indexOf(";") > -1)
      car.image = car.image.replace(";","ella");  //cant save semicolin to DB so replace with ella text;

    const updateCarResponse = await this.http.put<any>(environment.baseUrl+`/Cars/updateCarStock`, car).toPromise()
    .then(res => res.Message, (err: HttpErrorResponse) => err.message);

    if(updateCarResponse === undefined)
    return "successfully";

    return updateCarResponse;
  }

  //Update car order in DB
  public async updateCarOrder(carOrder: any) {
    const updateCarResponse = await this.http.put<any>(environment.baseUrl+`/Cars/updateCarOrder`, carOrder).toPromise()
    .then(res => res.Message, (err: HttpErrorResponse) => err.message);

    if(updateCarResponse === undefined)
    return "successfully";

    return updateCarResponse;
  }

  //Update car type in DB
  public async updateCarType(carType: any) {
    const carTypeResponse = await this.http.put<any>(environment.baseUrl+`/Cars/updateCarType`, carType).toPromise()
    .then(res => res.Message, (err: HttpErrorResponse) => err.message);
    
    if(carTypeResponse === undefined)
    return "successfully";

    return carTypeResponse;
  }

  //Add new car order to DB
  public async addRentOrder(rentCar: any) {

    const rentCarResponse = await this.http.post<any>(environment.baseUrl+`/Cars/addRentOrder`, rentCar).toPromise()
    .then(res => res.Message, (err: HttpErrorResponse) => err.message);

    if(rentCarResponse === undefined)
    return "successfully";

    return rentCarResponse;
  }

  //Add new car to DB
  public async addCarToStock(car: any) {

    if(car.image != null && car.image.indexOf(";") > -1)
    car.image = car.image.replace(";","ella");  //cant save semicolin to DB so replace with ella text;

    const rentCarResponse = await this.http.post<any>(environment.baseUrl+`/Cars/addCar`, car).toPromise()
    .then(res => res.Message, (err: HttpErrorResponse) => err.message);

    if(rentCarResponse === undefined)
    return "successfully";

    return rentCarResponse;
  }

  //Add new car type to DB
  public async addCarType(carType: any) {

    const addCarTypeResponse = await this.http.post<any>(environment.baseUrl+`/Cars/addCarType`, carType).toPromise()
    .then(res => res.Message, (err: HttpErrorResponse) => err.message);

    if(addCarTypeResponse === undefined)
    return "successfully";

    return addCarTypeResponse;
    
  }

  //Delete car type from DB
  public async deleteCarType(typeId: number) {

    const deleteCarTypeResponse = await this.http.delete<any>(environment.baseUrl+`/Cars/deleteCarType/` + typeId).toPromise();

    if(deleteCarTypeResponse === null)
    return "successfully";
 
    return deleteCarTypeResponse;
  }

  //Delete car from DB
  public async deleteCarStock(carNumber: string): Promise<any> {
    const observable = await this.http.delete<any>(environment.baseUrl +`/Cars/deleteCarForRent/`+ carNumber).toPromise();

    if(observable === null)
    return "successfully"; 

    return observable;
  }

  //Delete car order from DB
  public async deleteCarOrder(carNumber: string) {

    const deleteCarOrderResponse = await this.http.delete<any>(environment.baseUrl+`/Cars/deleteCarOrder/`+ carNumber).toPromise();

    if(deleteCarOrderResponse === null) 
    return "successfully";

    return deleteCarOrderResponse;
  }


}
