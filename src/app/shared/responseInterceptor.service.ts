import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(event => { 
        if (event instanceof HttpResponse && event.body && event.body.errorResponse !== null) { 
          const statusCode = event.body.errorResponse.errorCode; // Establece el código de estado deseado
          throw new HttpErrorResponse({ status: statusCode });
        }
      })
    );
  }
}