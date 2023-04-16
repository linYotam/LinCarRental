import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IBranch } from '../Components/manage-branches/manage-branches.component';
import { INewBranch } from '../Components/add-branch/add-branch.component';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { CommonService } from './commonService';

//Dependency injection
@Injectable()
export class BranchesService {

  constructor(private http: HttpClient, private commonApi: CommonService) { }

  //Get list of all branches from DB
  public async getBranches() {
  return await this.http.get<any>(environment.baseUrl+`/Branch/getAllBranches`).toPromise();
  }

  //Get branch by branch id from DB
  public async getBranchInfoByBranchId(branchId: number) {

    const branchInfo = await this.http.get<any>(environment.baseUrl+`/Branch/getBranchInfoByBranchId/`+ branchId ).toPromise();
    return branchInfo;
  }

  //Update branch in DB
  public async updateBranch(branch: IBranch){

    const updateBranchResponse = await this.http.put<any>(environment.baseUrl+`/Branch/updateBranch`, branch).toPromise()
    .then(res => res.Message, (err: HttpErrorResponse) => err.message);

    if(updateBranchResponse === undefined)
    return "successfully";

    return updateBranchResponse;

  }

  //Delete branch from DB
  public async deleteBranch(branchId:number){

    const deleteBranchResponse = await this.http.delete<any>(environment.baseUrl+`/Branch/deleteBranch/` + branchId).toPromise();
 
    if(deleteBranchResponse === null)
    return "successfully";
 
    return deleteBranchResponse;

  }

  //Add a new branch to DB
  public async addBranch(branch:INewBranch){


    const options = { headers: { Authorization: "Bearer " +  this.commonApi.getToken()} };

    const addBranchResponse = await this.http.post<any>(environment.baseUrl+`/Branch/addBranch`, branch, options).toPromise()
    .then(res => res.Message, (err: HttpErrorResponse) => err.message);

    if(addBranchResponse === undefined)
    return "successfully";

    return addBranchResponse;
  }

  //Get branch location from DB -> Active positionstack API from server side
  public async getLocation(address:string){
    const location = await this.http.get<any>(environment.baseUrl+`/Branch/getLocation/`+ address).toPromise();
    return location;
  }



}
