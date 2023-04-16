import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { CarsService } from 'src/app/Services/cars.service';
import { BranchesService } from 'src/app/Services/branches.service';
import { Alert } from 'selenium-webdriver';
import { format } from 'url';
import { FormBuilder, Validators, FormArray, FormControl, NgForm } from '@angular/forms';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { UsersService } from 'src/app/Services/users.service';
import { CommonService } from 'src/app/Services/commonService';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Router,NavigationExtras } from '@angular/router';

//Rent period properties
interface IRentPeriod {
  begin: Date;
  end: Date;
}

//Favorite car properties
export class IFavorite {
  userId:number;
  carNumber:string;

  //Init favorite car params
  constructor(userId:number,carNumber:string){
    this.userId = userId;
    this.carNumber = carNumber;
  }
}

//Mini card (favorite car card) properties
export class IMiniCard {

  userId:number;
  carNumber:string;
  manufacturer:string;
  model:string; 
  year:string; 
  image:string;

  //Init mini cards of favorite car properties
  constructor(userId:number, carNumber:string, image:string, manufacturer:string, model:string, year:string)
  {
    this.userId = userId;
    this.carNumber = carNumber;
    this.image = image;
    this.manufacturer = manufacturer;
    this.model = model;
    this.year = year;
    this.image = image;
  }
}

//Car properties -> include branch info and type info
export class ICar {
   carNumber:string;
   typeId:number;
   carMileage:number;
   image:string;
   branchCity:string;
   branchAddress:string;
   branchName:string;
   manufacturer:string;
   model:string; 
   costPerDay:number;
   costPerDayDelay:number;
   year:string; 
   gear:string;
   favoriteIcon:String;
   
   //Init car data
  constructor(
    carNumber:string,
    typeId:number,
    carMileage:number, 
    image:string, 
    branchCity:string,
    branchAddress:string,
    branchName:string,
    manufacturer:string,
    model:string,
    costPerDay:number,
    costPerDayDelay:number,
    year:string,
    gear:string,
    favoriteIcon:string){
      this.carNumber = carNumber;
      this.typeId = typeId;
      this.carMileage = carMileage;
      this.image = image;
      this.branchCity = branchCity;
      this.branchAddress = branchAddress;
      this.branchName = branchName;
      this.manufacturer = manufacturer;
      this.model = model;
      this.costPerDay = costPerDay;
      this.costPerDayDelay = costPerDayDelay;
      this.year = year;
      this.gear = gear;
      this.favoriteIcon = favoriteIcon;
    }
}

@Component({
  selector: 'app-pick-car',
  templateUrl: './pick-car.component.html',
  styleUrls: ['./pick-car.component.scss'],
})
export class PickCarComponent implements OnInit {

  @ViewChild('drawer', { static: true }) drawer: MatDrawer; //Set side drawer

  constructor(private carsApi: CarsService,private router:Router, private usersApi: UsersService, private commonService: CommonService, private branchesApi: BranchesService, private fb: FormBuilder) { }
  
  myControl = new FormControl(); //Init list of form controls
  options: string[] = []; //init autocomplete list
  filteredOptions: Observable<string[]>; //init filtered options of autocomplete list

  //Filter autocomplete options
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  allCarsType: any = []; //Init list if cars types
  favoriteCarsList:any = []; //Init list of favorite cars
  favoriteNewCar:IFavorite; //Init favorite car object
  gears: string[] = ['Automatic', 'Manually']; //Init gear list
  manufacturers: string[]; //Init list of manufactures
  models: string[]; //Init list of models
  years: string[]; //Init list of years
  branches: any; //Init list of branches
  manufacturer: string; //init manufactor param
  model: string; //Init model param
  gear: string; //Init gear param
  year: string; //Init year param
  daysRange: number; //Init range of days param
  currentDate: Date = new Date(); //Init current date
  dateValue: Date = null; //Init date param
  filter: boolean ; //Init filter param
  rentPeriod: IRentPeriod; //init rent period object
  newCar: ICar; //Init car object
  storedList: any = []; //init list of cars -> for backup purposes
  favoriteIcon:string; //init favorite icon -> red heart
  favoriteButtonText:string = "Show Favorites"; //init label on show/hide drawer button
  userId:number; //Init user id param
  getAllFavorites:any;//init list of favorites cars

  //Set form group 
  formdata = this.fb.group({
    dateControl:[''],
    gearControl:[''],
    yearControl:[''],
    manufacturerControl:[''],
    modelControl:[''],
    searchControl:['']
  });

  //Get user id from token
  getUserId():number{
    return this.commonService.getUserID();
  }

