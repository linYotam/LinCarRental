import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CommonService } from '../Services/commonService';

//Dependency injection
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private commonService: CommonService, private router: Router) {}

  //Check if user have token -> if so, the user can navigate to certain pages. else -> navigate to login page
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.commonService.getToken()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
 