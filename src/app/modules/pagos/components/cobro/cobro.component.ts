import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { BusOperacionesDto } from 'src/app/model/busOperacionesDto.interface';
import { PagoInsert } from 'src/app/model/cobPagoInsert.interface';
import { CobPo } from 'src/app/model/cobPos.interface';
import { CobReciboDetalle } from 'src/app/model/cobReciboDetalles.interface';
import { ReciboInsert } from 'src/app/model/cobReciboInsert.interface';
import { CobTipoPago } from 'src/app/model/cobTipoPago.interface';
import { PaymentIntentDto, PaymentIntentResponseDto } from 'src/app/model/paymentIntentDto.interface';
import { PagosService } from 'src/app/service/pagos/pagos.service';

@Component({
  selector: 'app-cobro',
  templateUrl: './cobro.component.html',
  styleUrls: ['./cobro.component.scss']
})

export class CobroComponent implements OnInit {

  visible = false;
  cobrandomp = false;

  operacion!: BusOperacionesDto;

  pos: CobPo[] = [];
  posselected: CobPo = {
    id: null,
    name: null,
    deviceId: null,
    token: null
  };
  tipospago: CobTipoPago[] = [];
  tiposelected: CobTipoPago = {
    id: '',
    name: '',
    cuentaId: null,
    cuenta: null
  };

  recibo$: Observable<ReciboInsert>;
  recibo: ReciboInsert = {
    id: null,
    numero: null,
    clienteId: '',
    fecha: null,
    operador: null,
    detalles: []
  };
  reciboDetalles: CobReciboDetalle[] = [];
  reciboDetalle: CobReciboDetalle = {
    id: null,
    reciboId: null,
    monto: 0,
    tipo: '',
    observacion: null,
    posId: null,
    posNombre: null,
    codAut: null
  };

  intent!: PaymentIntentDto;
  intentresponse$: Observable<PaymentIntentResponseDto>;

  pago: PagoInsert = {
    reciboId: '',
    operaciones: []
  };

  constructor(
    private pagoservice: PagosService,
    private messageService: MessageService
  ) {
    this.pagoservice.tipopagos.subscribe(x => this.tipospago = x);
    this.pagoservice.pos.subscribe(x => this.pos = x);

    this.intentresponse$ = pagoservice.pago;
    this.recibo$ = pagoservice.recibo;
  }

  ngOnInit(): void {
    this.intentresponse$.subscribe(x => {
      if (x) {
        this.cobrandomp = x.status === 'COBRANDO' ? true : false;
        if (x.status === 'FINISHED') {
          this.reciboDetalles.forEach(p => {
            if (p.observacion === 'MERCADO PAGO') {
              p.codAut = x.id
            };
          });
          this.insertrecibo();
          this.recibo$.subscribe({
            next: (r) => {if(r){if(r.id !== '0') {this.imputarpago(r.id?.toString()!)}}}
          , error: (error) => { this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: error })}
         });
        };
      };
    });
  }

  agregaritempago(): void {
    if (this.reciboDetalle.monto === 0) {
      this.messageService.add({key: 'tc', severity: 'warn', summary: 'Revisar', detail: 'Especifique Monto' });
      return;
    }

    if (!this.validarmonto(this.reciboDetalle.monto)) {
      return;
    }

    if (this.tiposelected === null || this.tiposelected.id === '') {
      this.messageService.add({key: 'tc', severity: 'warn', summary: 'Revisar', detail: 'Especifique Tipo de Pago' });
      return;
    }

    if (this.tiposelected.name === "MERCADO PAGO" && (this.posselected === null || this.posselected.id === '')) {
      this.messageService.add({key: 'tc', severity: 'warn', summary: 'Revisar', detail: 'Especifique POS' });
      return;
    }

    this.reciboDetalle.tipo = this.tiposelected.id;
    this.reciboDetalle.posId = this.posselected ? this.posselected.id : null;
    this.reciboDetalle.posNombre = this.posselected ? this.posselected.name : null;
    this.reciboDetalle.observacion = this.tiposelected.name;
    this.reciboDetalles.push(this.reciboDetalle)
    this.resetcobro();

  }

  deleteitempago(tipo: string) {
    this.reciboDetalles = this.reciboDetalles.filter(val => val.tipo !== tipo);
    this.resetcobro();
  }

  private resetcobro(): void {
    this.reciboDetalle = {
      id: null,
      reciboId: null,
      monto: this.operacion.total - this.calculartotalcobro(),
      tipo: '',
      observacion: null,
      posId: null,
      posNombre: null,
      codAut: null
    }

    this.tiposelected = {
      id: '',
      name: '',
      cuentaId: null,
      cuenta: null
    }

    this.posselected = {
      id: null,
      name: null,
      deviceId: null,
      token: null
    }
  }

  calculartotalcobro(): number {
    let total = 0;
    this.reciboDetalles.forEach(x =>
      total += x.monto
    )
    return total;
  }

  private validarmonto(monto: number): boolean {
    let total = 0;
    this.reciboDetalles.forEach(x =>
      total += x.monto
    )
    if ((total + monto) > this.operacion.total) {
      this.messageService.add({ severity: 'warn', summary: 'Revisar', detail: 'El monto de los Pagos es superior a la operación' });
      return false;
    }
    return true;
  }

  confirmar() {
    if (this.calculartotalcobro() !== this.operacion.total) {
      this.messageService.add({key: 'tc', severity: 'warn', summary: 'Revisar', detail: 'El monto de los Pagos no es igual a la operación' });
      return;
    }

    let totalMP = 0;
    let posId: string | null = '';

    this.reciboDetalles.forEach(x => {
      if (x.observacion === 'MERCADO PAGO') {
        totalMP += x.monto;
        posId = x.posId
      }
    });

    totalMP = totalMP * 100;
    totalMP = Math.round(totalMP);
    if (totalMP > 0) {
      this.cobromp(totalMP, posId);
    } else {
      this.insertrecibo();
      this.recibo$.subscribe(r => {
        if (r) {
          if (r.id !== '0') {
            this.imputarpago(r.id?.toString()!)
          }
        }
      })
    };
  }

  private cobromp(totalMP: number, posId: string): void {
    this.intent = {
      amount: totalMP,
      additional_info: {
        external_reference: this.operacion.fantasia,
        print_on_terminal: true,
        ticket_number: this.operacion.numero?.toString()!
      }
    };

    this.pagoservice.nuevopago = { status: 'COBRANDO', amount: 0, device_id: '', id: '0', additional_info: { external_reference: '', print_on_terminal: true, ticket_number: '0' } }
    this.intentresponse$ =
      this.pagoservice.cobranzaMPAsync(this.intent, posId!);
  }

  private insertrecibo() {
    this.recibo.detalles = this.reciboDetalles;
    this.recibo$ =
      this.pagoservice.insertRecibo(this.recibo);
  }

  private imputarpago(recibo: string) {
    this.pago.reciboId = recibo;
    this.pago.operaciones.push(this.operacion.id);
    this.pagoservice.imputarPago(this.pago)
      .subscribe(x => {
        if (x) {
          this.resetpagos();
          this.visible = false;
        };
      });
  };

  resetpagos(): void {
    if (this.cobrandomp) {
      this.cancelarmp();
      this.visible = true;
      return;
    }

    this.reciboDetalles = [];
    this.recibo = {
      id: null,
      numero: null,
      clienteId: '',
      fecha: null,
      operador: null,
      detalles: []
    };
  }

  cancelarmp(): void {
    console.log("cancelando mP");
  }
}

