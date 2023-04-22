import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { OpDocumentoProveedorDto } from 'src/app/model/OpDocumentoProveedorDto.interface';
import { OpDocumentoProveedorPago } from 'src/app/model/opDocumentoProveedorPagoDto.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  constructor(private http: HttpClient) { }
  private newdocument: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  get newdocumentsuccess() {
    return this.newdocument.asObservable();
  }
  documentByEstado(estado: string) {
    return this.http.get<OpDocumentoProveedorDto[]>(`${environment.baseUrl}/proveedores/GetByEstado/` + estado);
  }

  InsertDocument(document: OpDocumentoProveedorDto) {
    return this.http.post<boolean>(`${environment.baseUrl}/proveedores/Add/`, document)
      .pipe(
        map((_response) => {
          this.newdocument.next(_response);
        })
      );
  }

  PagarDocumento(pago: OpDocumentoProveedorPago) {
    return this.http.patch<boolean>(`${environment.baseUrl}/proveedores/PagarDocumento/`, pago)
      .pipe(
        map((_response) => {
          this.newdocument.next(_response);
        })
      );
  }
}
