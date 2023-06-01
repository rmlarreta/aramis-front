import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UserAuth } from 'src/app/modules/security/dtos/userAuth.interface';
import { environment } from 'src/environments/environment';
import { UserRequest } from '../dtos/userRequest.interface copy';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private baseUrl = environment.baseUrl; 
    private userSubject: BehaviorSubject<UserAuth | null>;
    public user: Observable<UserAuth | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {

        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(userRequest: UserRequest) {
        return this.http.put<DataResponse<UserAuth>>(`${this.baseUrl}/security/authenticate`, userRequest)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user.data));
                this.userSubject.next(user.data);
                return user;
            }));
    }

    changepassword(userRequest: UserRequest) {
        return this.http.put<DataResponse<UserAuth>>(`${this.baseUrl}/users/changePassword`, userRequest)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user.data));
                this.userSubject.next(user.data);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['security/login']);
    }
}