import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CobCuentaMovimientoDto } from 'src/app/model/cobCuentaMovimientoDto.interface';
import { CobCuentum } from 'src/app/model/cobCuentum.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuentasService {

  private cuenta$: BehaviorSubject<CobCuentum> = new BehaviorSubject<CobCuentum>({
    id: '',
    name: '',
    saldo: 0
  })
  constructor(private http: HttpClient) { }

  get cuenta() {
    return this.cuenta$.asObservable();
  }
  get cuentas() {
    return this.http.get<CobCuentum[]>(`${environment.baseUrl}/cuentas/getall`);
  }

  movimiento(movimiento: CobCuentaMovimientoDto) {
    return this.http.post<CobCuentum>(`${environment.baseUrl}/cuentas/MovimientoCuentas`, movimiento)
      .pipe(
        map((_cuenta) => {
          this.cuenta$.next(_cuenta);
        }));
  }
}
