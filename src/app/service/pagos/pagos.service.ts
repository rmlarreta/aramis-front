import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { PagoInsert } from 'src/app/model/cobPagoInsert.interface';
import { CobPo } from 'src/app/model/cobPos.interface';
import { ReciboInsert } from 'src/app/model/cobReciboInsert.interface';
import { CobTipoPago } from 'src/app/model/cobTipoPago.interface';
import { PaymentIntentDto, PaymentIntentResponseDto } from 'src/app/model/paymentIntentDto.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class PagosService {

  private pagoObservable: BehaviorSubject<PaymentIntentResponseDto>
    = new BehaviorSubject<PaymentIntentResponseDto>({ id: '0', status: '0', amount: 0, device_id: '', additional_info: { external_reference: '', print_on_terminal: true, ticket_number: '0' } })
  private reciboObservable: BehaviorSubject<ReciboInsert>
    = new BehaviorSubject<ReciboInsert>({ id: '0', numero: 0, clienteId: '', fecha: null, operador: '', detalles: [] });
  private pagadoObservable: BehaviorSubject<boolean>
    = new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient
  ) { }

  get pagado() {
    return this.pagadoObservable.asObservable();
  }

  get pago() {
    return this.pagoObservable.asObservable();
  }

  get recibo() {
    return this.reciboObservable.asObservable();
  }

  get tipopagos() {
    return this.http.get<CobTipoPago[]>(`${environment.baseUrl}/pagos/TiposPago`);
  }

  get pos() {
    return this.http.get<CobPo[]>(`${environment.baseUrl}/pagos/GetPos`);
  }

  set nuevopago(intent: PaymentIntentResponseDto) {
    this.pagoObservable.next(intent);
  }

  set resetpagado(pagado: boolean) {
    this.pagadoObservable.next(pagado);
  }

  cobranzaMPAsync(intent: PaymentIntentDto, posId: string) {
    return this.http.post<PaymentIntentResponseDto>(`${environment.baseUrl}/pagos/CobranzaMP/` + posId, intent)
      .pipe(map(r => {
        this.pagoObservable.next(r);
        return r;
      }));
  }

  insertRecibo(recibo: ReciboInsert) {
    return this.http.post<ReciboInsert>(`${environment.baseUrl}/pagos/InsertRecibo/`, recibo)
      .pipe(map(r => {
        this.reciboObservable.next(r);
        return r;
      }));
  }

  imputarPago(pago: PagoInsert) {
    return this.http.post<boolean>(`${environment.baseUrl}/pagos/ImputarPago/`, pago)
      .pipe(map(r => {
        this.pagadoObservable.next(r);
        return r;
      }));
  }
}
