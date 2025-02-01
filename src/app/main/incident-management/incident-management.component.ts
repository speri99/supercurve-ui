import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../main.service';
import { da } from 'date-fns/locale';

export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  createdDate: Date;
}
@Component({
  selector: 'app-incident-management',
  templateUrl: './incident-management.component.html',
  styleUrls: ['./incident-management.component.css']
})
export class IncidentManagementComponent {
  incidentForm: FormGroup= {} as FormGroup;
  incidents: Incident[] = [];
  editMode = false;
  currentIncidentId: number | null = null;
  isVisible = false; // Modal visibility state
  attachment: File | null = null; // File attachment
  isSpinning=false;
  incidentData:any;
  visible = false;
  searchValue = '';
  constructor(private fb: FormBuilder,private mainService:MainService) {}

  ngOnInit(): void {
    this.incidentForm = this.fb.group({
      customerName: ['', Validators.required],
      storeName: ['', Validators.required],
      cameraName: ['', Validators.required],
      incidentType: ['', Validators.required],
      priority: ['', Validators.required],
    });
    // Load existing incidents (mock data or API call)
    this.loadIncidents();
  }

  loadIncidents(): void {
    // Mock data
    this.mainService.getAllIncidents().subscribe(data=>{
      this.incidentData=data;
    })
  }

  // onSubmit(): void {
  //   if (this.incidentForm.invalid) return;
  //   const formData = this.incidentForm.value;

  //   if (this.editMode && this.currentIncidentId !== null) {
  //     const index = this.incidentData.findIndex(
  //       (incident:any) => incident.id === this.currentIncidentId
  //     );
  //     if (index !== -1) {
  //       this.incidents[index] = {
  //         ...this.incidentData[index],
  //         ...formData,
  //       };
  //     }
  //   } else {
  //     const newIncident: Incident = {
  //       id: this.generateId(),
  //       ...formData,
  //       createdDate: new Date(),
  //     };
  //     this.incidentData.push(newIncident);
  //   }

  //   this.resetForm();
  // }

  editIncident(incident: Incident): void {
    this.incidentForm.patchValue({
      title: incident.title,
      description: incident.description,
      severity: incident.severity,
      status: incident.status,
    });
    this.editMode = true;
    this.currentIncidentId = incident.id;
  }

  deleteIncident(incidentId: number): void {
    this.incidents = this.incidentData.filter((incident:any) => incident.id !== incidentId);
  }

  resetForm(): void {
    this.incidentForm.reset({
      severity: 'Low',
      status: 'Open',
    });
    this.editMode = false;
    this.currentIncidentId = null;
  }

  private generateId(): number {
    return this.incidentData.length
      ? Math.max(...this.incidentData.map((incident:any) => incident.id)) + 1
      : 1;
  }
  edit(input:any){

  }search(){

  }reset(){
  }

  
  
  openModal(): void {
    this.isVisible = true;
  }

  closeModal(): void {
    this.isVisible = false;
    this.incidentForm.reset();
    this.attachment = null;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.attachment = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.incidentForm.valid) {
      this.isSpinning=true;
      const formData = new FormData();
      const formValues = this.incidentForm.value;

      formData.append('customerName', formValues.customerName);
      formData.append('storeName', formValues.storeName);
      formData.append('cameraName', formValues.cameraName);
      formData.append('incidentType', formValues.incidentType);
      formData.append('priority', formValues.priority);
      if (this.attachment) {
        formData.append('attachment', this.attachment);
      }
      this.mainService.createIncident(formData).subscribe(data=>{
        this.isSpinning=false;
        console.log(data);
        this.closeModal();
        this.loadIncidents();
      },(err)=>{
        this.isSpinning=false;
      })
    }
  }
}

