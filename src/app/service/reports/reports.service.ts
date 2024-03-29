import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private baseUrl =  environment.baseUrl; // Establece la URL base del BFF
  constructor(private http: HttpClient) { }

  recibo(id: string) {
    return this.http.get(`${this.baseUrl}/reports/ReporteRecibo/` + id, {
      responseType: 'blob',
      observe: 'response'
    })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }));
  }

  remito(id: string) {
    return this.http.get(`${this.baseUrl}/reports/ReporteRemito/` + id, {
      responseType: 'blob',
      observe: 'response'
    })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }));
  }

  factura(id: string) {
    return this.http.get(`${this.baseUrl}/reports/ReporteFactura/` + id, {
      responseType: 'blob',
      observe: 'response'
    })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }));
  }

  orden(id: string) {
    return this.http.get(`${this.baseUrl}/reports/ReporteTicketOrden/` + id, {
      responseType: 'blob',
      observe: 'response'
    })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }));
  }

  presupuesto(id: string) {
    return this.http.get(`${this.baseUrl}/reports/ReportePresupuesto/` + id, {
      responseType: 'blob',
      observe: 'response'
    })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }));
  }
 
}
