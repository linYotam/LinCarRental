import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/Services/commonService';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  avatar:any = null;

  //Init common services
  constructor(private commonService: CommonService, private sanitizer: DomSanitizer) {
  }

  //Log out by clearing the session 
  signOut() {
    this.commonService.signOut();
  }

  //Return user name from token
  getUserName(): string {
    return this.commonService.getUserName();
  }

  //Get role from token
  getRole(): string {
    return this.commonService.getRole();
  }

  //get number of orders from session storage
  getNumberOfOrders() {
    return sessionStorage.getItem('numberOfOrders');
  }

  ngOnInit() {
  }

}
 