import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

//User properties
interface IUser {
  userId: number;
  firstName: string;
  lastName: string;
  id: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  password: string;
  image: string;
  roleType: string;
}

//Authentication properties
interface IAuthenticatedUser {
  email: string;
  password: string;
}

//Dependency injection
@Injectable()
export class UsersService {
 
  constructor(private http: HttpClient) { }

  //Get list of all users from DB
  public async  getAllUsers() {
    return await this.http.get<IUser[]>(environment.baseUrl+`/Users`).toPromise();
  }

  //Get one user info by user id from DB
  public async  getUserByUserId(userId:number) {
    return await this.http.get<any>(environment.baseUrl+`/Users/getUserByUserId/` + userId).toPromise();
  }

  //Get user list of all favorite cars by user id from DB
  public async  getFavoritesByUserId(userId:number) {
    return await this.http.get<any>(environment.baseUrl+`/Users/getFavoritesByUserId/` + userId).toPromise();
  }
  
  //Register a new user to DB
  public register(user: IUser):Promise<IUser> {
    const observable = this.http.post<IUser>(environment.baseUrl+`/users/register`, user);
    return observable.toPromise();
  } 

  //Add a new favorite car to user list in DB
  public addFavorite(favorite: any):Promise<any> {
    const observable = this.http.post<any>(environment.baseUrl+`/users/addFavorite`, favorite);
    return observable.toPromise();
  } 

  //Login an exist user 
  public async login(email: string , password: string) {
    const body: IAuthenticatedUser = {'email': email, 'password': password };
    const response: any = await this.http.post(environment.baseUrl+`/users/isAuthenticated`, body).toPromise().then(
    res => res , (err: HttpErrorResponse) => err);
    return response;
  }

  //Delete favorite car from user favortie cars list in DB
  public async deleteFavorite(favorite: any): Promise<any> {
    
    const deleteFavoriteResponse = await this.http.post<any>(environment.baseUrl+`/Users/deleteFavorite`,favorite ).toPromise();

    if(deleteFavoriteResponse === null)
    return "successfully"; 

    return deleteFavoriteResponse;
  }

  //Delete user from DB
  public async deleteUser(userId: string): Promise<any> {
    //const params = { id };
    const deleteUserResponse = await this.http.delete<any>(environment.baseUrl+`/Users/deleteUser/` + userId ).toPromise();//.then(res => res.Message);

    if(deleteUserResponse === null)
    return "successfully"; 

    return deleteUserResponse;
  }

  //Update user in DB
  public async updateUser(user: IUser) { 

    const updateUserResponse = await this.http.put<any>(environment.baseUrl+`/Users/updateUser`, user ).toPromise()
    .then(res => res.Message, (err: HttpErrorResponse) => err.message);

    if(updateUserResponse === undefined)
    return "successfully";

    return updateUserResponse;
  }

  //Update user with different password in DB
  public async updateUserWithPassword(user: IUser) { 

    const updateUserResponse = await this.http.put<any>(environment.baseUrl+`/Users/updateUserWithPassword`, user ).toPromise()
    .then(res => res.Message, (err: HttpErrorResponse) => err.message);

    if(updateUserResponse === undefined)
    return "successfully";

    return updateUserResponse;
  }
  
}
