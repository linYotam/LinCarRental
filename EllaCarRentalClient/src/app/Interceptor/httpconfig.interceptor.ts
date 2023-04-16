  import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Router } from '@angular/router';
  import { noop,  Observable } from 'rxjs';
  import 'rxjs/add/operator/do';
  import sweetalert2 from 'sweetalert2';
  
  //Dependency injection
  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {

    //Not in use
    public intercept(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>{

      request = request.clone({

        setHeaders: {
          Authorization: "Bearer " + sessionStorage.getItem('token')
        }
      });

      return next.handle(request);

    }  
  }
 