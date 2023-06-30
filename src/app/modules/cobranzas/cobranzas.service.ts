import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { environment } from 'src/environments/environment';
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

  setnuevoDetalle$(detalle: CobReciboDetallesInsert) {
    this._detalleUpdated = detalle;
    this.__detalleUpdatedSubject.next(this._detalleUpdated);
  }

  setnuevaCobranza$(recibo: string) {
    this._nuevaCobranzaUpdated = recibo;
    this._nuevaCobranzaSubject.next(this._nuevaCobranzaUpdated);
  }

  nuevaCobranza(recibo: CobReciboInsert): Observable<any> {
    const url = `${this.baseUrl}/Cobranzas/NuevaCobranza`;
    return this.http.post<DataResponse<string>>(url, recibo);
  }

  getAllTipoPagos(): Observable<DataResponse<CobTipoPagoDto[]>> {
    const url = `${this.baseUrl}/Cobranzas/GetTipoPagos`;
    return this.http.get<DataResponse<CobTipoPagoDto[]>>(url);
  }

  getAllPos(): Observable<DataResponse<PosDto[]>> {
    const url = `${this.baseUrl}/Cobranzas/GetPos`;
    return this.http.get<DataResponse<PosDto[]>>(url);
  }
}
