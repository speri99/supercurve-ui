import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import {catchError, tap} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HttpinterceptorService implements  HttpInterceptor{

  dialogRef:any;
  constructor(private router:Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = localStorage.getItem('id_token');
    console.log("From Interceptor::")
    if (!!jwt) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${jwt}`
          }
        });
    }
    return next.handle(req).pipe(tap(evt => {
      if (evt instanceof HttpResponse) {
          console.log(evt.body.statusCode);
          if(evt.body.statusCodeValue === 401)
          {
            this.handleAuthError();
          }
              
      }
  }),
        catchError(
            (err, caught) => {
              if (err.status === 401 && !req.url.endsWith("authenticate") ){
                // this.sharedService.updateUserStatus(false);
                sessionStorage.setItem("isUserLoggedIn","false")
                this.handleAuthError();
                return of(err);
              }
              throw err;
            }
        )
    );
  }

  handleAuthError()
  {
   this.router.navigateByUrl("/login");
  }
}
