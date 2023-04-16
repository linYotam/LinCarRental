import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent, ErrorStateMatcher, MatDialog } from '@angular/material';
import sweetalert2 from 'sweetalert2';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/Services/users.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Services/commonService';

//Material matcher for form validation
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

//User properties
export class IUser {
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  id: string;
  dateOfBirth: string; 
  gender: string;
  email: string;
  password: string;
  image: string;
  roleType: string;
}

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  constructor(private usersApi: UsersService, public router: Router, public dialog: MatDialog, private commonService: CommonService) {
    this.form.image = "/assets/images/profile-placeholder.png"; //Set default image
  }
 
  submitted: boolean; //form submitted

  roleTypes: string[] = ['Customer', 'Manager', 'Admin']; //List of role types

  matcher = new MyErrorStateMatcher(); //Create new state matcher for validation

  form: IUser = new IUser(); //Create new user object

  hide = true; //Init hide status

  // Validation - Minimum date for regeister is 16.
  maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() - 16));

  //Form group validation 
  fg: FormGroup = new FormGroup({
    emailFormControl : new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    firstNameFormControl : new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S*$/), //White spaces
      Validators.pattern(/^[a-zA-Z]+$/) //Only english letters
    ]),
    lastNameFormControl : new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S*$/), //White spaces
      Validators.pattern(/^[a-zA-Z]+$/)//Only english letters
    ]),
    IDFormControl : new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S*$/),//White spaces
      Validators.pattern(/^\d+$/)//Only digits
    ]), 
    userNameFormControl : new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S*$/),//White spaces
    ]),
    passwordFormControl : new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S*$/),//White spaces
    ])
  });

  //Update user account
  async updateAccount() {

    //Update Form group controls so the form will be valid.
    this.updateControls();

    //If user came from register page -> set role type as C (client) as default
    if (!this.form.roleType && this.router.url.indexOf('register') > -1) {
      this.form.roleType = 'C';
    }

    //Check form validation
    if (!this.fg.valid || typeof  this.form.gender === 'undefined' || typeof  this.form.roleType === 'undefined' || !this.validayeID(this.form.id)) {
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: '<h3>Some fields are missing or incorrect!</h3>',
      });
      return;
    }  

    try{

      //Send request to DB -> update user
      const updateAccount = await this.usersApi.updateUserWithPassword(this.form);

      if (updateAccount.indexOf('successfully') > -1) {
        sweetalert2.fire({
          type: 'success',
          title: `Account of ${this.form.firstName} ${this.form.lastName} Updated Successfuly!`
        });

        //When finished navigate to home page
        this.router.navigate(['/home']);

      }  
      else {
          sweetalert2.fire({
            type: 'error',
            title: 'Something went wrong!',
            text: `Failed to update accoutn of ${this.form.firstName} ${this.form.lastName}`
          });
      } 
    }
    catch(err){
      if(err instanceof Error || err.ok === false)
        sweetalert2.fire({
          type: 'error',
          title: 'Oops...',
          html: '<h3>Something wend wrong: '+err.error+'</h3>',
        });
    }
  }

  //Upload new image
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url -> base64

      reader.onload = (e) => { // called once readAsDataURL is completed
       if (e.target['result'].toString().split(';')[0].indexOf('image') > -1 ) {
        this.form.image = e.target['result'].toString();
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

  //Set date in current time zone
  addDate(event: MatDatepickerInputEvent<Date>) {
    var futureDate = new Date(event.value.setDate(event.value.getDate() + 1));
    this.form.dateOfBirth = futureDate.toISOString().split('T')[0]; 
  }

  //Set new value to 'key' field 
  SelectedValue(key: string, value: string) {
    this.form[`${key}`] = value;
  } 

  //Start the upload image logic
  uploadFile() {
    document.getElementById('btn-uploadfile').click();
  } 

  //Update Form group controls so the form will be valid.
  updateControls(){

    this.fg.controls['emailFormControl'].setValue(this.form.email);
    
    this.fg.controls['firstNameFormControl'].setValue(this.form.firstName);
    
    this.fg.controls['lastNameFormControl'].setValue(this.form.lastName);
     
    this.fg.controls['IDFormControl'].setValue(this.form.id);

    this.fg.controls['userNameFormControl'].setValue(this.form.userName);
    
    this.fg.controls['passwordFormControl'].setValue(this.form.password);

  }

  //Init date
  async ngOnInit() {

    //Send request to DB -> get user info
    this.form = await this.usersApi.getUserByUserId(this.commonService.getUserID()); //Get user info

    if (this.form === null) {
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: `<h3>Something went wrong!</h3>`,
      });
    }    
  }

  //Validate ID with Israel rules
  validayeID(id:string):boolean {
    
    id = id.trim();

    if (id.length > 9 || isNaN(+id)) return false;

    id = id.length < 9 ? ("00000000" + id).slice(-9) : id;

    return Array.from(id, Number).reduce((counter, digit, i) => {
      const step = digit * ((i % 2) + 1);
      return counter + (step > 9 ? step - 9 : step);
    }) % 10 === 0;
  }
}

