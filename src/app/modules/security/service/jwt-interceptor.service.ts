import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private baseUrl =  environment.baseUrl; 
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.authenticationService.userValue;
        const isLoggedIn = user?.token;
        const isApiUrl = request.url.startsWith(this.baseUrl);
        if (isLoggedIn && isApiUrl) { 
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`
                }
            });
        }
        return next.handle(request);
    }
}