import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent, ErrorStateMatcher, MatDialog } from '@angular/material';
import sweetalert2 from 'sweetalert2';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/Services/users.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Services/commonService';

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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})


export class RegisterComponent implements OnInit {

  constructor(private usersApi: UsersService, public router: Router, public dialog: MatDialog, private commonService: CommonService) {
    this.form.image = "/assets/images/profile-placeholder.png"; //Default user image
  }
 
  submitted: boolean; //Init submit 

  roleTypes: string[] = ['Customer', 'Manager', 'Admin']; //Init list of role types

  matcher = new MyErrorStateMatcher(); //Init matcher of material fields for validation 

  form: IUser = new IUser(); //Create new user object

  // Validation - Minimum date for regeister is 16.
  maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() - 16));

  //Set validation roles of register form group
  fg: FormGroup = new FormGroup({
    emailFormControl : new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    firstNameFormControl : new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S*$/), //No empty spaces
      Validators.pattern(/^[a-zA-Z]+$/) //Only english letters
    ]),
    lastNameFormControl : new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S*$/),//No empty spaces
      Validators.pattern(/^[a-zA-Z]+$/)//Only english letters
    ]),
    IDFormControl : new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S*$/),//No empty spaces
      Validators.pattern(/^\d+$/)//only digits
    ]), 
    userNameFormControl : new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S*$/),//No empty spaces
    ]),
    passwordFormControl : new FormControl('', [
      Validators.required,
      Validators.pattern(/^\S*$/),//No empty spaces
    ])
  });

  //Create new user in DB
  async register() {

    //Set default role type as client 
    if (!this.form.roleType && this.router.url.indexOf('register') > -1) {
      this.form.roleType = 'C';
    }
    //Check if registration form is valid
    if (!this.fg.valid || typeof  this.form.gender === 'undefined' || typeof  this.form.roleType === 'undefined' || !this.validayeID(this.form.id)) {
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: '<h3>Some fields are missing or incorrect!</h3>',
      });
      return;
    }  

    try{

      //Add new user to DB
      const addNewUser = await this.usersApi.register(this.form);

      //If new user created from register page and not by manager
      if(this.router.url.indexOf('Managment') < 0){

        sweetalert2.fire({
          type: 'success',
          title: `Welcome ${this.form.firstName} ${this.form.lastName}`,
        });

        //If success -> login the new user
        const loginResponse = await this.usersApi.login(this.form.email, this.form.password);

        //Set token
        if (!loginResponse.status) {
          sessionStorage.setItem('token', loginResponse.jwtToken);
        }

        //Navigate to home page
        this.router.navigate(['/home']);
      }
      else{

        sweetalert2.fire({
          type: 'success',
          title: `${this.form.firstName} ${this.form.lastName} Has been added.`,
        });

        this.dialog.closeAll();
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

  //Upload new user image
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url to base64

      reader.onload = (e) => { // called once readAsDataURL is completed
       if (e.target['result'].toString().split(';')[0].indexOf('image') > -1 ) {
        this.form.image = e.target['result'].toString();
       } else {
        sweetalert2.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Invalid file, Please upload Image.', 
        });
       }
      };
    }
  }

  //Add new date with local time zone
  addDate(event: MatDatepickerInputEvent<Date>) {
    var futureDate = new Date(event.value.setDate(event.value.getDate() + 1));
    this.form.dateOfBirth = futureDate.toISOString().split('T')[0];
  }

  //Update form field -> key represent field name
  SelectedValue(key: string, value: string) {
    this.form[`${key}`] = value;
  } 

  //Start upload image logic
  uploadFile() {
    document.getElementById('btn-uploadfile').click();
  } 

  ngOnInit() {

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
