import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CobranzasService } from 'src/app/modules/cobranzas/cobranzas.service';
import { ReciboComponent } from 'src/app/modules/cobranzas/components/recibo/recibo.component';
import { BusOperacionSumaryDto } from 'src/app/modules/operations/dtos/busOperacionSummaryDto.interface';
import { RequestDto } from 'src/app/modules/operations/dtos/requestDto.interface';
import { ClientesService } from '../../clientes.service';
import { CustomerConciliacion } from '../../dtos/conciliacion.interface';

@Component({
  selector: 'app-conciliacion',
  templateUrl: './conciliacion.component.html',
  styleUrls: ['./conciliacion.component.css']
})
export class ConciliacionComponent implements OnInit {
  visible = false;
  cliente!: string;
  conciliacion: CustomerConciliacion = {
    customer: null,
    operacionesImpagas: null,
    recibosNoImputados: null,
    debe: 0,
    haber: 0,
    balance: 0
  };

  operacionId!: string | null;
  @ViewChild('recibosContainer', { read: ViewContainerRef }) recibosContainer!: ViewContainerRef;
  recibo!: ComponentRef<ReciboComponent>;
  visibleRecibo: boolean = false;
  private reciboUpdateSubscription!: Subscription;

  constructor(
    private clientesService: ClientesService,
    private cobranzaService: CobranzasService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnDestroy() {
    this.clientesService.setClienteSeleccionado(null);
    this.reciboUpdateSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.getConciliacion();

    this.reciboUpdateSubscription = this.cobranzaService.nuevaCobranza$
      .subscribe(recibo => {
        this.visibleRecibo = false;
        if (recibo !== null) {
          this.operacionId ? this.onImputar(recibo) : this.getConciliacion(); this.onPrint(recibo);
          this.cobranzaService.setnuevaCobranza$(null);
        }
      });
  }

  hideDialog() {
    this.visible = false;
  }

  getConciliacion(): void {
    this.clientesService.getConciliacion(this.cliente)
      .subscribe({
        next: (response) => {
          this.conciliacion = response.data
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
        }
      });
  }

  openPay(operacion: BusOperacionSumaryDto) {
    this.confirmationService.confirm({
      message: '¿Comienza cobranza del documento?',
      accept: () => {
        this.operacionId = operacion.id;
        this.recibosContainer.clear();
        this.recibo = this.recibosContainer.createComponent(ReciboComponent);
        this.recibo.instance.nroOperacion = operacion.id;
        this.recibo.instance.montoMax = operacion.saldosPendientes!;
        this.recibo.instance.pendiente = operacion.saldosPendientes!;
        this.recibo.instance.presupuestando = true;
        this.recibo.instance.saldando = true;
        this.recibo.instance.recibo.operacion = operacion.id;
        this.recibo.instance.recibo.clienteId = operacion.clienteId;
        this.recibo.instance.razon = operacion.razon;
        this.visibleRecibo = true;
      }
    });
  }

  openPayAlone() {
    if (this.conciliacion.customer?.cui === "0") {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "No se emiten recibos sin operaciones en este cliente" });
      return;
    }
    this.recibosContainer.clear();
    this.recibo = this.recibosContainer.createComponent(ReciboComponent);
    this.recibo.instance.recibo.clienteId = this.conciliacion.customer?.id!;
    this.recibo.instance.razon = this.conciliacion.customer?.razon!;
    this.recibo.instance.alone = true;
    this.operacionId = null;
    this.visibleRecibo = true;
  }

  onImputar(recibo: string) {
    const request: RequestDto = {
      guidOperacion: this.operacionId,
      guidRecibo: recibo
    }
    this.cobranzaService.nuevoPago(request)
      .subscribe({
        next: () => {
          this.getConciliacion();
          this.onPrint(recibo)
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
        }
      });
  }

  onImputarAlone(recibo: string) {
    const request: RequestDto = {
      guidOperacion: null,
      guidRecibo: recibo
    }
    this.cobranzaService.imputarAlone(request)
      .subscribe({
        next: () => {
          this.getConciliacion();
          this.messageService.add({ severity: 'success', summary: 'Correcto', detail: "Recibo Imputado" });
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
        }
      });
  }

  onPrint(recibo: string) {
    this.cobranzaService.imprimirRecibo(recibo)
      .subscribe(x => {
        const fileURL = URL.createObjectURL(x);
        window.open(fileURL, '_blank');
      })
  }
}

