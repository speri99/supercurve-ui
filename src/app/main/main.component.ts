import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MainService } from './main.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  visible = false;
  showTemplate:boolean=true;
  userRoles:any=[];
  initLoading = false; // bug
  loadingMore = false;
  data: any[] = [];
  list: Array<any> =  [
    {
      title: 'Your subscription is about to expire, please renew'
    }
    
  ];
  offsetTop =0;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  constructor(private router:Router,private mainService:MainService) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe((event: any): void => {
        let urlArray: any[] = event.url.split('/');  
        if(urlArray[1]=="login" || urlArray[1]== ""){
          this.showTemplate=false;
        }else{
          this.showTemplate=true;
        }
      });
   }

  ngOnInit(): void {
    localStorage.getItem("userRoles")?this.mainService.passUserRoles([localStorage.getItem("userRoles")]):"";
    this.mainService.userRolesObservable.subscribe(data=>{
      this.userRoles=JSON.parse(data);
    })
    this.sidenav?.open();
  }
  signout(){
    localStorage.removeItem("userRoles");
    localStorage.removeItem('id_token');
    this.router.navigateByUrl("/");
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  edit(asd:any){

  }

  goToLink(){
    window.open("http://99.83.8.157:88/#login", "_blank");
}

}
