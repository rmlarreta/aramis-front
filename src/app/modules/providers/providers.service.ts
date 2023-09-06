import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { environment } from 'src/environments/environment';
import { OpConciliacionProviders } from './dtos/opConciliacionProviders.interface';
import { OpDocumentoProveedorInsert } from './dtos/opDocumentoProveedorInsert.interface';
import { OpPagoProveedor } from './dtos/opPagoProveedor.interface';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {
  private baseUrl = environment.baseUrl; // Establece la URL base del BFF 
  private _documentosUpdatedSubject: Subject<void> = new Subject<void>();
  public _documentosUpdated$: Observable<void> = this._documentosUpdatedSubject.asObservable();
  constructor(private http: HttpClient) { }

  getAllPendientes(): Observable<DataResponse<OpConciliacionProviders[]>> {
    const url = `${this.baseUrl}/proveedores/getAllPendientes`;
    return this.http.get<DataResponse<OpConciliacionProviders[]>>(url);
  }

  insertDocumento(documento: OpDocumentoProveedorInsert): Observable<any> {
    const url = `${this.baseUrl}/proveedores/insertDocumento`;
    return this.http.post(url, documento)
      .pipe(
        tap(() => {
          // Emitir el evento de actualización desde el servicio
          this._documentosUpdatedSubject.next();
        })
      );
  }

  pago(pago: OpPagoProveedor): Observable<any> {
    const url = `${this.baseUrl}/proveedores/pago`;
    return this.http.post(url, pago)
      .pipe(
        tap(() => {
          // Emitir el evento de actualización desde el servicio
          this._documentosUpdatedSubject.next();
        })
      );
  }
}
