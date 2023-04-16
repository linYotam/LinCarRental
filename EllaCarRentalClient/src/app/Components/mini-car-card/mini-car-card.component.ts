import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import sweetalert2 from 'sweetalert2';
import { Router, NavigationExtras } from '@angular/router';
import { CommonService } from 'src/app/Services/commonService';
import { MatDialog } from '@angular/material';

//Rent period propeties
interface IRentPeriod {
  begin: Date;
  end: Date;
}
@Component({
  selector: 'app-mini-car-card',
  templateUrl: './mini-car-card.component.html',
  styleUrls: ['./mini-car-card.component.scss']
})
export class MiniCarCardComponent implements OnInit {

  constructor(private router: Router, private dialog: MatDialog, private commonService: CommonService) {}

  @Output() removeFavoriteEvent = new EventEmitter<any>(); //Remove favorite event -> parent:pick-car
  @Output() addCarEvent = new EventEmitter<any>(); //Add favorite car event -> parent: pick-car

  @Input() rentPeriod: IRentPeriod; //Get rent period info from parent: pick-car
  @Input() favoriteCars: any; //get list of favorite cars from parent: pick-car
  @Input() manufacturer: any; //get manufacturer of favorite car from parent: pick-car
  @Input() model: any; //get model of favorite car from parent: pick-car
  @Input() year: any; //get year of favorite car from parent: pick-car


  //fire remove favorite car event
  removeFromFavorites(car:any){
    this.removeFavoriteEvent.emit(car);
  }

  //Rent car
  rentCar(car: any, rentPeriod: IRentPeriod) {
    //Make sure user exist
    const token = sessionStorage.getItem('token');
    if (!token) {
      //No user exist
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
          //go to login page
          this.router.navigate(['login']);
        if(result.dismiss === sweetalert2.DismissReason.cancel)  
        //go to register page
          this.router.navigate(['register']);
      }); 
      return;
    }

    //Get rent period data
    rentPeriod = this.rentPeriod; 
    //Set car and rent details
    const navigationExtras: NavigationExtras = {... car, rentPeriod};
    //navigate to payment page with car and rent details
    this.router.navigate(['/Cars/Payment'], navigationExtras);
    
  }

  ngOnInit() {
  }
}
