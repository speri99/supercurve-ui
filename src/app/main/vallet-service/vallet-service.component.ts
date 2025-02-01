import { Component } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {ChartConfiguration, ChartData, ChartDatasetProperties, ChartOptions, LabelItem } from 'chart.js';
import { MainService } from '../main.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-vallet-service',
  templateUrl: './vallet-service.component.html',
  styleUrls: ['./vallet-service.component.css']
})
export class ValletServiceComponent {
  chartOptions = {
    title: {
      text: "Avaliable vs Alloted Drivers"
    },
    data: [{
      type: "column",
      dataPoints: [
      { label: "Allotted",y: 10,x:0 },
      ]
    }]                
    };
  registrationForm!: UntypedFormGroup;
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
 
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  isVisible = false;
  isConfirmLoading = false;

 
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['2006'],
    datasets: [
      { data: [10,5], label: 'Drivers' },
      
      
    ]
  };
  constructor(private fb:FormBuilder,private mainService:MainService,private message: NzMessageService) {
    this.registrationForm = this.fb.group({
      name: [null, [ Validators.required]],
      age: [null, [Validators.required]],
      liscenceNumber: [null, [Validators.required]],
      address: [null, [Validators.required]],
      
    });
  }

  ngOnInit() {}

  showModal(): void {
    this.isVisible = true;
  }

  addDriver(): void {
    // this.isConfirmLoading = true;
    // setTimeout(() => {
    //   this.isVisible = false;
    //   this.isConfirmLoading = false;
    // }, 1000);
    this.mainService.onboardDriver(this.registrationForm.value).subscribe((data:any)=>{
      this.message.success("Driver onboarder Successfully!!");
      this.isVisible=false;
    },(err)=>{
      this.message.error("Unable to onboard the driver");
      this.isVisible=false;
    })
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
