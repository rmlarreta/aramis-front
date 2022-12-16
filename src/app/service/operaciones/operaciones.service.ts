import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BusDetalleOperacionesInsert } from 'src/app/model/busDetallesOperacionesInsert.interface';
import { BusEstadoDto } from 'src/app/model/busEstadosDto.interface';
import { environment } from 'src/environments/environment';
import { BusOperacionesDto } from '../../model/busOperacionesDto.interface';
import { BusOperacionTipo } from '../../model/busOperacionTipo.interface';

@Injectable({
  providedIn: 'root'
})

export class OperacionesService {

  constructor(
    private http: HttpClient
  ) { }

  get presupuestos() {
    return this.http.get<BusOperacionesDto[]>(`${environment.baseUrl}/operaciones/presupuestos`);
  }

  get tipos() {
    return this.http.get<BusOperacionTipo[]>(`${environment.baseUrl}/operaciones/Tipos`);
  }

  get estados() {
    return this.http.get<BusEstadoDto[]>(`${environment.baseUrl}/operaciones/Estados`);
  }

  get nuevaoperacion() {
    return this.http.get<BusOperacionesDto>(`${environment.baseUrl}/operaciones/NuevaOperacion`);
  }

  operacion(id: string) {
    return this.http.get<BusOperacionesDto>(`${environment.baseUrl}/operaciones/GetOperationById/` + id);
  }

  deleteoperacion(id: string) {
    return this.http.delete(`${environment.baseUrl}/operaciones/DeleteOperacion/` + id);
  }

  insertardetalle(detalles: BusDetalleOperacionesInsert[]) {
    return this.http.post<BusOperacionesDto>(`${environment.baseUrl}/operaciones/InsertDetalle`, detalles);
  }

  deletedetalle(id: string) {
    return this.http.delete(`${environment.baseUrl}/operaciones/DeleteDetalle/` + id);
  }

  updatedetalle(detalles: BusDetalleOperacionesInsert) {
    return this.http.patch<BusOperacionesDto>(`${environment.baseUrl}/operaciones/UpdateDetalle`, detalles);
  }
}
