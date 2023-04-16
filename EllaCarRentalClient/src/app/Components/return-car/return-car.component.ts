import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { CarsService } from 'src/app/Services/cars.service';
import { UsersService } from 'src/app/Services/users.service';
import sweetalert2 from 'sweetalert2';
import { Router } from '@angular/router';

//car + order + car type properties
export class ICarOrder {
  carNumber:string;
  typeId:number;
  carMileage:number;
  carImage:string;
  branchId:number;
  manufacturer:string;
  model:string; 
  costPerDay:number;
  costPerDayDelay:number;
  year:string; 
  gear:string;
  startTime:string;
  endTime:string;
  userImage:string;
  userFullName:string;
  id:string;
  userEmail:string;
  totalCost:number;

 constructor(
   carNumber:string,
   typeId:number,
   carMileage:number, 
   carImage:string, 
   branchId:number, 
   manufacturer:string,
   model:string,
   costPerDay:number,
   costPerDayDelay:number,
   year:string,
   gear:string,
   startTime:string,
   endTime:string,
   userImage:string,
   userFullName:string,
   id:string,
   userEmail:string,
   totalCost:number){
     this.carNumber = carNumber;
     this.typeId = typeId;
     this.carMileage = carMileage;
     this.carImage = carImage;
     this.branchId = branchId;
     this.manufacturer = manufacturer;
     this.model = model;
     this.costPerDay = costPerDay;
     this.costPerDayDelay = costPerDayDelay;
     this.year = year;
     this.gear = gear;
     this.startTime = startTime;
     this.endTime = endTime;
     this.userImage = userImage;
     this.userFullName = userFullName;
     this.id = id;
     this.userEmail = userEmail;
     this.totalCost = totalCost;
   }
}

//Car properties
export interface ICarStock {
  carNumber: string;
  typeId: number;
  carMileage: number;
  proper: string;
  available: string;
  branchId: number;
  image:string; 
}

//Order Properties
export interface ICarOrder {
  carNumber: string;
  userId: number;
  startTime: string;
  endTime: string;
  returnTime: string;
  }

//Proper properties -> Y,N  
interface Proper {
  value:String;
  viewValue:String;
}

@Component({
  selector: 'app-return-car',
  templateUrl: './return-car.component.html',
  styleUrls: ['./return-car.component.scss']
})
export class ReturnCarComponent implements OnInit {

  @ViewChild('carNumber', {static: false}) inputCarNumber: ElementRef; //elementRef of car number

  constructor(private router: Router, private carsApi: CarsService, private usersApi:UsersService) { }

  
  order: ICarOrder; //Init order param
  carNumber:string; //car number
  totalDays:number; //total days of rental
  totalCost:number; //Total cost of rental
  propers: Proper[] = [
    {value: '', viewValue: ''},
    {value: 'Y', viewValue: 'Yes'},
    {value: 'N', viewValue: 'No'}, 
  ]; //List of proper values
  returnDate:string = new Date().toISOString().split('T')[0]; //return date with format of our time zone
  proper:string = ""; //init proper param
  carStock:ICarStock; //init car param
  carOrder:ICarOrder; //init order param
  showCards:boolean; //show info cards 
  showButton:boolean; //show return car button
  
  //Set form group
  fg: FormGroup = new FormGroup({ 
    carNumberFormControl : new FormControl('', [Validators.required])
  });

  //Set value of car number field
  SelectedValue(value: string) {
    this.carNumber = value; 
  } 

  //Update proper value
  updateProper(value:string){

    //Set proper value
    this.proper = value[0];

    //If proper have value - show button
    if(this.proper === "Y" || this.proper === "N")
      this.showButton = true;
    else
      this.showButton = false;
  }

  //Calculate total cost of rented days + delay days -> return total cost
  calculateTotalCost(startTime:string, endTime:string, costPerDay:number, costPerDayDelay:number, totalDays:number):number {    

    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const st = new Date(startTime);
    const et = new Date(endTime);
    const today = new Date();

    const days = Math.round(Math.abs((et.getTime() - st.getTime()) / (oneDay)));
    const delay = Math.round(Math.abs(( today.getTime() - et.getTime()) / (oneDay)));

    const totalCost = (days * costPerDay) + (delay * costPerDayDelay);

    return totalCost;
  }

