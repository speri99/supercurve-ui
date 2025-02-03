import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  signupUrl=environment.baseUrl+"/auth/signup";
  loginUrl=environment.baseUrl+"/auth/signin";
  getAllUsersUrl=environment.baseUrl+"/api/users";
  captureAuditUrl=environment.baseUrl+"/api/translator-audit";
  getAuditUrl=environment.baseUrl+"/api/audit"
  getAllPermissionsUrl=environment.baseUrl+"/api/permissions";

  createIncidentUrl=environment.baseUrl+"/api/incident";
  reportingUrl=environment.baseUrl+"/api/status-report";

  private readonly userRoles = new BehaviorSubject<any>([]);
  readonly userRolesObservable = this.userRoles.asObservable();

  constructor(private httpClient:HttpClient) { }

  login(userRequest:any):Observable<any>{
    return this.httpClient.post(this.loginUrl,userRequest)
  }

  passUserRoles(roles: any) {
    this.setUserRoles = [...roles];
  }

  private set setUserRoles(val: any) {
    this.userRoles.next(val);
  }

  getReconcilationReport(inputFiles:any[]) {
    const formData: FormData = new FormData();
    formData.append('sourceFile', inputFiles[0]);
    formData.append('targetFile', inputFiles[1]);
    return this.httpClient.post('http://localhost:8080/api/v1/reconcile', formData);
  }
  getAllUsers():Observable<any>{
    return this.httpClient.get(this.getAllUsersUrl);
    
  }

  getAcceptedLanguages():Observable<any>{
   return this.httpClient.get("https://api.cognitive.microsofttranslator.com/languages?api-version=3.0");
  }

  translateUsingAzureAI(target: any, input: any):Observable<any>{
    const params = new HttpParams()
      .set('api-version', '3.0')
      .set('to', target);

    const headers = new HttpHeaders()
      .set('content-type', 'application/json; charset=UTF-8')
      .set('Ocp-Apim-Subscription-Key', '92229b16411542c2a1fb0470c3ab2d30')
      .set('Ocp-Apim-Subscription-Region', 'centralindia');

    let reqbody = [
      { "Text": input }
    ];
    return this.httpClient.post("https://api.cognitive.microsofttranslator.com/translate",reqbody,{params:params,headers:headers});
  }

  audit(req:any):Observable<any>{
    return this.httpClient.post(this.captureAuditUrl,req)
  }

  getAuditData():Observable<any>{
    return this.httpClient.get(this.getAuditUrl);
  }

  singup(registrationForm:any):Observable<any>{
    let form=registrationForm;
    form.roles=["user"];
    return this.httpClient.post(this.signupUrl,form);
  }

  createBooking(bookingrequest:any):Observable<any>{
    return this.httpClient.post("http://localhost:9090/api/create-booking",bookingrequest)
  }
  

  onboardDriver(driver:any){
    return this.httpClient.post("http://localhost:9090/api/drivers",driver);
  }

  registerCustomer(customerObj:any){
    return this.httpClient.post(environment.baseUrl+"/api/customer",customerObj);
  }
  getAllCustomers(){
    return this.httpClient.get(environment.baseUrl+"/api/customer");
  }

  getCustomerById(id:any){
    return this.httpClient.get(environment.baseUrl+"/api/customer"+"/"+id);
  }

  getAllPermissions(){
    return this.httpClient.get(this.getAllPermissionsUrl);
  }

  getUserById(id:any){
    return this.httpClient.get(environment.baseUrl+"/api/users/"+id);
  }

  updateUserDetails(user:any){
    return this.httpClient.post(this.getAllUsersUrl,user);
  }
  createIncident(incidentObj:any){
    return this.httpClient.post(this.createIncidentUrl,incidentObj);
  }
  sendReport(incidentObj:any){
    return this.httpClient.post(this.reportingUrl,incidentObj);
  }
  getAllIncidents(){
    return this.httpClient.get(this.createIncidentUrl);
  }
}
