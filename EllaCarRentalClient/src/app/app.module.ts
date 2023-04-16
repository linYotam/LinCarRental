import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// tslint:disable-next-line:max-line-length
import {MatTabsModule, MatToolbarModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatPaginatorModule, MatInputModule, MatIconModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule, MatAutocompleteModule, MatSelectModule, MatExpansionModule, MatTableModule, MatTooltipModule, MatDialogModule, MatMenuModule, MatBadgeModule, MatTreeModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component';
import { TabsComponent } from './Components/tabs/tabs.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { UsersService } from './Services/users.service';
import { PickCarComponent } from './Components/pick-car/pick-car.component';
import { CarsService } from './Services/cars.service';
import { FiltermultiPipe } from './Pipes/filterByMultiArgs';
import { CarNumberPipe } from './Pipes/carNumber';
import { CarCardComponent } from './Components/car-card/car-card.component';
import { BranchesService } from './Services/branches.service';
import { MangeUsersComponent } from './Components/mange-users/mange-users.component';
import { RentCarComponent } from './Components/rent-car/rent-car.component';
import { ManageCarsTypesComponent } from './Components/manage-cars-types/manage-cars-types.component';
import { AddCarTypeComponent } from './Components/add-car-type/add-car-type.component';
import { ManageCarsStockComponent } from './Components/manage-cars-stock/manage-cars-stock.component';
import { AddCarStockComponent } from './Components/add-car-stock/add-car-stock.component';
import { NumberPipePipe } from './Pipes/toNumber';
import { ManageOrdersComponent } from './Components/manage-orders/manage-orders.component';
import { AddOrderComponent } from './Components/add-order/add-order.component';
import { AuthInterceptor } from './Interceptor/httpconfig.interceptor';
import { CommonService } from './Services/commonService';
import { EventEmitterService } from './Services/event-emitter.service';
import { MyOrdersComponent } from './Components/my-orders/my-orders.component';
import { AuthGuard } from './Gurds/auth.guard';
import { ContactUsComponent } from './Components/contact-us/contact-us.component';
import { ReturnCarComponent } from './components/return-car/return-car.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MyAccountComponent } from './components/my-account/my-account.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MiniCarCardComponent } from './Components/mini-car-card/mini-car-card.component';
import {MatDividerModule} from '@angular/material/divider';
import { ManageBranchesComponent } from './Components/manage-branches/manage-branches.component';
import { AddBranchComponent } from './Components/add-branch/add-branch.component';
   
@NgModule({
  declarations: [ 
    AppComponent,
    HomeComponent,
    TabsComponent,
    LoginComponent,
    RegisterComponent,
    PickCarComponent,
    FiltermultiPipe,
    CarNumberPipe,
    NumberPipePipe,
    CarCardComponent,
    MangeUsersComponent,
    RentCarComponent,
    ManageCarsTypesComponent,
    AddCarTypeComponent,
    ManageCarsStockComponent,
    AddCarStockComponent,
    ManageOrdersComponent,
    AddOrderComponent,
    MyOrdersComponent,
    ContactUsComponent,
    ReturnCarComponent,
    MyAccountComponent,
    MiniCarCardComponent,
    ManageBranchesComponent,
    AddBranchComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatTreeModule,
    MatMenuModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatBadgeModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatRadioModule,
    HttpClientModule,
    MatDialogModule,
    FileUploadModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatIconModule,
    MatTableModule,
    ReactiveFormsModule ,
    MatFormFieldModule,
    MatToolbarModule,
    AppRoutingModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatDividerModule
  ],
  entryComponents: [TabsComponent, AddCarTypeComponent, AddCarStockComponent , AddOrderComponent, AddBranchComponent],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor, 
    multi: true,
  },
  AuthGuard, UsersService, CarsService, BranchesService, CommonService, EventEmitterService],
  bootstrap: [AppComponent, TabsComponent]
})
export class AppModule { }
