import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarsService } from 'src/app/Services/cars.service';
import { BranchesService } from 'src/app/Services/branches.service';
import sweetalert2 from 'sweetalert2';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { CommonService } from 'src/app/Services/commonService';

//Rent car properties
export class RentCar {
  carNumber: string;
  userId: number;
  startTime: Date;
  endTime: Date;
  returnTime: Date;
}


@Component({
  selector: 'app-rent-car',
  templateUrl: './rent-car.component.html',
  styleUrls: ['./rent-car.component.scss'] 
})
export class RentCarComponent implements OnInit {

  jwtHelper = new JwtHelperService(); //new Token object
  carInforamtion: any; //Init car information param
  daysRange: number; //init range of days param
  relevantCar: any; //init relevant car param
  branchInfo: any; //init branch info param
  branches: any; //init List of branches param
  
  constructor(private router: Router, private carsApi: CarsService, private branchApi: BranchesService,
    private dialog: MatDialog, private commonService: CommonService) {

    const navigation = this.router.getCurrentNavigation(); //Get data from navigation
    const car = navigation.extras as { carInforamtion: any }; //Get car info from navigation data
    this.carInforamtion = car;
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    
    //Calculate range of days of rent period
    this.daysRange = Math.round(Math.abs(
      (this.carInforamtion.rentPeriod.end.getTime() - this.carInforamtion.rentPeriod.begin.getTime()) / (oneDay)
    ));
    
  }
 
  //Set gear image for auto or manually gear
  setGearImage(gear:string):string{
    if(gear === 'A')
      return "./assets/images/auto-gear.jpg";

      return "./assets/images/manual-gear.jpg";
  }

  //Return back to select car for rent page
  cancel() {
    this.router.navigate(['/Cars/selectCar']);
  }

  async ngOnInit() {
    const allCars = await this.carsApi.getAllAvailableCars(); //Get List of all available cars from DB
    this.relevantCar = allCars.find(car => car.carNumber === this.carInforamtion.carNumber && car.typeId === this.carInforamtion.typeId); //Find relevant car by car number and type id
    this.branches = await this.branchApi.getBranches(); //Get list of all branches
    this.branchInfo = this.branches.find(branch => branch.branchId === this.relevantCar.branchId); //Find relevant branch by branch id
  }

  async editBranchReturn() {

  }

  //Order car
  async reserveCar(car: any) {

    const token = sessionStorage.getItem('token'); //Get user token

    //Make sure user exist by checking if token exist
    if (!token) {
      sweetalert2.fire({
        title: 'Oops...',
        html: '<h3>You must be logged in order to reserve car!</h3>',
        type: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Register',
        confirmButtonText: 'Login'
      }).then((result) => {
        result.value ?
          this.dialog.open(LoginComponent, {}) :
          this.dialog.open(RegisterComponent, {}); //if there is no token for user -> nevigate to login or register page
      });
      return;
    }

    const tokenDecoder = this.jwtHelper.decodeToken(token); //Decode token

    const rentCar: RentCar = new RentCar(); //Create new rent car object

    //Set all rent car info for order
    rentCar.carNumber = car.carNumber;
    rentCar.startTime = this.carInforamtion.rentPeriod.begin;
    rentCar.endTime = this.carInforamtion.rentPeriod.end;
    rentCar.userId = tokenDecoder.primarysid;
    car.available = 'N';

    //Update car in DB -> not available 
    const updateCarResponse = await this.carsApi.updateCarStock(car);

    //Add new order in DB
    const addRentCarResponse = await this.carsApi.addRentOrder(rentCar);
    
    //Make sure all DB updates were successful
    if (updateCarResponse.indexOf('successfully') > -1 && addRentCarResponse.indexOf('successfully') > -1) {
      sweetalert2.fire({
        type: 'success',
        title: `Reservation Completed successfully`,
        html: `<h3>Car number: ${car.carNumber} Rented successfully !</h3>`,
      });

      this.commonService.setNumbersOfOrders(); //update number of orders
      this.router.navigate(['/Cars/selectCar']); //navigate back to select car for rent page
    }
    else {
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: '<h3>Reservation order failed!</h3>',
      });
      this.router.navigate(['/Cars/selectCar']); //navigate back to select car for rent page
    }
  }
}
 