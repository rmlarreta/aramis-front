import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BusOperacionesDto } from 'src/app/model/busOperacionesDto.interface';
import { CobPo } from 'src/app/model/cobPos.interface';
import { CobReciboDetalle } from 'src/app/model/cobReciboDetalles.interfaces';
import { CobTipoPago } from 'src/app/model/cobTipoPago.interface';
import { PaymentIntentDto, PaymentIntentResponseDto } from 'src/app/model/paymentIntentDto.interface';
import { PagosService } from 'src/app/service/pagos/pagos.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-cobro',
  templateUrl: './cobro.component.html',
  styleUrls: ['./cobro.component.scss']
})

export class CobroComponent implements OnInit {

  error = '';
  visible = false;
  operacion!: BusOperacionesDto;
  tipos: CobTipoPago[] = [];
  pagos: CobReciboDetalle[] = [];
  pos: CobPo[] = [];
  pago: CobReciboDetalle = {
    id: '',
    reciboId: '',
    monto: 0,
    tipo: '',
    observacion: null,
    posId: null,
    posNombre: null,
    codAut: null
  };
  posselected: CobPo = {
    id: '',
    name: '',
    deviceId: null,
    token: null
  };
  tiposelected: CobTipoPago = {
    id: '',
    name: '',
    cuentaId: null,
    cuenta: null
  };

  intent!: PaymentIntentDto;
  intentresponse!: PaymentIntentResponseDto;

  constructor(
    private pagoservice: PagosService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.pagoservice.tipopagos.subscribe(x => this.tipos = x);
    this.pagoservice.pos.subscribe(x => this.pos = x);
  }

  procesarpago(): void {
    if (this.pago.monto === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Revisar', detail: 'Especifique Monto' });
      return;
    }

    if (!this.validarmonto(this.pago.monto)) {
      return;
    }

    if (this.tiposelected === null || this.tiposelected.id === '') {
      this.messageService.add({ severity: 'warn', summary: 'Revisar', detail: 'Especifique Tipo de Pago' });
      return;
    }
    if (this.tiposelected.name === "MERCADO PAGO" && (this.posselected === null || this.posselected.id === '')) {
      this.messageService.add({ severity: 'warn', summary: 'Revisar', detail: 'Especifique POS' });
      return;
    }

    this.pago.tipo = this.tiposelected.id;
    this.pago.posId = this.posselected ? this.posselected.id : null;
    this.pago.posNombre = this.posselected ? this.posselected.name : null;
    this.pago.observacion = this.tiposelected.name;
    this.pagos.push(this.pago)
    this.resetcobro();

  }

  confirmar(): void {
    if (this.totalcobro() !== this.operacion.total) {
      this.messageService.add({ severity: 'warn', summary: 'Revisar', detail: 'El monto de los Pagos no es igual a la operación' });
      return;
    }

    let totalMP = 0;
    let posId: string | null = '';

    this.pagos.forEach(x => {
      if (x.observacion === 'MERCADO PAGO') {
        totalMP += x.monto;
        posId = x.posId
      }
    });

    localStorage.setItem('intent', '');

    totalMP = totalMP * 100;
    totalMP = Math.round(totalMP);

    if (totalMP > 0) {
      this.intent = {
        amount: totalMP,
        additional_info: {
          external_reference: this.operacion.cui,
          print_on_terminal: true,
          ticket_number: this.operacion.numero?.toString()!
        }
      };

      this.pagoservice.CobranzaMPAsync(this.intent, posId)
        .pipe(first())
        .subscribe({
          next: (r) => {
            this.intentresponse = r 
            console.log(this.intentresponse)
          },
          error: error => {
            this.error = error; 
          }
        })     
    }
  }

  private validarmonto(monto: number): boolean {
    let total = 0;
    this.pagos.forEach(x =>
      total += x.monto
    )
    if ((total + monto) > this.operacion.total) {
      this.messageService.add({ severity: 'warn', summary: 'Revisar', detail: 'El monto de los Pagos es superior a la operación' });
      return false;
    }
    return true;
  }

  totalcobro(): number {
    let total = 0;
    this.pagos.forEach(x =>
      total += x.monto
    )
    return total;
  }

  private resetcobro(): void {
    this.pago = {
      id: '',
      reciboId: '',
      monto: this.operacion.total - this.totalcobro(),
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
      id: '',
      name: '',
      deviceId: null,
      token: null
    }
  }

  deletepago(tipo: string) {
    this.pagos = this.pagos.filter(val => val.tipo !== tipo);
    this.resetcobro();
  }
}

