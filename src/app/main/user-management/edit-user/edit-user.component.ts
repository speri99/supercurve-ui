import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  userForm!: FormGroup;
  totalPermissionsList: any = [];
  user: any;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.totalPermissionsList = this.data.totalPermissionsList;
    this.user = this.data.user;
    this.createForm(this.data.user);
    this.totalPermissionsList = this.mergePermissions(this.totalPermissionsList, this.data.user.roles[0]?.permissionsList);
  }

  createForm(user: any): void {
    this.userForm = this.fb.group({
      username: [user.username, [Validators.required]],
      email: [user.email, [Validators.required, Validators.email]],
    });
  }

  mergePermissions(totalPermissions: any[], userPermissions: any[]): any[] {
    return totalPermissions.map((permission) => {
      const isEnabled = userPermissions.some(
        (userPerm) => userPerm.permission_name === permission.permission_name
      );
      return { ...permission, enabled: isEnabled };
    });
  }

  onCheckboxChange(permission: any, checked: boolean): void {
    permission.enabled = checked; // Update the enabled state in the original array
  }
  onSubmit(): void {
    this.user.email = this.userForm.get("email")?.value;
    this.user.roles[0].permissionsList = this.totalPermissionsList.filter((permission: any) => {
      return permission.enabled;
    })
    this.dialogRef.close(this.user);
  }

}
