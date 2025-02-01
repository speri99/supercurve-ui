import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MainService } from '../main.service';

@Component({
  selector: 'app-generate-pdf',
  templateUrl: './generate-pdf.component.html',
  styleUrls: ['./generate-pdf.component.css']
})
export class GeneratePdfComponent implements OnInit {

  firFrom:FormGroup;

  constructor(private router:Router,private message: NzMessageService,private service:MainService,private fb:FormBuilder) {
    this.firFrom = this.fb.group({
      station: [null, [Validators.required]],
    });
   }

  ngOnInit(): void {
  }

  submitForm(){
    
  }

}
