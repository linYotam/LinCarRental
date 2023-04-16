import { Component, OnInit, ViewChild } from '@angular/core';
import { CarsService } from 'src/app/Services/cars.service';
import { MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import sweetalert2 from 'sweetalert2';
import { BranchesService } from 'src/app/Services/branches.service';
import { AddCarStockComponent } from '../add-car-stock/add-car-stock.component';

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

 
@Component({
  selector: 'app-manage-cars-stock',
  templateUrl: './manage-cars-stock.component.html',
  styleUrls: ['./manage-cars-stock.component.scss']
})

export class ManageCarsStockComponent implements OnInit {

  constructor(private carsApi: CarsService, private branchApi: BranchesService, public dialog: MatDialog) { }

  //Set paginator 
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
 
  carsType; any; //List of car types
  branches: any; //List of branches
  carsStock: ICarStock[]; //List of cars
  gears: string[] = ['Automatic', 'Manually'];//Set gear array
  displayedColumns: string[] = ['CarNumber','Manufacturer','Model','Year', 'Mileage', 'Proper', 'Available', 'BranchID','Image', 'Actions']; //List of columns
  dataSource = new MatTableDataSource<ICarStock>(); //Create new object of data source -> to build table
  YesNo: string[] = ['Yes', 'No']; //List of Yes/No

  //Add a new car to DB
  addCarToStock() {
    //Open dialog page to add a new car
    const dialogRef = this.dialog.open(AddCarStockComponent, {
    });
    //After close -> refresh page data by fire ngOnInit function
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  deleteCarToStock(car: ICarStock) {
    sweetalert2.fire({ 
      title: `Are you sure you want to delete the selected car?`,
      text: `You won't be able to revert this!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes,I'm 100% sure!`
    }).then(async  (result) => {
      if (result.value) {

        const deleteCarStockResponse = await this.carsApi.deleteCarStock(car.carNumber);

        if (deleteCarStockResponse.indexOf('successfully') > -1) {
          sweetalert2.fire(
            'Updated!',
            `Car has been deleted successfully.`, 
            'success'
          );
          this.ngOnInit(); 
        } else {
          sweetalert2.fire({
            type: 'error',
            title: 'Something went wrong!',
            html: `Failed to delete selected Car,<br>This might happen since this car is ordered ! `,
          });
        }
      }
    });


  }
  updateCarToStock(car: ICarStock) {
    sweetalert2.fire({
      title: `Are you sure you want to update the selected car?`,
      text: `You won't be able to revert this!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes,I'm 100% sure!`
    }).then(async  (result) => {
      if (result.value) {
        const carStockUpdateResponse = await this.carsApi.updateCarStock(car);
        if (carStockUpdateResponse.indexOf('successfully') > -1) {
          sweetalert2.fire(
            'Updated!',
            `Car has been updated successfully.`,
            'success'
          );
          this.ngOnInit();
        } else {
          sweetalert2.fire({
            type: 'error',
            title: 'Something went wrong!',
            html: `Failed to update Car!`,
          });
        }
      }
    });
  }

 
  onSelectFile(event, car: ICarStock) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (e) => {
       if (e.target['result'].toString().split(';')[0].indexOf('image') > -1 ) {
         car.image = e.target['result'].toString();
       } else {
        sweetalert2.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Invalid file,Please upload Image.',
        });
       } 
      };
    }
  }

  async ngOnInit() {

    this.carsStock = await this.carsApi.getAllCars();
    this.carsStock.forEach(u => {

      u['isEdit'] = true;

      if(u.image != null && u.image.indexOf('ella')){
        u.image = u.image.replace('ella',';'); //cant save semicolin to DB so replace with ella text
      }
    });
 
    this.branches = await this.branchApi.getBranches();
    this.carsType = await this.carsApi.getAllCarsType();
    this.dataSource.data = this.carsStock;
    this.dataSource.paginator = this.paginator;
  }

}
