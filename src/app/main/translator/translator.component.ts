import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.css']
})
export class TranslatorComponent implements OnInit {
  languageMap = new Map<string, string>();
  input:any;
  output:any;
  auditData:any[]=[];
  isAuditDataLoading:boolean=false;
  constructor(private mainService:MainService) { }

  acceptedLanguages:any=[];
  sourceLanguage={
    "name": "English",
    "nativeName": "English",
    "dir": "ltr"
}
  targetLanguage={
    "name": "Chinese (Literary)",
    "nativeName": "中文 (文言文)",
    "dir": "ltr"
}

  ngOnInit(): void {
    this.getAcceptedLanguages();
  }

  targetLanguageChange(event:any)
  {
    this.targetLanguage.name=event.value;
    if(this.input.length>0){
      this.translate();
    }
  }

  getAcceptedLanguages(){
    this.mainService.getAcceptedLanguages().subscribe(data=>{
      console.log(data.translation);

      Object.keys(data.translation).forEach((k)=>{
        this.acceptedLanguages.push(data.translation[k]);  
        this.languageMap.set(data.translation[k].name,k)
      })
     
      console.log(this.languageMap);
    })

  }
  translate(){

    this.mainService.translateUsingAzureAI(this.languageMap.get(this.targetLanguage.name),this.input).subscribe(data=>{
      console.log(data);
      data.forEach((response:any)=>{
       this.output= response.translations[0].text;
       this.captureLogging(this.input,this.output)
      })
    })
    
  }

  captureLogging(sourceText:any,targetText:any){
    let auditReq = {
      "sourceLang": this.sourceLanguage.name,
      "targetLang": this.targetLanguage.name,
      "translatedBy": "sharma",
      "input":sourceText,
      "output":targetText
      }
      this.mainService.audit(auditReq).subscribe(data=>{
        console.log("Event Captured!")
      })
  }

  getAuditData(){
    this.isAuditDataLoading=true;
    this.mainService.getAuditData().subscribe(data=>{
      this.auditData=data;
      this.isAuditDataLoading=false;
    },(err)=>{this.isAuditDataLoading=false;})
  }



}
