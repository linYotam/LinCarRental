import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import sweetalert2 from 'sweetalert2';
import { UsersService } from 'src/app/Services/users.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material';
import { CommonService } from 'src/app/Services/commonService';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  //Set a new jwt service
  jwtHelper = new JwtHelperService(); 

  showFailedLogin = false;
  hide = true;
  errorMessage:string;

  constructor(private router: Router, private users: UsersService, private dialog: MatDialog, private commonService: CommonService) {}

  //Set form validation
  matcher = new MyErrorStateMatcher();

  //Check email validation
  whiteSpacesValidationEmail = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.pattern(/^\S*$/) //White spaces
  ]);

  //Check password validation
  whiteSpacesValidationPassword = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\S*$/) //White spaces
  ]);

  //Login user with email and password
  async loginUser(email: string, password: string) {

    //if there's no email or password show error
    if (!email || !password) {
      sweetalert2.fire({
        type: 'error',
        title: 'Oops...',
        html: '<h3>Email or password are missing!</h3>',
      });
      return;
    }

    //Set failed login error flag to false 
    this.showFailedLogin = false;

    //Try to login user
    const loginResponse = await this.users.login(email, password);

    //Check login status
    switch(loginResponse.status) { 
      case 0: { 
        this.errorMessage = "Error connecting to the server";
        this.showFailedLogin = true; 
         break; 
      } 
      case 401: { 
        this.errorMessage = "Username or password is incorrect";
        this.showFailedLogin = true;
         break; 
      } 
      default: { 

        //Set token to user
        sessionStorage.setItem('token', loginResponse.jwtToken);
        //Get number of car orders from user
        this.commonService.setNumbersOfOrders(); 
  
        //Show welcome alert
        sweetalert2.fire({ 
          type: 'success',
          title: `Welcome ${loginResponse.userName}`
        });
  
        //If user is in login page reroute to home page
        if (this.router.url.indexOf('login') > -1) {
          this.router.navigate(['/home']);
        //If user is logged in from other pages -> just close the dialog page  
        } else {
          this.dialog.closeAll();
        }
        break; 
      } 
   } 
  }
}
