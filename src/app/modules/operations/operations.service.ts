import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { environment } from 'src/environments/environment';
import { BusOperacionDetalleDto } from './dtos/busOperacionDetalleDto.interface';
import { BusOperacionInsert } from './dtos/busOperacionInsert.interface';
import { BusOperacionSumaryDto } from './dtos/busOperacionSummaryDto.interface';
import { RequestDto } from './dtos/requestDto.interface';
import { TipoOperacionDto } from './dtos/tipoOperacionDto.interface';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  private baseUrl = environment.baseUrl; // Establece la URL base del BFF 
  private _remitoUpdated!: BusOperacionSumaryDto | null;
  private __remitoUpdatedUpdatedSubject: BehaviorSubject<BusOperacionSumaryDto | null> = new BehaviorSubject<BusOperacionSumaryDto | null>(null);

  constructor(private http: HttpClient) { }

  get nuevoremito$() {
    return this.__remitoUpdatedUpdatedSubject.asObservable();
  }

  setnuevoremito$(remito: BusOperacionSumaryDto | null) {
    this._remitoUpdated = remito;
    this.__remitoUpdatedUpdatedSubject.next(this._remitoUpdated);
  }

  getAllPresupuestos(): Observable<DataResponse<BusOperacionSumaryDto[]>> {
    const url = `${this.baseUrl}/presupuestos/getAllPresupuestos`;
    return this.http.get<DataResponse<BusOperacionSumaryDto[]>>(url);
  }

  nuevoPresupuesto(): Observable<DataResponse<BusOperacionSumaryDto>> {
    const url = `${this.baseUrl}/presupuestos/NuevoPresupuesto`;
    return this.http.post<DataResponse<BusOperacionSumaryDto>>(url, {});
  }

  getPresupuestoById(guid: string): Observable<DataResponse<BusOperacionSumaryDto>> {
    const url = `${this.baseUrl}/presupuestos/GetPresupuestoById/${guid}`;
    return this.http.get<DataResponse<BusOperacionSumaryDto>>(url);
  }

  updateDetallePresupuesto(detalles: BusOperacionDetalleDto): Observable<any> {
    const url = `${this.baseUrl}/presupuestos/UpdateDetalle`;
    return this.http.put<any>(url, detalles);
  }

  insertDetallesPresupuesto(detalles: BusOperacionDetalleDto[]): Observable<any> {
    const url = `${this.baseUrl}/presupuestos/InsertDetalles`;
    return this.http.post<any>(url, detalles);
  }

  deleteDetallePresupuesto(guid: string): Observable<any> {
    const url = `${this.baseUrl}/presupuestos/DeleteDetalle/${guid}`;
    return this.http.delete<any>(url);
  }

  deletePresupuesto(guid: string): Observable<any> {
    const url = `${this.baseUrl}/presupuestos/DeletePresupuesto/${guid}`;
    return this.http.delete<any>(url);
  }

  updatePresupuesto(presupuesto: BusOperacionInsert): Observable<any> {
    const url = `${this.baseUrl}/presupuestos/UpdatePresupuesto`;
    return this.http.put<any>(url, presupuesto);
  }

  imprimirPresupuesto(guid: string): Observable<any> {
    const url = `${this.baseUrl}/presupuestos/Imprimir/${guid}`;
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response'
    })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }
        ));
  }

  imprimirRemito(guid: string): Observable<any> {
    const url = `${this.baseUrl}/Remitos/Imprimir/${guid}`;
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response'
    })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }
        ));
  }

  nuevoRemito(request: RequestDto): Observable<DataResponse<BusOperacionSumaryDto>> {
    const url = `${this.baseUrl}/remitos/NuevoRemito`;
    return this.http.post<DataResponse<BusOperacionSumaryDto>>(url, request);
  }

  getAllTipos(): Observable<DataResponse<TipoOperacionDto[]>> {
    const url = `${this.baseUrl}/auxOperaciones/GetAllTipos`;
    return this.http.get<DataResponse<TipoOperacionDto[]>>(url);
  }
}
