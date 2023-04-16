import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from 'src/app/Services/users.service';
import { MatTableDataSource, MatPaginator, MatDatepickerInputEvent, MatDialog } from '@angular/material';
import sweetalert2 from 'sweetalert2';
import { RegisterComponent } from '../register/register.component';

//User properties
interface IUser {
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
  isEdit: boolean; 
  icon: boolean;
}

 
@Component({
  selector: 'app-mange-users',
  templateUrl: './mange-users.component.html',
  styleUrls: ['./mange-users.component.scss']
})

export class MangeUsersComponent implements OnInit {

  constructor(private userApi: UsersService, private dialog: MatDialog) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; //Set paginator
  allUsers: any;  //List of users
  genders: string[] = ['Male', 'Female', 'Other']; //List of gender types
  roles: string[] = ['Customer', 'Manager', 'Admin']; //List of roles
  displayedColumns: string[] = ['FirstName', 'LastName', 'UserName', 'ID', 'DateOfBirth', 'Gender', 'Email', 'RoleType', 'Image', 'Actions']; //List of table columns
  dataSource = new MatTableDataSource<any>(); //Set new data source for table


  //Add new user image
  onSelectFile(event, user: IUser) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url -> base64

      reader.onload = (e) => {
       if (e.target['result'].toString().split(';')[0].indexOf('image') > -1 ) {
         const imageURL = e.target['result'];
         user.image = imageURL.toString();
       } else {
        sweetalert2.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Invalid file,Please upload Image.',
        });
       }
      };
    }
  }

  //Delete user from DB
  async deleteUser(user: IUser) {
    sweetalert2.fire({
      title: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
      text: `You won't be able to revert this!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes,I'm 100% sure!`
    }).then(async  (result) => {
      if (result.value) {
        //Send request to DB
        const deleteResponse = await this.userApi.deleteUser(user.id);
        if (deleteResponse.indexOf('successfully') > -1) {
          sweetalert2.fire(
            'Deleted!',
            `${user.firstName} ${user.lastName} has been deleted successfully.`,
            'success'
          );
          //Refresh data on page
          this.ngOnInit();
        } else {
          sweetalert2.fire({
            type: 'error',
            title: 'Something went wrong!',
            text: `Failed to delete ${user.firstName} ${user.lastName}`,
          });
        }
      }
    });
  }

  //Update user in DB
  async updateUser(user: IUser) {
    sweetalert2.fire({
      title: `Are you sure you want to update User ID: ${user.id}?`,
      text: `You won't be able to revert this!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes,I'm 100% sure!`
    }).then(async  (result) => {
      if (result.value) {
        //Send request to DB
    const userResponse = await this.userApi.updateUser(user); 
        if (userResponse.indexOf('successfully') > -1) {
          sweetalert2.fire(
            'Updated!',
            `${user.id} has been updated successfully.`,
            'success'
          );
          this.ngOnInit();
        } else {
          sweetalert2.fire({
            type: 'error',
            title: 'Something went wrong!',
            text: `Failed to update ${user.id}`,
          });
        } 
      }
    });
  }

  //Set date according to time zone
  userDateOfBirth(user: IUser,event: MatDatepickerInputEvent<Date>) {

    var futureDate = new Date(event.value.setDate(event.value.getDate() + 1));
    user.dateOfBirth = futureDate.toISOString().toLocaleString().split('T')[0];
  }

  //Add new user -> open dialog page
  addUser(): void {
    const dialogRef = this.dialog.open(RegisterComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      //refresh data on page
      this.ngOnInit();
    });
  }


  //Init date
  async ngOnInit() {
    //Get all users from DB
    this.allUsers = await this.userApi.getAllUsers();
    //For each user set as editable
    this.allUsers.forEach(u => {
      u['isEdit'] = true;
    });
    //Set data source of users table
    this.dataSource.data = this.allUsers;
    //Set paginator
    this.dataSource.paginator = this.paginator;

  }

}
  