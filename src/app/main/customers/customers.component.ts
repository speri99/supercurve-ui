import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Router } from '@angular/router';

interface Customer {
  id:string;
  businessName: string;
  email: string;
  address: string;
  customerStores:string;
  camerasCount:any;
}
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit{
  searchValue = '';
  visible = false;
  listOfData: Customer[] = [
    
  ];
  listOfDisplayData = [...this.listOfData];

  constructor(private mainService:MainService,private router:Router){
    this.getCustomersInfo();
  }
  ngOnInit(): void {
    
  }

  getCustomersInfo(){
    this.mainService.getAllCustomers().subscribe((data:any)=>{
      console.log(data);
      this.listOfData=data;
      this.listOfData.forEach((item:any)=>{
        let cameraCount=0;
        item.customerStores.forEach((element:any) => {
          cameraCount+=element.storeCameras.length;
        });
        item.camerasCount=cameraCount;
      })
      this.listOfDisplayData = [...this.listOfData];
    })
  }

  edit(id:any){
    this.router.navigateByUrl("/main/customer/register/"+id)
  }
  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: Customer) => item.businessName.indexOf(this.searchValue) !== -1);
  }
}
