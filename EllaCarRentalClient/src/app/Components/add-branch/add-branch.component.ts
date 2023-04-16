import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import sweetalert2 from 'sweetalert2';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { BranchesService } from 'src/app/Services/branches.service';

//Interface of a branch object
export class INewBranch {
  address: string;
  Latitude: number;
  longitude: number;
  name: string;
  city: string;
}

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})

export class AddBranchComponent implements OnInit {
 
  constructor(private branchApi: BranchesService, public dialog: MatDialog) { }

  //Set a new branch object
  form: INewBranch = new INewBranch();

  //Set the form group and set the validations of each form controller
  fg: FormGroup = new FormGroup({
    AddressFormControl : new FormControl('', [
      Validators.required
    ]),
    LatitudeFormControl : new FormControl('', [
      Validators.required,
      Validators.pattern(/^[-+]?[0-9]*\.?[0-9]+$/) //only numbers - including minus
    ]),
    LongitudeFormControl : new FormControl('', [
      Validators.required,
      Validators.pattern(/^[-+]?[0-9]*\.?[0-9]+$/)//only numbers - including minus
    ]),
    NameFormControl : new FormControl('', [
      Validators.required
    ]),
    CityFormControl : new FormControl('', [
      Validators.required
    ])
  });

  //Search the latitude and longitude of a given address
  async search(){

    let location = "";

    //check that both address field & city name fields not empty
    if((this.form.address === undefined || this.form.address === "")&&(this.form.city === undefined || this.form.city==="")){
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: '<h3>You need to insert an address or city name or both to get the location.</h3>',
      });
    }
    else {
    
      //Get address/city name info
      if(this.form.address != undefined && this.form.city != undefined)
      location = this.form.address + " " + this.form.city;

      if(this.form.address != undefined && this.form.city === undefined)
      location = this.form.address;

      if(this.form.address === undefined && this.form.city != undefined)
      location = this.form.city;

      //Send the location to the server and from there, to positionstack API
      const searchLocation = await this.branchApi.getLocation(location);

      //Set the location values 
      this.form.Latitude = searchLocation.latitude;
      this.form.longitude = searchLocation.longitude;
    }
  }
 
  //Add a new branch to the Branch table in DB
  async addBranch() {
    //Check the form if all the fields are valid
    if (!this.fg.valid) {
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: '<h3>some fields on your form are invalid!<br>please check your information</h3>',
      });
      return;
    }

    //Post the new branch to the server.
    const addBranchResponse = await this.branchApi.addBranch(this.form);
 
    //If success -> show success alert
    if (addBranchResponse.indexOf('successfully') > -1 ) {
      sweetalert2.fire({
        type: 'success',
        title: `Branch added successfully`,
      });

      this.dialog.closeAll();
    //If failed -> show failed alert
    } else {
      sweetalert2.fire({
        type: 'error',
        title: 'Something went wrong!',
        text: `Failed to add branch!`,
      });
    }
  }

  ngOnInit() {
  }

}
