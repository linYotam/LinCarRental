import { Component, OnInit } from '@angular/core';
import { CarsService } from 'src/app/Services/cars.service';
import { MatDialog } from '@angular/material';
import { UsersService } from 'src/app/Services/users.service';
import sweetalert2 from 'sweetalert2';

//Order properties
export class IOrder {
  carNumber: string;
  userId: number;
  startTime: string;
  endTime: string;
  returnTime: string;
}

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {

  constructor(private carsApi: CarsService, private usersApi: UsersService, public dialog: MatDialog) { }

  carsInStock: string[]; //List of available cars
  allCarsType: any[] = []; //List of all car types
  allUsers: any; //List of users
  carOrder: IOrder = new IOrder();//New object of order 

  //Convert date into proper date according to israel time zone
  setDate(date: string):string {

    var futureDate = new Date(date);
    futureDate.setDate(futureDate.getDate() + 1);        
    return new Date(futureDate).toISOString().toLocaleString().split('T')[0];
 
  }

  //Add new order
  async addOrder() {

    //Check if all fields in carOrder object are with values
    const classLength = Object.keys(this.carOrder).length;

    //If not -> show error
    if (classLength !== 5) {
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: '<h3>some fields on your form are invalid!<br>please check your information</h3>',
      });
      return;
    }

    //Convert date to local date as string
    this.carOrder.endTime = this.setDate(this.carOrder.endTime);
    this.carOrder.startTime = this.setDate(this.carOrder.startTime);
    this.carOrder.returnTime = this.setDate(this.carOrder.returnTime);

    //Add new order to DB
    const addCarToStockResponse = await this.carsApi.addRentOrder(this.carOrder);

    //If success show proper alert and close dialog page
    if (addCarToStockResponse.indexOf('successfully') > -1 ) {
      sweetalert2.fire({
        type: 'success',
        title: `Order added to stock`,
      });
      this.dialog.closeAll();
    } else {
      sweetalert2.fire({
        type: 'error',
        title: 'Something went wrong!',
        text: `Failed to add Order!`,
      });
    }
  }

  async ngOnInit() {

    //Get list of all available cars -> Proper == Y and available == Y
    this.carsInStock = await this.carsApi.getAllAvailableCars().then(res => res.map(car => ({number: car.carNumber, type: car.typeId})));

    //Get list of all car types
    const getAllCarsType = await this.carsApi.getAllCarsType();

    //Loop on all available cars and find them in cars type list -> if founded add car info to allCarsType list
    for (const carInfo of this.carsInStock) {
      const selectedCar = getAllCarsType.find(car => car.typeId === carInfo[`type`]);
      this.allCarsType.push(
        {manufacturer: selectedCar.manufacturer,
        model: selectedCar.model,
        year: selectedCar.year,
        gear: selectedCar.gear,
        carNumber: carInfo[`number`]}
      );
    }
    //Get list of all users info
    this.allUsers = await this.usersApi.getAllUsers()
    .then(res => res.map(user => (({ userId, firstName, lastName, id }) => ({ firstName, lastName, id, userId}))(user)));
  }

}
