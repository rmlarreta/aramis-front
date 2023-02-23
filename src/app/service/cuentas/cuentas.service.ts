import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CobCuentum } from 'src/app/model/cobCuentum.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuentasService {

  constructor(private http: HttpClient) { }

  get cuentas() {
    return this.http.get<CobCuentum[]>(`${environment.baseUrl}/cuentas/getall`);
  }
}
