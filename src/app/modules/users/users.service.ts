import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { environment } from 'src/environments/environment';
import { SecRoleDto } from './dtos/commons/rolesDto.interface';
import { UserDto } from './dtos/userDto.interface';
import { UserInsertDto } from './dtos/userInsertDto.interface';
import { UserUpdateDto } from './dtos/userUpdateDto.inteface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = environment.baseUrl; // Establece la URL base del BFF
  private userUpdatedSubject: Subject<void> = new Subject<void>();
  public userUpdated$: Observable<void> = this.userUpdatedSubject.asObservable();
  constructor(private http: HttpClient) { }

  createUser(userInsert: UserInsertDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/users/createUser`, userInsert)
      .pipe(
        tap(() => {
          // Emitir el evento de actualización desde el servicio
          this.userUpdatedSubject.next();
        })
      );
  }

  updateUser(userUpdate: UserUpdateDto): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/users/updateUser`, userUpdate)
      .pipe(
        tap(() => {
          // Emitir el evento de actualización desde el servicio
          this.userUpdatedSubject.next();
        })
      );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/deleteUser/${id}`)
      .pipe(
        tap(() => {
          // Emitir el evento de actualización desde el servicio
          this.userUpdatedSubject.next();
        })
      );;
  }

  getAllUsers(): Observable<DataResponse<UserDto[]>> {
    return this.http.get<DataResponse<UserDto[]>>(`${this.baseUrl}/users/getAllUsers`);
  }

  getUserById(id: string): Observable<DataResponse<UserDto>> {
    return this.http.get<DataResponse<UserDto>>(`${this.baseUrl}/users/getUserById/${id}`);
  }

  getUserByName(name: string): Observable<DataResponse<UserDto>> {
    return this.http.get<DataResponse<UserDto>>(`${this.baseUrl}/users/getUserByName/${name}`);
  }

  getRoles() {
    return this.http.get<DataResponse<SecRoleDto[]>>(`${this.baseUrl}/users/getRoles`);
  }
}