  //Show/hide side drawer with list of favorites cars
  toggleDrawer(element:any){

    //Show/hide
    element.toggle();

    //Set button label
    if(element.opened === true)
      this.favoriteButtonText = "Hide Favorites";
    else
      this.favoriteButtonText = "Show Favorites";
  }

  //Add new favorite car to DB
  async addToFavoriteList(favoriteCar:any){

    //Find favorite car in list of cars and add it to favorite list
    this.storedList.forEach((element,index)=>{

      //add new favorite car to list and set favorite icon
      if(element.carNumber===favoriteCar.carNumber){
        this.favoriteCarsList.push(element);
        this.storedList[index].favoriteIcon = "favorite";
        this.favoriteNewCar = new IFavorite(this.userId, favoriteCar.carNumber); //Create new favorite car & send it to DB.
      }
    });

    //Add new favorite car to DB
    if(this.favoriteNewCar != null && this.favoriteNewCar != undefined)
    {
      const newFavoriteCar = await this.usersApi.addFavorite(this.favoriteNewCar);
    }

    //If drawer close -> open side drawer with list of favorite cars
    if(this.drawer.opened === false)
      this.toggleDrawer(this.drawer);

  }

  //Remove favorite car from DB
  async removeFromFavoriteList(car:any){

    //Remove favorite car from favorite list
    this.favoriteCarsList.forEach((element,index)=>{
      if(element.carNumber===car.carNumber){
        this.favoriteCarsList.splice(index, 1);
        this.favoriteNewCar = new IFavorite(this.userId, car.carNumber); //Create new favorite car & send it to DB.
      }
    });
 
    //Delete favorite car from DB
    if(this.favoriteNewCar != null && this.favoriteNewCar != undefined)
    {
      const newFavoriteCar = await this.usersApi.deleteFavorite(this.favoriteNewCar);
    }

    //Remove favorite icon
    this.allCarsType.forEach((element,index)=>{
      if(element.carNumber===car.carNumber)
      this.allCarsType[index].favoriteIcon = "favorite_border";
    });
  }    
 
  //calculate total days of rent period
  calculateDaysDiff(rentPeriod: any) { 
    this.rentPeriod = rentPeriod;
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    this.daysRange = Math.round(Math.abs((rentPeriod.end.getTime() - rentPeriod.begin.getTime()) / (oneDay)));
  }

  //Update list of cars according to gear filter
  updateGear(gear: string) {
    this.allCarsType = [];
    this.storedList.forEach(val => this.allCarsType.push(Object.assign({}, val)));
    this.gear = gear[0];
    this.years =  Array.from(new Set(this.allCarsType.filter(car => car.gear === this.gear).map(({year})  => year)));
    this.allCarsType = this.allCarsType.filter(car => car.gear === this.gear);
  }

  //Update list of cars according to Manufacturer filter
  updateManufacturerByYearAndGear(year: string) {
    this.allCarsType = [];
    this.storedList.forEach(val => this.allCarsType.push(Object.assign({}, val)));
    this.year = year;
    this.manufacturers = Array.from(new Set(this.allCarsType.filter
    (car => car.gear === this.gear && car.year === this.year)
    .map(({manufacturer})  => manufacturer)));
    this.allCarsType = this.allCarsType.filter(car => car.gear === this.gear && car.year === this.year);
  }

  //Update list of cars according to Model filter
  getModelByManufacturer(manufacturer: string): void {
    this.allCarsType = [];
    this.storedList.forEach(val => this.allCarsType.push(Object.assign({}, val)));
    this.manufacturer = manufacturer;
    this.models = this.allCarsType
    .filter(car => car.gear === this.gear && car.year === this.year && car.manufacturer === this.manufacturer)
    .map(({model}) => model);
    this.allCarsType = this.allCarsType.filter(car => car.gear === this.gear && car.year === this.year && car.manufacturer === this.manufacturer);
  }

  //Update model field
  updateModel(model: string) {
    this.model = model;
  }

  //Clear filter form fields and restore full list of available cars
  clearFilterFields(form: NgForm) {
    this.formdata.reset();
    this.allCarsType = [];
    this.rentPeriod = null;
    this.storedList.forEach(val => this.allCarsType.push(Object.assign({}, val)));
  }

