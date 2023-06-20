import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { environment } from 'src/environments/environment';
import { BusOperacionDetalleDto } from './dtos/busOperacionDetalleDto.interface';
import { BusOperacionInsert } from './dtos/busOperacionInsert.interface';
import { BusOperacionSumaryDto } from './dtos/busOperacionSummaryDto.interface';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  private baseUrl = environment.baseUrl; // Establece la URL base del BFF 
  constructor(private http: HttpClient) { }


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
}
