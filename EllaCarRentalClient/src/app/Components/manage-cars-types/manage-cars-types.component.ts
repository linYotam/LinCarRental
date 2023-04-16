import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import sweetalert2 from 'sweetalert2';
import { CarsService } from 'src/app/Services/cars.service';
import { AddCarTypeComponent } from '../add-car-type/add-car-type.component';

//Car type properties
export interface ICarType {
  typeId:number;
  manufacturer: string;
  model: string;
  gear: string;
  image: string;
  year: string;
  costPerDay: number;
  costPerDayDelay: number;
}


@Component({
  selector: 'app-manage-cars-types',
  templateUrl: './manage-cars-types.component.html',
  styleUrls: ['./manage-cars-types.component.scss']
})
export class ManageCarsTypesComponent implements OnInit {

  constructor(private carsApi: CarsService, private dialog: MatDialog) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; //Set paginator
  gears: string[] = ['Automatic', 'Manually']; //List of gear types
  displayedColumns: string[] = ['Manufacturer', 'Model', 'Gear', 'Year', 'CostPerDay', 'CostPerDayDelay', 'Actions']; //List of table columns
  dataSource = new MatTableDataSource<ICarType>(); //Create new datasource of car type for table
  carsType: ICarType[]; //List of car types
 
  //Add new car type in DB
  addCarType() {
    //Open dialog page
    const dialogRef = this.dialog.open(AddCarTypeComponent, {height:'600px',width: '600px'});
    dialogRef.afterClosed().subscribe(result => {
      //After closing dialog page refresh data with ngOnInit
      this.ngOnInit();
    });
  }

  //Delete car type from DB
  async deleteCarType(carType: ICarType) {
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
        //Send request to DB
        const deleteCarTypeResponse = await this.carsApi.deleteCarType(carType.typeId);
        if (deleteCarTypeResponse.indexOf('successfully') > -1) {
          sweetalert2.fire(
            'Updated!',
            `Car Type has been deleted successfully.`,
            'success'
          );
          //After deleting car type refresh data with ngOnInit
          this.ngOnInit();
        } 
        else {
          sweetalert2.fire({
           type: 'error',
            title: 'Something went wrong!',
            html: `Failed to delete Car Type,<br>This might happen since this car type exists under cars stock!`,
          });
        }
      }
    });
  }

  //Update car type in DB
  async updateCarType(carType: ICarType) {
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
        //Send request to DB
        const carTypeUpdateResponse = await this.carsApi.updateCarType(carType);
        if (carTypeUpdateResponse.indexOf('successfully') > -1) {
          sweetalert2.fire(
            'Updated!',
            `Car Type has been updated successfully.`,
            'success'
          );
          //After updating a car type refresh data with ngOnInit
          this.ngOnInit();
        } else {
          sweetalert2.fire({ 
            type: 'error',
            title: 'Something went wrong!',
            html: `Failed to update Car Type,<br>This might happen since car type already exists!`,
          });
        }
      }
    });
  }

  //Refresh data of car type
  async ngOnInit() {
    //Get list of car types from DB
    this.carsType = await this.carsApi.getAllCarsType();
    //For each car type set as editable
    this.carsType.forEach(u => {
      u['isEdit'] = true;
    });
    //Set table datasource with cars type details
    this.dataSource.data = this.carsType;
    //Set paginator 
    this.dataSource.paginator = this.paginator;
  }

}
