import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import sweetalert2 from 'sweetalert2';
import { BranchesService } from 'src/app/Services/branches.service';
import { AddBranchComponent } from '../add-branch/add-branch.component';

//Branch properties
export interface IBranch {
  branchId:number;
  address: string;
  latitude: number;
  longitude: number;
  name: string;
  city: string;
}

@Component({
  selector: 'app-manage-branches',
  templateUrl: './manage-branches.component.html',
  styleUrls: ['./manage-branches.component.scss']
})
export class ManageBranchesComponent implements OnInit {

  constructor(private branchApi: BranchesService, public dialog: MatDialog) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; //Set page numbering
  branches: IBranch[]; //List of branches
  displayedColumns: string[] = ['Address','Latitude','Longitude','Name', 'City','Actions']; //List of table columns
  dataSource = new MatTableDataSource<IBranch>(); //Set table data source

  //Add a new branch
  addBranch(){
    //Open a dialog page
    const dialogRef = this.dialog.open(AddBranchComponent, {height:'600px',width: '600px'});
    //After closing the dialog page -> fire ngOnInit function to refresh data on page
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  //Delete Branch
  deleteBranch(branch: IBranch) {
    sweetalert2.fire({
      title: `Are you sure you want to delete the selected branch?`,
      text: `You won't be able to revert this!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes,I'm 100% sure!`
    }).then(async  (result) => {
      if (result.value) {

        //Send DB delete branch request
        const deleteBranch = await this.branchApi.deleteBranch(branch.branchId);

        //If success -> show proper alert
        if (deleteBranch.indexOf('successfully') > -1) {
          sweetalert2.fire(
            'Updated!',
            `Branch has been deleted successfully.`, 
            'success'
          );
          //fire ngOnInit function to refresh data on page
          this.ngOnInit(); 
        } else {
          sweetalert2.fire({
            type: 'error',
            title: 'Something went wrong!',
            html: `Failed to delete selected Branch!`,
          });
        }
      }
    });
  }

  //Update branch
  updateBranch(branch: IBranch) {
    sweetalert2.fire({
      title: `Are you sure you want to update the selected branch?`,
      text: `You won't be able to revert this!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes,I'm 100% sure!`
    }).then(async  (result) => {
      if (result.value) {
        //Send DB update branch request 
        const updateBranch = await this.branchApi.updateBranch(branch);
        if (updateBranch.indexOf('successfully') > -1) {
          sweetalert2.fire(
            'Updated!',
            `Branch has been updated successfully.`,
            'success'
          );
          //fire ngOnInit function to refresh data on page
          this.ngOnInit();
        } else {
          sweetalert2.fire({
            type: 'error',
            title: 'Something went wrong!',
            html: `Failed to update Branch!`,
          });
        }
      }
    });
  }

  //Refresh data on page
  async ngOnInit() {
 
    //Get all branches
    this.branches = await this.branchApi.getBranches();
    //Set every row of branches in table to be editable
    this.branches.forEach(u => {
      u['isEdit'] = true;
    });
 
    //Build table with branches details
    this.dataSource.data = this.branches;
    //Set paginator according to date source
    this.dataSource.paginator = this.paginator;
  }

}

 