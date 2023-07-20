import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { environment } from 'src/environments/environment';
import { RequestDto } from '../operations/dtos/requestDto.interface';
import { CobReciboDetallesInsert } from './dtos/cobReciboDetallesInsert.interface';
import { CobReciboInsert } from './dtos/cobReciboInsert.interface';
import { CobTipoPagoDto } from './dtos/cobTipoPagoDto.interface';
import { PosDto } from './dtos/posDto.interface';

@Injectable({
  providedIn: 'root'
})
export class CobranzasService {
  private baseUrl = environment.baseUrl; // Establece la URL base del BFF 
  private _nuevaCobranzaUpdated!: string | null;
  private _nuevaCobranzaSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private _detalleUpdated!: CobReciboDetallesInsert | null;
  private __detalleUpdatedSubject: BehaviorSubject<CobReciboDetallesInsert | null> = new BehaviorSubject<CobReciboDetallesInsert | null>(null);
  constructor(private http: HttpClient) { }

  get nuevaCobranza$() {
    return this._nuevaCobranzaSubject.asObservable();
  }

  get nuevoDetalle$() {
    return this.__detalleUpdatedSubject.asObservable();
  }

  setnuevoDetalle$(detalle: CobReciboDetallesInsert | null) {
    this._detalleUpdated = detalle;
    this.__detalleUpdatedSubject.next(this._detalleUpdated);
  }

  setnuevaCobranza$(recibo: string | null) {
    this._nuevaCobranzaUpdated = recibo;
    this._nuevaCobranzaSubject.next(this._nuevaCobranzaUpdated);
  }

  nuevaCobranza(recibo: CobReciboInsert): Observable<any> {
    const url = `${this.baseUrl}/Cobranzas/NuevaCobranza`;
    return this.http.post<DataResponse<string>>(url, recibo);
  }

  nuevoPago(request: RequestDto): Observable<any> {
    const url = `${this.baseUrl}/Cobranzas/SaldarPago`;
    return this.http.post<DataResponse<string>>(url, request);
  }

  imputarAlone(request: RequestDto): Observable<any> {
    const url = `${this.baseUrl}/Cobranzas/ImputarAlone`;
    return this.http.post<DataResponse<string>>(url, request);
  }

  getAllTipoPagos(): Observable<DataResponse<CobTipoPagoDto[]>> {
    const url = `${this.baseUrl}/Cobranzas/GetTipoPagos`;
    return this.http.get<DataResponse<CobTipoPagoDto[]>>(url);
  }

  getAllPos(): Observable<DataResponse<PosDto[]>> {
    const url = `${this.baseUrl}/Cobranzas/GetPos`;
    return this.http.get<DataResponse<PosDto[]>>(url);
  }

  imprimirRecibo(guid: string): Observable<any> {
    const url = `${this.baseUrl}/Cobranzas/Imprimir/${guid}`;
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
