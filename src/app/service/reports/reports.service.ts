import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }

  recibo(id: string) {
    return this.http.get(`${environment.baseUrl}/reports/ReporteRecibo/` + id, {
      responseType: 'blob',
      observe: 'response'
    })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }));
  }

  remito(id: string) {
    return this.http.get(`${environment.baseUrl}/reports/ReporteRemito/` + id, {
      responseType: 'blob',
      observe: 'response'
    })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }));
  }

  factura(id: string) {
    return this.http.get(`${environment.baseUrl}/reports/ReporteFactura/` + id, {
      responseType: 'blob',
      observe: 'response'
    })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }));
  }

  orden(id: string) {
    return this.http.get(`${environment.baseUrl}/reports/ReporteTicketOrden/` + id, {
      responseType: 'blob',
      observe: 'response'
    })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        }));
  }
}
