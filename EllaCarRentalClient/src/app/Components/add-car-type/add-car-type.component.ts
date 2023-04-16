import { Component, OnInit } from '@angular/core';
import { CarsService } from 'src/app/Services/cars.service';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher, MatDialog, MatDatepickerInputEvent } from '@angular/material';
import sweetalert2 from 'sweetalert2';
import { NativeDateAdapter, DateAdapter,  } from '@angular/material';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

//Return date in YYYY (only year) format
export class CustomDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    const formatString = 'YYYY';
    return moment(date).format(formatString);
  }
}

//Validation of form
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

//Car type properties
export class ICarType {
  manufacturer: string;
  model: string;
  costPerDay: number;
  costPerDayDelay: number;
  year: string;
  gear: string; 
}


@Component({
  selector: 'app-add-car-type',
  templateUrl: './add-car-type.component.html',
  styleUrls: ['./add-car-type.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: CustomDateAdapter
    }
  ]
})
export class AddCarTypeComponent implements OnInit {

  constructor(private carApi: CarsService, public dialog: MatDialog) { }

  form: ICarType = new ICarType(); //New object of car type
  matcher = new MyErrorStateMatcher();//New object of form validation
  nextYear = new Date().getFullYear() + 1;//Set next year value
  maxDate = new Date(this.nextYear, 0, 1);//Set max date value

  //Check form group validation
  fg: FormGroup = new FormGroup({
    ManufacturerFormControl : new FormControl('', [
      Validators.required
    ]),
    ModelFormControl : new FormControl('', [
      Validators.required
    ]),
    CostPerDayFormControl : new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S*$/),
      Validators.pattern(/^\d+(\.\d{1,6})?$/)
    ]),
    CostPerDayDelayFormControl : new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S*$/),
      Validators.pattern(/^\d+(\.\d{1,6})?$/)
    ]),
    DateFormControl : new FormControl('', [
      Validators.required
    ])
  });

  //Convert date to year only -> YYYY -> from input
  addYearToForm(event: Date) {
    this.form.year = event.getFullYear().toString();
  }

  //Convert date to year only -> YYYY -> from date picker 
  addDateToForm(event: Date) {
    this.fg.get('DateFormControl').setValue(event);
    this.form.year = event.getFullYear().toString();
  }
 
  //Add new car type
  async addCarType() {
    //Check form validation
    if (!this.fg.valid || typeof  this.form.gear === 'undefined') {
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: '<h3>some fields on your form are invalid!<br>please check your information</h3>',
      });
      return;
    }
    //Add new car type
    const addCarTypeResponse = await this.carApi.addCarType(this.form);
    if (addCarTypeResponse.indexOf('successfully') > -1 ) {
      sweetalert2.fire({
        type: 'success',
        title: `Car Type added successfully`,
      });

      //Close dialog 
      this.dialog.closeAll();

    } else {
      sweetalert2.fire({
        type: 'error',
        title: 'Something went wrong!',
        text: `Failed to add car type!`,
      });
    }
  }

  ngOnInit() {
  }

}
