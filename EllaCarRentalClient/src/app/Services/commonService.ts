import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CarsService } from './cars.service';
import { Router } from '@angular/router';

//Dependency injection
@Injectable()
export class CommonService {

    constructor(private carsApi: CarsService, private router: Router) { }

    //Create a new object of jwt service for token
    jwtHelper = new JwtHelperService();

    //Log out user from session 
    signOut() {
        sessionStorage.clear();
        this.router.navigate(['/home']);
    }

    //Get user token
    getToken() {
        return sessionStorage.getItem('token');
    }

    //Get user name from token
    getUserName(): string {
        const token = this.getToken();
        return token ? this.jwtHelper.decodeToken(token).unique_name : null;
    }

    //Get user role type from token
    getRole(): string {
        const token = this.getToken();
        return token ? this.jwtHelper.decodeToken(token).role : null;
    }

    //Get user id from token
    getUserID(): number {
        const token = this.getToken();
        
        if (token === null) return null;

        return this.jwtHelper.decodeToken(token).primarysid;
    }
 
    //Get number of user active car orders from DB
    async setNumbersOfOrders() {
        const userID = this.getUserID();
        if (userID) {

            const numberOfOrders = await this.carsApi.getRentCarsByUserID(userID);
            let counter = 0;

            //Make sure order is still active
            numberOfOrders.forEach(order => {
                if(order.returnTime ===null)
                    counter++;
            });

            //Clear item from session (Important when order a new car)
            sessionStorage.removeItem('numberOfOrders');
            //Create a new item in session with updated data
            sessionStorage.setItem('numberOfOrders', counter.toString());
        }
    } 
}
