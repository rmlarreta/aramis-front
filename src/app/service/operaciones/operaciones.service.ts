import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  
}
