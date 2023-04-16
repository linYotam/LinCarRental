import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './Components/register/register.component';
import { LoginComponent } from './Components/login/login.component';
import { ContactUsComponent } from './Components/contact-us/contact-us.component';
import { HomeComponent } from './Components/home/home.component';
import { PickCarComponent } from './Components/pick-car/pick-car.component';
import { MangeUsersComponent } from './Components/mange-users/mange-users.component';
import { RentCarComponent } from './Components/rent-car/rent-car.component';
import { ManageCarsTypesComponent } from './Components/manage-cars-types/manage-cars-types.component';
import { ManageCarsStockComponent } from './Components/manage-cars-stock/manage-cars-stock.component';
import { ManageOrdersComponent } from './Components/manage-orders/manage-orders.component';
import { MyOrdersComponent } from './Components/my-orders/my-orders.component';
import { AuthGuard } from './Gurds/auth.guard';
import { ReturnCarComponent } from './components/return-car/return-car.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { ManageBranchesComponent } from './Components/manage-branches/manage-branches.component';


const routes: Routes = [
  { path: 'Cars/selectCar', component: PickCarComponent }, //Select car to rent page
  { path: 'Cars/Payment', component: RentCarComponent , canActivate: [AuthGuard] }, //Order car -> must have authorization
  { path: 'home', component: HomeComponent }, //Home page
  { path: 'register', component: RegisterComponent }, //Register page
  { path: 'login', component: LoginComponent }, //Login page
  { path: 'contact', component: ContactUsComponent}, //Contact Us page
  { path: 'account', component: MyAccountComponent,canActivate: [AuthGuard]}, //User account page -> must have authorization
  { path: 'Managment/Users', component: MangeUsersComponent , canActivate: [AuthGuard]}, //Manage users page -> must have authorization
  { path: 'Managment/Return', component: ReturnCarComponent , canActivate: [AuthGuard]}, //Return rented car page -> must have authorization
  { path: 'Managment/Cars/Types', component: ManageCarsTypesComponent , canActivate: [AuthGuard]}, //Manage cars types page page -> must have authorization
  { path: 'Managment/Cars/Stock', component: ManageCarsStockComponent , canActivate: [AuthGuard]}, //Manage cars page -> must have authorization
  { path: 'Managment/Cars/Orders', component: ManageOrdersComponent , canActivate: [AuthGuard]}, //manage orders page -> must have authorization
  { path: 'Managment/MyOrders', component: MyOrdersComponent , canActivate: [AuthGuard] }, //User current & history orders page page -> must have authorization
  { path: 'Managment/Branches', component: ManageBranchesComponent , canActivate: [AuthGuard] }, //Managment branches page -> must have authorization
  { path: '**', redirectTo: 'home' }  
]; 
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 