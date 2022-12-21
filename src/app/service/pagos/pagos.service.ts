import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CobPo } from 'src/app/model/cobPos.interface';
import { CobTipoPago } from 'src/app/model/cobTipoPago.interface';
import { PaymentIntentDto, PaymentIntentResponseDto } from 'src/app/model/paymentIntentDto.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private intensubsejt!: BehaviorSubject<PaymentIntentResponseDto | null>;
  public intent: Observable<PaymentIntentResponseDto | null>;

  constructor(
    private http: HttpClient
  ) { 
    this.intensubsejt = new BehaviorSubject(JSON.parse(localStorage.getItem('intent')!));
    this.intent = this.intensubsejt.asObservable();
  }

  get tipopagos() {
    return this.http.get<CobTipoPago[]>(`${environment.baseUrl}/pagos/TiposPago`);
  }

  get pos() {
    return this.http.get<CobPo[]>(`${environment.baseUrl}/pagos/GetPos`);
  }

  CobranzaMPAsync(intent: PaymentIntentDto, point: string) {
    return this.http.post<PaymentIntentResponseDto>(`${environment.baseUrl}/pagos/CobranzaMP/` + point, intent)
    .pipe(map(r => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('intent', JSON.stringify(r));
      this.intensubsejt.next(r);
      return r;
  }));
  }
}