  //Init component
  async ngOnInit() { 

    //Init autocomplete in search input field with data
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    const availableCarsInStock = await this.carsApi.getAllAvailableCars() //Get all available cars from DB --> Proper = Y && Available = Y
    const getAllCarsType = await this.carsApi.getAllCarsType(); //Get all cars info by the type id

    this.userId = this.commonService.getUserID();//Get user id if exist from token

    //If User exists - get list of favorites cars
    if(this.userId != null && this.userId > 0){
       this.getAllFavorites = await this.usersApi.getFavoritesByUserId(this.userId);
    }

    //Build view of cars for rent
    for (const availableCar of availableCarsInStock) {

      //Get The currect car type info
      const exist = getAllCarsType.find(car => car.typeId === availableCar.typeId);
      //Get branch info by branch id
      const branchInfo = await this.branchesApi.getBranchInfoByBranchId(availableCar.branchId);

      //cant save semicolin to DB so replace with ella text
      if(availableCar.image != null && availableCar.image.indexOf('ella'))
        availableCar.image = availableCar.image.replace('ella',';'); 
     
      //Create new car object with all data  
      this.newCar = new ICar(
        availableCar.carNumber,
        availableCar.typeId,
        availableCar.mileage,  
        availableCar.image, 
        branchInfo.city,
        branchInfo.address,
        branchInfo.name,
        exist.manufacturer,
        exist.model,
        exist.costPerDay,
        exist.costPerDayDelay,
        exist.year, 
        exist.gear,
        this.favoriteIcon);

      //Set default image from car -> if there is no image
      if(this.newCar.image === undefined || this.newCar.image === null)
        this.newCar.image = "/assets/images/noPhoto.jpg";

      //Set autocomplete data
      this.fillAutoCompleteWithData(this.newCar);

      //Add car into available cars list and backup cars list
      this.allCarsType.push(this.newCar); 
      this.storedList.push(this.newCar);

      //set default favorite icon
      this.favoriteIcon = "favorite_border";

      //Set favorite list & icon - if exists in DB
      if(this.userId != null && this.userId > 0 && this.getAllFavorites !=null){ 

        const favoriteCar = this.getAllFavorites.find(favorite => favorite.carNumber === availableCar.carNumber);

        if(favoriteCar != null && favoriteCar.favoriteId > 0)
        {
          this.addToFavoriteList(this.newCar);
          this.favoriteIcon = "favorite";
        }
      }

    }

    //Filter list of available cars by car type
    this.allCarsType.sort((a, b) => (a.manufacturer > b.manufacturer) ? 1 : -1)

  }

  //Fill the autocomplete field with all string data from available cars.
  fillAutoCompleteWithData(car:ICar){

    let carNum = false;
    let manu = false;
    let mod = false;
    let ye = false;
    let ge = false;
    let add = false;
    let name = false;
    let city = false;

    //Check if value already exists -> is so, don't duplicate.
    this.options.forEach(function (value) {
      if(value===car.carNumber)
        carNum = true;
      if(value===car.manufacturer)
        manu = true;
      if(value===car.model)
        mod = true;
      if(value===car.year)
        ye = true;
      if(value==="Automatic" || value==="Manually")
        ge = true;
      if(value===car.branchAddress)
      add = true;
      if(value===car.branchName)
      name = true;
      if(value===car.branchCity)
      city = true;
    });

      //If data value not exist in autocomplete -> add data 
      if(carNum === false)
      this.options.push(car.carNumber);
      if(manu === false)
      this.options.push(car.manufacturer);
      if(mod===false)
      this.options.push(car.model);
      if(ye === false)
      this.options.push(car.year);
      if(ge === false)
      this.options.push(car.gear === "A" ? "Automatic" : "Manually");
      if(add === false)
      this.options.push(car.branchAddress);
      if(name === false)
      this.options.push(car.branchName);
      if(city === false)
      this.options.push(car.branchCity);
  }

  //Search for string exist in data of the available cars
  search(value:string){ 

    //Every search --> start from scratch.
    this.allCarsType = [];
    this.storedList.forEach(val => this.allCarsType.push(Object.assign({}, val)));
    
    //Get number of total cars for rent
    let length = this.allCarsType.length;

    //Loop each available car and check if the search value match. if not --> remove the item from the list of available cars.
    for (let i = length-1; i >= 0; i--) {
      if( 
        this.allCarsType[i].carNumber.toLowerCase().indexOf(value.toLowerCase()) < 0  
        && this.allCarsType[i].manufacturer.toLowerCase().indexOf(value.toLowerCase()) < 0 
        && this.allCarsType[i].model.toLowerCase().indexOf(value.toLowerCase()) < 0 
        && this.allCarsType[i].year.toLowerCase().indexOf(value.toLowerCase()) < 0 
        && this.allCarsType[i].gear.toLowerCase() != value[0].toLowerCase()
        && this.allCarsType[i].branchAddress.toLowerCase().indexOf(value.toLowerCase()) < 0 
        && this.allCarsType[i].branchCity.toLowerCase().indexOf(value.toLowerCase()) < 0
        && this.allCarsType[i].branchName.toLowerCase().indexOf(value.toLowerCase()) < 0
      )
        this.allCarsType.splice(i, 1);
    }
  }
}
