import { Component, OnInit } from '@angular/core';
import { BranchesService } from 'src/app/Services/branches.service';
import { CarsService } from 'src/app/Services/cars.service';
import { CommonService } from 'src/app/Services/commonService';

//Car order properties
export class OrderedCar { 
  carNumber:string;
  typeId:number;
  carMileage:number;
  image:string;
  branchName:string;
  branchCity:string;
  branchAddress:string;
  manufacturer:string;
  model:string; 
  costPerDay:number;
  costPerDayDelay:number;
  year:string; 
  gear:string;
  returnTime:Date;
  startTime:Date;
  endTime:Date;
  diffDaysRentTime:number;
  diffDaysReturn:number;

  //Init ordered car details
  constructor(
    carNumber:string,
    typeId:number,
    carMileage:number, 
    image:string, 
    branchName:string,
    branchCity:string,
    branchAddress:string, 
    manufacturer:string,
    model:string,
    costPerDay:number,
    costPerDayDelay:number,
    year:string,
    gear:string,
    returnTime:Date,
    startTime:Date,
    endTime:Date){
      this.carNumber = carNumber;
      this.typeId = typeId;
      this.carMileage = carMileage;
      this.image = image;
      this.branchName = branchName;
      this.branchCity = branchCity;
      this.branchAddress = branchAddress;
      this.manufacturer = manufacturer;
      this.model = model;
      this.costPerDay = costPerDay;
      this.costPerDayDelay = costPerDayDelay;
      this.year = year;
      this.gear = gear;
      this.returnTime = returnTime;
      this.startTime = startTime;
      this.endTime = endTime;

      this.diffDaysRentTime = this.diffDays(new Date(this.startTime), new Date(this.endTime));
      this.diffDaysReturn =  this.returnTime ?  this.diffDays(new Date(this.endTime), new Date(this.returnTime)) : 0;
      this.image = this.image.replace("ella",";");

    }

    //Get delta of order remaining days
    diffDays(from, to) {
      const oneDay = 24 * 60 * 60 * 1000;
      return Math.round(Math.abs((from.getTime() - to.getTime()) / (oneDay)));
    }
}

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})

export class MyOrdersComponent implements OnInit {

  constructor(private carsApi: CarsService, private commonService: CommonService, private branchApi:BranchesService) { }

  car: any; 
  carType: any;
  branch: any;

  orderedCar:OrderedCar;
  currentOrderedCars:OrderedCar[] = [];
  historyOrderedCars:OrderedCar[] = [];

  //Set gear image
  setGearImage(gear:string):string{
    if(gear === 'A')
      return "./assets/images/auto-gear.jpg";

      return "./assets/images/manual-gear.jpg";
  }

  //Init date
  async ngOnInit() {

    //Get user id from token
    const userId = this.commonService.getUserID();
    //Get list of all cars from DB
    const all = await this.carsApi.getAllCars();
    //Get list of all car types
    const types = await this.carsApi.getAllCarsType();
    //get List of all orders under user from DB
    const orders = await this.carsApi.getRentCarsByUserID(userId);
    //Get branch info from DB
    const branchInfo = await this.branchApi.getBranches();
 
    //For each order info create a new order object 
    orders.forEach(order => {
       
      this.car = all.filter(a => a.carNumber === order.carNumber);
      this.carType = types.filter(t => t.typeId === this.car[0].typeId);
      this.branch = branchInfo.filter(b => b.branchId === this.car[0].branchId);

      this.orderedCar = new OrderedCar(
        this.car[0].carNumber,
        this.car[0].typeId,
        this.car[0].carMileage,
        this.car[0].image,
        this.branch[0].name,
        this.branch[0].city,
        this.branch[0].address,
        this.carType[0].manufacturer,
        this.carType[0].model,
        this.carType[0].costPerDay,
        this.carType[0].costPerDayDelay,
        this.carType[0].year,
        this.carType[0].gear,
        order.returnTime,
        order.startTime,
        order.endTime);

      //If return time field have value -> add to history list
      if(this.orderedCar.returnTime)  
        this.historyOrderedCars.push(this.orderedCar); //History orders - with return date.
      else
        this.currentOrderedCars.push(this.orderedCar);//Current orders - with no return date.
    });
  }
} 
