import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { OpPaiDto } from 'src/app/model/opClientesAttributes.interface';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { environment } from 'src/environments/environment';
import { OpCustomerDto } from './dtos/opCustomerDto.interface';
import { OpCustomerInsert } from './dtos/opCustomerInsert.interface';
import { OpGenderDto } from './dtos/opGenderDto.interface';
import { OpRespDto } from './dtos/opRespDto.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private baseUrl = environment.baseUrl; // Establece la URL base del BFF 
  private _clientesUpdatedSubject: Subject<void> = new Subject<void>();
  public _clientesUpdated$: Observable<void> = this._clientesUpdatedSubject.asObservable();
  private _clienteSeleccionado: OpCustomerDto | null = null;
  private _clienteSeleccionadoSubject: BehaviorSubject<OpCustomerDto | null> = new BehaviorSubject<OpCustomerDto | null>(null);
  constructor(private http: HttpClient) { }

  getClienteSeleccionadoSubject(): BehaviorSubject<OpCustomerDto | null> {
    return this._clienteSeleccionadoSubject;
  }

  setClienteSeleccionado(cliente: OpCustomerDto | null) {
    this._clienteSeleccionado = cliente;
    this._clienteSeleccionadoSubject.next(this._clienteSeleccionado);
  }

  getAllClientes(): Observable<DataResponse<OpCustomerDto[]>> {
    const url = `${this.baseUrl}/clientes/getAllClientes`;
    return this.http.get<DataResponse<OpCustomerDto[]>>(url);
  }

  insertCliente(customer: OpCustomerInsert): Observable<any> {
    const url = `${this.baseUrl}/clientes/insertCliente`;
    return this.http.post(url, customer)
      .pipe(
        tap(() => {
          // Emitir el evento de actualización desde el servicio
          this._clientesUpdatedSubject.next();
        })
      );
  }

  deleteCliente(id: string): Observable<any> {
    const url = `${this.baseUrl}/clientes/deleteCliente/${id}`;
    return this.http.delete(url)
      .pipe(
        tap(() => {
          // Emitir el evento de actualización desde el servicio
          this._clientesUpdatedSubject.next();
        })
      );
  }

  updateCliente(customer: OpCustomerInsert): Observable<any> {
    const url = `${this.baseUrl}/clientes/updateCliente`;
    return this.http.put(url, customer)
      .pipe(
        tap(() => {
          // Emitir el evento de actualización desde el servicio
          this._clientesUpdatedSubject.next();
        })
      );
  }

  getConciliacion(customer: string): Observable<any> {
    const url = `${this.baseUrl}/clientes/GetConciliacion/${customer}`;
    return this.http.get(url);
  }

  getAllResps(): Observable<DataResponse<OpRespDto[]>> {
    const url = `${this.baseUrl}/auxClientes/getAllResps`;
    return this.http.get<DataResponse<OpRespDto[]>>(url);
  }

  GetAllPaises(): Observable<DataResponse<OpPaiDto[]>> {
    const url = `${this.baseUrl}/auxClientes/getAllPaises`;
    return this.http.get<DataResponse<OpPaiDto[]>>(url);
  }

  getAllGenders(): Observable<DataResponse<OpGenderDto[]>> {
    const url = `${this.baseUrl}/auxClientes/getAllGenders`;
    return this.http.get<DataResponse<OpGenderDto[]>>(url);
  }
}
