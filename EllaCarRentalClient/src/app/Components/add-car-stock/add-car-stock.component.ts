import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher, MatDialog } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { CarsService } from 'src/app/Services/cars.service';
import { BranchesService } from 'src/app/Services/branches.service';
import sweetalert2 from 'sweetalert2';

//Car properties
export class ICarStock {
  carNumber: string;
  typeId: number;
  mileage: number;
  proper: string;
  available: string;
  branchId: number;
  image:string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  //Check if form is valid 
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-car-stock',
  templateUrl: './add-car-stock.component.html',
  styleUrls: ['./add-car-stock.component.scss']
})
export class AddCarStockComponent implements OnInit {

  constructor(private carApi: CarsService, private branchApi: BranchesService, public dialog: MatDialog) {
    this.rentCar.image = "/assets/images/noPhoto.jpg"; //Default image -> no car image
  }

  carsType: any; //List of car types
  branches: any; //List of branches
  rentCar: ICarStock = new ICarStock(); //New object of car
  YesNo: string[] = ['Yes', 'No'];
  //new error state matcher for form validation
  matcher = new MyErrorStateMatcher();
    CarNumberFormControl = new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S*$/),
      Validators.pattern( /^\d+$/)
    ]);
    MileageFormControl = new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9.,]+$/)
    ]);

  //Add new car  
  async addCarStock() {

    //Send car info to car service -> to add car to DB
    const addCarToStockResponse = await this.carApi.addCarToStock(this.rentCar);

    //Check results -> is success show proper alert
    if (addCarToStockResponse.indexOf('successfully') > -1 ) {
      sweetalert2.fire({
        type: 'info',
        title: `Car successfully added to stock`,
      });

      //Close dialog after success
      this.dialog.closeAll();

    //If something went wrong -> show proper alert
    } else {
      sweetalert2.fire({
        type: 'error',
        title: 'Something went wrong!',
        text: `Failed to add car!`,
      }); 
   }
  }

  //Update car mileage -> remove ','
  replaceMileage(event){ 
    this.rentCar.mileage=event.replace(',','');
  }

  //Add car image from file
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (e) => { // called once readAsDataURL is completed
       if (e.target['result'].toString().split(';')[0].indexOf('image') > -1 ) {
        this.rentCar.image = e.target['result'].toString();
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

  //start upload file logic by clicking on the file field
  uploadFile() {
    document.getElementById('btn-uploadfile').click();
  } 

  async ngOnInit() {
    this.carsType = await this.carApi.getAllCarsType(); //Get all car types to list
    this.branches = await this.branchApi.getBranches(); //Get all branches to list
  }

}
