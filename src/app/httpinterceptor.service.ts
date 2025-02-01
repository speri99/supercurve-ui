import { HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpinterceptorService {
  constructor(private router:Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = localStorage.getItem('id_token');
    console.log("From Interceptor::")
    if (!!jwt) {
      if(!req.url.endsWith("signin"))
      {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${jwt}`
          }
        });
      }
    }
    return next.handle(req).pipe(tap(evt => {
      if (evt instanceof HttpResponse) {
          console.log(evt.body?.statusCode);
          if(evt.body?.statusCodeValue === 401)
          {
            this.handleAuthError();
          }
              
      }
  }),
        catchError(
            (err, caught) => {
              if (err.status === 401 && !req.url.endsWith("authenticate") ){
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
    this.router.navigateByUrl("/");
  }
}
