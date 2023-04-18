import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OpDocumentoProveedorDto } from 'src/app/model/OpDocumentoProveedorDto.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  constructor(private http: HttpClient) { }

  documentByEstado(estado: string) {
    return this.http.get<OpDocumentoProveedorDto[]>(`${environment.baseUrl}/proveedores/GetByEstado/` + estado);
  }

  InsertDocument(document: OpDocumentoProveedorDto) {
    return this.http.post<boolean>(`${environment.baseUrl}/proveedores/Add/`, document);
  }
}