  //return car -> update rented cars table with return date in DB + update car table
  async returnCar(){

    //Update the return date
    this.carOrder.returnTime = this.returnDate;

    //Update the rental table that the car has been returned
    const rentedCarResponse = await this.carsApi.updateCarOrder(this.carOrder);

    if (rentedCarResponse.indexOf('successfully') < 0)
    {
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: '<h3>The return process has failed!</h3>',
      });

      this.ngOnInit();
      return;

    }

    //Update cars table - 
    //If proper --> available = 'Y' && proper == 'Y'
    //If not proper --> available = 'N' && proper == 'N'
    if(this.proper === "Y"){
      this.carStock.proper = "Y";
      this.carStock.available = "Y";
    } else {
      this.carStock.proper = "N";
      this.carStock.available = "N";
    }

    //Update car with proper and available values
    const carStockResponse = await this.carsApi.updateCarStock(this.carStock);

    if (carStockResponse.indexOf('successfully') > -1 && rentedCarResponse.indexOf('successfully') > -1) {
      sweetalert2.fire({
        type: 'success',
        title: `Reservation Completed successfully`,
        html: `<h3>Car number: ${this.carStock.carNumber} Has been returned successfully !</h3>`,
      });
    }
    else {
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: '<h3>The return process has failed!</h3>',
      });
    }

    this.ngOnInit();

  }

  //Search car by car number 
  async searchCar(){  

    //get rented car info by can number from DB 
    this.carOrder = await this.carsApi.getRentCarByCarNumber(this.carNumber); //Get rental info
    if (this.carOrder === null) {
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: `<h3>Car order for car number: ${this.carNumber} does not exist!</h3>`,
      });
    }

    //Get user info by user id from DB
    const user = await this.usersApi.getUserByUserId(this.carOrder.userId); //Get user info
    if (user === null) {
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: `<h3>User information for car number: ${this.carNumber} does not exist!</h3>`,
      });
    }

    //Get car info by car number from DB
    this.carStock = await this.carsApi.getCarByCarNumber(this.carOrder.carNumber); //Get car info
    if (this.carStock === null) {
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: `<h3>Car information for car number: ${this.carNumber} does not exist!</h3>`,
      });
    }

    //Get car type by type id from DB
    const carType = await this.carsApi.getCarTypeByTypeId(this.carStock.typeId); //Get car type info
    if (this.carStock === null) {
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: `<h3>Car Type for car number: ${this.carNumber} does not exist!</h3>`,
      });
    }

    //If rented car exist show cards
    if(this.carStock.available === 'N')
      this.showCards = true;
    else{
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: '<h3>The car is not rented!</h3>',
      });
      this.ngOnInit();
    }

    //Fix base64 script
    this.carStock.image = this.carStock.image.replace("ella",";");

    //Fix dates string
    this.carOrder.startTime = this.carOrder.startTime.split('T')[0];
    this.carOrder.endTime = this.carOrder.endTime.split('T')[0];

    //Calculate Total Cost
    this.totalCost = this.calculateTotalCost(this.carOrder.startTime, this.carOrder.endTime, carType.costPerDay, carType.costPerDayDelay, this.totalDays);

    //Create a new car order object 
    this.order = new ICarOrder(
      this.carOrder.carNumber,
      this.carStock.typeId,
      this.carStock.carMileage,
      this.carStock.image,
      this.carStock.branchId,
      carType.manufacturer,
      carType.model,
      carType.costPerDay,
      carType.costPerDayDelay,
      carType.year,
      carType.gear,
      this.carOrder.startTime,
      this.carOrder.endTime,
      user.image,
      user.firstName + " " + user.lastName, 
      user.id,
      user.email,
      this.totalCost
    );

    //If no car image -> set default image
    if(this.order.carImage === undefined || this.order.carImage === null)
    this.order.carImage = "/assets/images/noPhoto.jpg";

    //If no user image -> set default image
    if(this.order.userImage === undefined || this.order.userImage === null)
    this.order.userImage = "/assets/images/profile-placeholder.png";
  } 

  //Set gear image -> auto gear or manual gear
  setGearImage(gear:string):string{
    if(gear === 'A')
      return "./assets/images/auto-gear.jpg";

      return "./assets/images/manual-gear.jpg";
  }

  //Init component 
  ngOnInit() {
    this.showCards = false; //hide cards
    this.showButton = false;// hide return car button
    this.inputCarNumber.nativeElement.value = ' '; //init car number element ref
  }

}
 