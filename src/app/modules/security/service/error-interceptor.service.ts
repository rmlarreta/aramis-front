import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err: any) => {
                if ([401, 403].includes(err.status)) {
                    // auto logout if 401 Unauthorized or 403 Forbidden response returned from API
                    this.authenticationService.logout();
                }
                throw err; // Lanza el error para que pueda ser manejado por el siguiente interceptor o el código que llamó a la solicitud
            })
        );
    }
}
