import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injector, Injectable } from '@angular/core';
import { flatMap, catchError, mergeMap  } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private tokenService: TokenService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
        console.log('error')
        if (error.status === 401 || error.status === 400 ) {
        console.log('intercepted')
            // this.tokenService.getNewToken();
            return this.tokenService.tokenUpdateListener()
            .pipe(mergeMap(a=>{
              return next.handle(req)
            }))


        }

        //return throwError(error);
      }));
  }
}
