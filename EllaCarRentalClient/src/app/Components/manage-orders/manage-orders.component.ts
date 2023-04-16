import { Component, OnInit, ViewChild } from '@angular/core';
import { CarsService } from 'src/app/Services/cars.service';
import { MatDialog, MatPaginator, MatTableDataSource,MatDatepickerInputEvent } from '@angular/material';
import sweetalert2 from 'sweetalert2';
import { AddOrderComponent } from '../add-order/add-order.component';

//Car order properties
export interface ICarOrder {
carNumber: string;
userId: number;
startTime: string;
endTime: string;
returnTime: string;
}

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})

export class ManageOrdersComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; //set paginator

  constructor(private carsApi: CarsService, public dialog: MatDialog) { }

  orders: ICarOrder[]; //List of car orders
  gears: string[] = ['Automatic', 'Manually']; //List of car gear type
  displayedColumns: string[] = ['CarNumber', 'UserID', 'StartTime', 'EndTime', 'ReturnTime', 'Actions']; //List of table columns
  dataSource = new MatTableDataSource<ICarOrder>(); //Create a new datasource for table

  //Add new order
  addOrder() {
    //Open a dialog page
    const dialogRef = this.dialog.open(AddOrderComponent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      //After closing dialog page -> refresh data on page
      this.ngOnInit();
    });
  }

  //Set date according to time zone
  setDate(date: string):string {
    var futureDate = new Date(date);
    futureDate.setDate(futureDate.getDate() + 1);        
    return new Date(futureDate).toISOString().toLocaleString().split('T')[0];
  }

  //Update order in DB
  updateOrder(order: ICarOrder) {
    sweetalert2.fire({
      title: `Are you sure you want to update the selected order?`,
      text: `You won't be able to revert this!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes,I'm 100% sure!`
    }).then(async  (result) => {
      if (result.value) {

        //Convert date to local date as string
        order.endTime = this.setDate(order.endTime);
        order.startTime = this.setDate(order.startTime);
        order.returnTime = this.setDate(order.returnTime);

        //Send request to DB
        const carOrderUpdateResponse = await this.carsApi.updateCarOrder(order);
        if (carOrderUpdateResponse.indexOf('successfully') > -1) {
          sweetalert2.fire(
            'Updated!',
            `Car Order has been updated successfully.`,
            'success'
          );
          //Refresh data on page
          this.ngOnInit();
        } else {
          sweetalert2.fire({
            type: 'error',
            title: 'Something went wrong!',
            html: `Failed to update Car Order!`,
          });
        }
      }
    });
  }

  //Delete order in DB
  deleteOrder(order: ICarOrder) {
    sweetalert2.fire({
      title: `Are you sure you want to delete the selected order?`,
      text: `You won't be able to revert this!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes,I'm 100% sure!`
    }).then(async (result) => {
      if (result.value) {
        //Send request to DB
        const deleteCarTypeResponse = await this.carsApi.deleteCarOrder(order.carNumber);
        if (deleteCarTypeResponse.indexOf('successfully') > -1) {
          sweetalert2.fire(
            'Updated!',
            `Order has been deleted successfully.`, 
            'success'
          );
          //Refresh data on page
          this.ngOnInit();
        } else {
          sweetalert2.fire({
            type: 'error',
            title: 'Something went wrong!',
            html: `Failed to delete Order!`,
          });
        }
      }
    });
  }

  //init data  
  async ngOnInit() {
    //Get list of orders
    this.orders = await this.carsApi.getAllRentCars();
    //For each order set as editable
    this.orders.forEach(u => {
      u['isEdit'] = true;
    });
    //Set data source for table
    this.dataSource.data = this.orders;
    //Set paginator
    this.dataSource.paginator = this.paginator;
  }
}
 