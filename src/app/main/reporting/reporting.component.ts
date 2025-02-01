
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../main.service';
import { da } from 'date-fns/locale';
import { NzUploadFile } from 'ng-zorro-antd/upload';

export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  createdDate: Date;
}
@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent {
  customerName:any;
  incidentForm: FormGroup= {} as FormGroup;
  incidents: Incident[] = [];
  editMode = false;
  currentIncidentId: number | null = null;
  isVisible = false; // Modal visibility state
  isSpinning=false;
  incidentData:any;
  visible = false;
  searchValue = '';
  attachments: any[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
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
    this.attachments = [];
  }

  onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.attachments = Array.from(event.target.files);
    }
  }

  beforeUpload = (file: any): boolean => {
    this.attachments = [...this.attachments, file];
    return false; // Prevent auto-upload
  };

  removeFile(file: any): void {
    this.attachments = this.attachments.filter((item) => item.uid !== file.uid);
    //this.message.info(`${file.name} removed`);
  }
  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  onSubmit(): void {
      this.isSpinning=true;
      const formData = new FormData();
      formData.append('customerName', this.customerName);
      if (this.attachments) {
        this.attachments.forEach((file, index) => {
          formData.append(`attachments`, file, file.name);
        });
      }
      this.mainService.sendReport(formData).subscribe(data=>{
        this.isSpinning=false;
        console.log(data);
        this.closeModal();
        this.attachments=[];
      },(err)=>{
        this.isSpinning=false;
      })
    }
}



const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });