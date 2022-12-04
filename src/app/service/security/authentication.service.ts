import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { UserAuth } from 'src/app/model/userAuth.interface';
import { environment } from 'src/environments/environment'; 

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
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

    login(username: string, password: string) {
        return this.http.get<UserAuth>(`${environment.baseUrl}/users/authenticate/${username}/${password}`)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    changepassword(username: string, password: string, npassword: string) {
        return this.http.get<UserAuth>(`${environment.baseUrl}/users/changePassword/${username}/${password}/${npassword}`)
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
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