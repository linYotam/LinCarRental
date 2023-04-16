import { Component, Input } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import sweetalert2 from 'sweetalert2';
import { MatDialog } from '@angular/material';
import { Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/Services/commonService';

//Rent Period properties
interface IRentPeriod {
  begin: Date;
  end: Date;
}

@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.scss'],
})
export class CarCardComponent  {
  constructor(private router: Router, private dialog: MatDialog, private commonService: CommonService) {}
 
  @Output() favoriteEvent = new EventEmitter<any>(); //Send favorite car info back to parent -> pick-car
  @Output() removeFavoriteEvent = new EventEmitter<any>();//Sent remove favorite car info back to parent -> pick-car

  //Get car info from parent -> pick-car
  @Input() carsInput: any;
  @Input() filter: boolean;
  @Input() daysRange: any;
  @Input() manufacturer: any;
  @Input() model: any;
  @Input() year: any; 
  @Input() gear: any;
  @Input() rentPeriod: IRentPeriod;
  @Input() favoriteIcon:string;

  //Rent car
  rentCar(car: any, rentPeriod: IRentPeriod) {

    //Get token info
    const token = sessionStorage.getItem('token');
    if (!token) {
      //No token -> no user in system
      sweetalert2.fire({
        title: 'Oops...',
        html: '<h3>You must be logged in order to reserve car!</h3>',
        type: 'error',
        showCancelButton: true,
          showCloseButton: true,
          showConfirmButton:true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'green',
        cancelButtonText: 'Register',
        confirmButtonText: 'Login'
      }).then((result) => {
        if(result.value === true)
          this.router.navigate(['login']); //sent to login page
        if(result.dismiss === sweetalert2.DismissReason.cancel)  
          this.router.navigate(['register']); //send to register page
      }); 
      return;
    }

    //get car details and send them to payment page while navigate
    const navigationExtras: NavigationExtras = {... car, rentPeriod};
    this.router.navigate(['Cars/Payment'], navigationExtras);
  }

  //Get user id
  getUserId(): number {
    return this.commonService.getUserID();
  }

  //Set gear image -> auto or manual
  setGearImage(gear:string):string{
    if(gear === 'A')
      return "./assets/images/auto-gear.jpg";

      return "./assets/images/manual-gear.jpg";
  }

  //Toggle car favorite status
  toggleToFavorites(car:any){

    //You must be logged in to select favorite car
    if(this.commonService.getUserID()===null){
        sweetalert2.fire({
          title: 'Oops...',
          html: '<h3>You must be logged in, In order to favorite a car!</h3>',
          type: 'error',
          showCancelButton: true,
          showCloseButton: true,
          showConfirmButton:true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: 'green',
          cancelButtonText: 'Register',
          confirmButtonText: 'Login'
        }).then((result) => {
          if(result.value === true)
            this.router.navigate(['login']);//send to login page
          if(result.dismiss === sweetalert2.DismissReason.cancel)  
            this.router.navigate(['register']);//send to register page
        }); 
      return;
    }

    //change favorite icon according to favorite status
    if(car.favoriteIcon === "favorite"){
      car.favoriteIcon = "favorite_border";
      //Raising the event to pick-car component.
      this.removeFavoriteEvent.emit(car);
    }
    else{
      car.favoriteIcon = "favorite";
      //Raising the event to pick-car component.
      this.favoriteEvent.emit(car);
    }
  }
  
  ngOnInit() {
  }
}
