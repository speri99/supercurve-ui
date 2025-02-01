import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MainService } from '../main.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-onboarding',
  templateUrl: './customer-onboarding.component.html',
  styleUrls: ['./customer-onboarding.component.css']
})
export class CustomerOnboardingComponent implements OnInit {


  current = 0;
  index = 'First-content';
  customerInfoForm:FormGroup;
  listOfOption = [
    { label: 'Days', value: 'Days' },
    { label: 'Weeks', value: 'Weeks' },
    { label: 'Months', value: 'Months' }
  ];

  optionList = [
    { label: '1', value: '1'},
    { label: '2', value: '2'},
    { label: '3', value: '3'},
    { label: '4', value: '4'},
  ];
  selectedValue = '2';

  constructor(private formBuilder:FormBuilder,private router:Router,private route: ActivatedRoute,
    private mainService:MainService,private notification:NzNotificationService){
    this.customerInfoForm = this.formBuilder.group({
      id:new  UntypedFormControl(''),
      email:new UntypedFormControl('',Validators.required),
      firstName: new UntypedFormControl('',Validators.required),
      lastName:new UntypedFormControl('',Validators.required),
      businessName: new UntypedFormControl('',Validators.required),
      phoneNumber:new UntypedFormControl('',Validators.required),
      password: new UntypedFormControl('',Validators.required),
      confirmPassword: new UntypedFormControl('', [Validators.required, this.confirmationValidator]),
      address: new UntypedFormControl('',Validators.required),
      city: new UntypedFormControl('',Validators.required),
      state: new UntypedFormControl('',Validators.required),
      postalCode: new UntypedFormControl('',Validators.required),
      country:new UntypedFormControl('',Validators.required),
      customerStores: new FormArray([]),
      defaultRecordingFor:new UntypedFormControl('',Validators.required),
      defaultRecordingVal:new UntypedFormControl('',Validators.required),
    });
  
  }
  ngOnInit(): void {
    let paramValue = this.route.snapshot.paramMap.get('paramName');
    // Subscribing to params observable (react to changes)
    this.route.params.subscribe(params => {
      paramValue = params['id'];
      if(paramValue){
        this.getCustomerInfo(paramValue);
      }
    });
  }

  getCustomerInfo(id:any){
    this.mainService.getCustomerById(id).subscribe((customerData:any)=>{
      // this.customerInfoForm.patchValue(data);
      let stores:any=[];
      let storeGroup: UntypedFormGroup;
      this.customerInfoForm.patchValue({
        email: customerData.email,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        businessName: customerData.businessName,
        phoneNumber: customerData.phoneNumber,
        password: customerData.password,
        confirmPassword: customerData.confirmPassword,
        address: customerData.address,
        city: customerData.city,
        state: customerData.state,
        postalCode: customerData.postalCode,
        country: customerData.country,
        defaultRecordingFor: customerData.defaultRecordingFor,
        defaultRecordingVal: customerData.defaultRecordingVal,
      });
  
      const storesArray = this.customerInfoForm.get('customerStores') as FormArray;
      customerData.customerStores.forEach((store: any) => {
        const camerasArray = new FormArray<FormGroup>([]);
        store.storeCameras.forEach((camera: any) => {
          const cameraGroup = this.formBuilder.group({
            cameraName: new UntypedFormControl(camera.cameraName, Validators.required),
            manufacturer: new UntypedFormControl(camera.manufacturer, Validators.required),
            modelName: new UntypedFormControl(camera.modelName, Validators.required),
            serialNumber: new UntypedFormControl(camera.serialNumber, Validators.required),
            vedioSourceUrl: new UntypedFormControl(camera.vedioSourceUrl, Validators.required),
            httpAccessUrl: new UntypedFormControl(camera.httpAccessUrl, Validators.required),
          });
          camerasArray.push(cameraGroup);
        });
        const storeGroup = this.formBuilder.group({
          storeName: new UntypedFormControl(store.storeName, Validators.required),
          storeLocation: new UntypedFormControl(store.storeLocation, Validators.required),
          storePincode: new UntypedFormControl(store.storePincode, Validators.required),
          storeCameras: camerasArray
        });
        storesArray.push(storeGroup);
      });
    })
    
  }

  get storeInfo():FormArray{
    return <FormArray>this.customerInfoForm.get('customerStores');
  }

  camerasInfo(index:any):FormArray{
    return <FormArray>((this.customerInfoForm.controls['customerStores']as FormGroup).controls[index] as FormGroup).get('storeCameras');
  }
 
  pre(): void {
    this.current -= 1;
  }
  compareFn = (o1: any, o2: any): boolean => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  log(value: { label: string; value: string; age: number }): void {
    console.log(value);
  }

  next(): void {
    if(this.current==0){
     // this.addStore();
    }
    this.current += 1;

  }
  addStore(){
     let storeGroup: UntypedFormGroup = new UntypedFormGroup({
      storeName: new UntypedFormControl('',Validators.required),
      storeLocation: new UntypedFormControl('',Validators.required),
      storePincode: new UntypedFormControl('',Validators.required),
      storeCameras: new UntypedFormArray([])
    });
    (this.customerInfoForm.get('customerStores') as FormArray).push(storeGroup);
  }

  addCamera(index:any){
    let camera: UntypedFormGroup = new UntypedFormGroup({
      cameraName: new UntypedFormControl('',Validators.required),
      manufacturer: new UntypedFormControl('',Validators.required),
      modelName: new UntypedFormControl('',Validators.required),
      serialNumber: new UntypedFormControl('',Validators.required),
      vedioSourceUrl:new UntypedFormControl('',Validators.required),
      httpAccessUrl:new UntypedFormControl('',Validators.required),
    });
    (((this.customerInfoForm.controls['customerStores']as FormGroup).controls[index]as FormGroup).get('storeCameras') as FormArray).push(camera);
  }

  done(): void {
    console.log('done');
    this.mainService.registerCustomer(this.customerInfoForm.value).subscribe(data=>{
      console.log(data);
      this.createNotification();
      this.router.navigateByUrl("/main/customers");
    })
  }
  createNotification(type?: string): void {
    this.notification.create(
      "success",
      'Success',
      'Customer has been onboarder successfully!'
    );
  }
  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    // if (!control.value) {
    //   return { required: true };
    // } else if (control.value !== this.registrationForm.get('password').value) {
    //   return { confirm: true, error: true };
    // }
    return {};
  };
  updateConfirmValidator(): void {
    /** wait for refresh value */
    //Promise.resolve().then(() => this.registrationForm.get('checkPassword.updateValueAndValidity());
  }
}
