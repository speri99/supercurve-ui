import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../main/main.service';
import { FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  registrationForm!: UntypedFormGroup;
  form: UntypedFormGroup = new UntypedFormGroup({
    username: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
    remember: new UntypedFormControl(''),
  });

  
  userRegistration:boolean=false;
  @Input() error: string | null='';
  @Output() submitEM = new EventEmitter();

  constructor(private router:Router,
    private notification: NzNotificationService,private message: NzMessageService,private service:MainService,private fb:FormBuilder) {
    this.registrationForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      username: [null, [Validators.required]],
      phoneNumberPrefix: ['+86'],
      phoneNumber: [null, [Validators.required]],
      website: [null, [Validators.required]],
      captcha: [null, [Validators.required]],
      agree: [false]
    });
   }

  ngOnInit(): void {
  }
  async login(){
    await this.service.login(this.form.value).subscribe( async(data)=>{
      let permissions:any[]=[];
      localStorage.setItem('id_token', data.accessToken);
     await this.service.getUserById(data.id).subscribe((user:any)=>{
        user.roles[0]?.permissionsList?.forEach((pname:any)=>{
          permissions.push(pname.permission_name.toString());
        })
        this.service.passUserRoles(permissions);
        localStorage.setItem("userRoles",JSON.stringify(permissions));
        if(permissions.includes("sc.access.application")){
          this.router.navigateByUrl("/main/welcome")
        }else{
          this.router.navigateByUrl("/main/403")
        }
      })
    },(err)=>{
      this.createNotification('error');
    })
  }
  updateConfirmValidator(): void {
    /** wait for refresh value */
    //Promise.resolve().then(() => this.registrationForm.get('checkPassword.updateValueAndValidity());
  }

  createNotification(type: string): void {
    this.notification.create(
      type,
      'Login Error',
      'Please enter valid credntials.'
    );
  }

  submitForm(){
    this.service.singup(this.registrationForm.value).subscribe(data=>{
      this.message.success("User registered successfully, Please login");
      this.userRegistration=false;
    },(err)=>{
      this.message.error("Something went wrong,please try again!")
    })
  }

  signup(){
    this.router.navigateByUrl("/signup");
  }
  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    // if (!control.value) {
    //   return { required: true };
    // } else if (control.value !== this.registrationForm.get('password').value) {
    //   return { confirm: true, error: true };
    // }
    return {};
  };

}


