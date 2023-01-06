import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BusDetalleOperacionesInsert } from 'src/app/model/busDetallesOperacionesInsert.interface';
import { BusDetallesOperacionesDto } from 'src/app/model/busDetallesOperacionesDto.interface';
import { BusEstadoDto } from 'src/app/model/busEstadosDto.interface';
import { BusOperacionesInsert } from 'src/app/model/busOperacionesInsert.interfaces';
import { environment } from 'src/environments/environment';
import { BusOperacionesDto } from '../../model/busOperacionesDto.interface';
import { BusOperacionTipo } from '../../model/busOperacionTipo.interface';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class OperacionesService {
  private afipObservable: BehaviorSubject<BusOperacionesDto>
    = new BehaviorSubject<BusOperacionesDto>({
      id: '',
      numero: null,
      clienteId: '',
      cui: null,
      resp: null,
      domicilio: null,
      fecha: null,
      vence: null,
      razon: '',
      codAut: null,
      tipoDocId: '',
      tipoDocName: null,
      estadoId: '',
      estadoName: null,
      pos: 0,
      operador: '',
      total: 0,
      totalLetras: null,
      totalInternos: null,
      totalNeto: null,
      totalIva: null,
      totalIva10: null,
      totalIva21: null,
      totalExento: null,
      detalles: [],
      observaciones: [],
      cuitEmpresa: '',
      razonEmpresa: '',
      domicilioEmpresa: '',
      fantasia: '',
      iibb: '',
      inicio: null,
      respoEmpresa: ''
    })
  constructor(
    private http: HttpClient
  ) { }

  get afip() {
    return this.afipObservable.asObservable();
  }

  get presupuestos() {
    return this.http.get<BusOperacionesDto[]>(`${environment.baseUrl}/operaciones/presupuestos`);
  }

  get remitos() {
    return this.http.get<BusOperacionesDto[]>(`${environment.baseUrl}/operaciones/RemitosPendientes`);
  }

  ordenesbyestado(estado: string) {
    return this.http.get<BusOperacionesDto[]>(`${environment.baseUrl}/operaciones/OrdenesByEstado/` + estado);
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

  updateoperacion(operacion: BusOperacionesInsert) {
    return this.http.post<BusOperacionesDto>(`${environment.baseUrl}/operaciones/UpdateOperacion`, operacion);
  }

  nuevoremito(presupuestoid: string) {
    return this.http.get<BusOperacionesDto>(`${environment.baseUrl}/operaciones/NuevoRemito/` + presupuestoid);
  }

  nuevaorden(presupuestoid: string) {
    return this.http.get<BusOperacionesDto>(`${environment.baseUrl}/operaciones/NuevaOrden/` + presupuestoid);
  }

  facturar(remitos: BusDetallesOperacionesDto[]) {
    return this.http.post<BusOperacionesDto>(`${environment.baseUrl}/fiscal/generarFactura`, remitos)
    .pipe(map(r => {
      console.log(r)
      this.afipObservable.next(r);
      return r;
    })) 
    ;
  }
}
