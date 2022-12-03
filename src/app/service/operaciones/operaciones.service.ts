import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BusOperacionesDto } from '../../pages/home/model/busOperacionesDto.interface';
import { BusOperacionesInsert } from '../../pages/home/model/busOperacionesInsert.interfaces';
import { BusOperacionTipo } from '../../pages/home/model/busOperacionTipo.interface';

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

 nuevaoperacion(op:BusOperacionesInsert){
  return this.http.post<BusOperacionesDto[]>(`${environment.baseUrl}/operaciones/NuevaOperacion`,op);
 }
}
