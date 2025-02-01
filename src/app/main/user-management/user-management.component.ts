import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MainService } from '../main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditUserComponent } from './edit-user/edit-user.component';
import { MatDialog } from '@angular/material/dialog';


export interface UserInfo {
  username: string;
  email: string;
  roles: any;
}
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  permissionsList = [];
  displayedColumns: string[] = ['User Name', 'Email', 'Roles', "Actions"];
  dataSource: MatTableDataSource<UserInfo>[] = [];
  selection = new SelectionModel<UserInfo>(true, []);
  users: any[] = [];
  userPermissions: any = [];
  isEditModalVisible = false;
  userForm: any;
  selectedUser: any;

  constructor(private mainService: MainService, private dialog: MatDialog, private fb: FormBuilder, private userService: MainService) { }

  ngOnInit(): void {
    this.mainService.getAllUsers().subscribe(data => {
      this.dataSource = [...data];
    })
    this.fetchPermissions();
  }




  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }
  toggleAllRows() {
    // if (this.isAllSelected()) {
    //   this.selection.clear();
    //   return;
    // }

    // this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: UserInfo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  editUser(user: any) {
    console.log(user)
    this.selectedUser = user;
    let permissions: any = [];
    user.roles[0]?.permissionsList?.forEach((pname: any) => {
      permissions.push(pname.permission_name);
    })
    //this.permissions=permissions;
    this.openEditDialog(user);
   
  }
  openEditDialog(user: any): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '800px',
      data: { 
        totalPermissionsList: this.userPermissions ,
        user:user
      },
    });

    dialogRef.afterClosed().subscribe((updatedUser) => {
      if (updatedUser) {
        // Update the user in the table or send updated data to backend
        console.log('Updated User:', updatedUser);
        this.userService.updateUserDetails(updatedUser).subscribe(() => {
        });
      }
    });
  }

  createForm(): void {
    // Create base controls
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  populateForm(user: any): void {
    // Set basic user data
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
    });

    // Add dynamic controls for permissions
    this.permissionsList = user.permissionsList;
    this.userPermissions.forEach((permission: any) => {
      this.userForm.addControl(
        permission.permission_name,
        this.fb.control(true) // Preselect existing permissions
      );
    });
  }

  fetchPermissions(): void {
    this.userService.getAllPermissions().subscribe((data) => {
      this.userPermissions = data;
    });
  }

  closeModal(): void {
    this.isEditModalVisible = false;
    this.userForm.reset();
  }

  onSubmit(): void {
    const updatedPermissions = Object.keys(this.userForm.value).filter(
      (key) => this.userForm.value[key]
    );

    const updatedUser = {
      ...this.selectedUser,
      permissions: updatedPermissions,
    };

    // this.userService.updateUser(updatedUser).subscribe(() => {
    //   this.closeModal();
    //   this.fetchUsers();
    // });
  }

}
