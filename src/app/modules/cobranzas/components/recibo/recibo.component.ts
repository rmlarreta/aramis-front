import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription, map, tap } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { CobranzasService } from '../../cobranzas.service';
import { CobReciboInsert } from '../../dtos/cobReciboInsert.interface';
import { CobTipoPagoDto } from '../../dtos/cobTipoPagoDto.interface';
import { PosDto } from '../../dtos/posDto.interface';
import { AddDetalleComponent } from '../add-detalle/add-detalle.component';

@Component({
  selector: 'app-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.css']
})
export class ReciboComponent {
  visible: boolean = false;
  recibo: CobReciboInsert = {
    id: null,
    numero: null,
    clienteId: '',
    fecha: null,
    operador: null,
    detalles: [],
    operacion: null
  };
  cobrando = false;
  presupuestando = false;
  saldando = false;
  alone =false;
  tipoPagosOption: CobTipoPagoDto[] = [];
  posOption: PosDto[] = [];
  submitted = false;
  error = '';

  //Opcionales
  nroOperacion!: string | null;
  razon!: string | null;
  pendiente: number = 0;
  montoMax: number = 0;
  total: number = 0;

  @ViewChild('addDetallesContainer', { read: ViewContainerRef }) addDetallesContainer!: ViewContainerRef;
  addDetalles!: ComponentRef<AddDetalleComponent>;
  private detallesSubscription!: Subscription;

  constructor(
    private cobranzasService: CobranzasService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadTipoPagosOptions();
    this.loadPosOptions();
    this.detallesSubscription = this.cobranzasService.nuevoDetalle$
      .subscribe(detalle => {
        if (detalle !== null) {
          this.recibo.detalles!.push(detalle);
        }
        this.recalculate();
      });
  }

  ngOnDestroy() {
    this.detallesSubscription.unsubscribe();
    this.cobranzasService.setnuevoDetalle$(null);
  }

  loadTipoPagosOptions(): void {
    this.cobranzasService.getAllTipoPagos()
      .pipe(
        tap((response: DataResponse<CobTipoPagoDto[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<CobTipoPagoDto[]>) => response.data || [])
      )
      .subscribe({
        next: (tipos: CobTipoPagoDto[]) => {
          this.tipoPagosOption = tipos;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      });
  }

  loadPosOptions(): void {
    this.cobranzasService.getAllPos()
      .pipe(
        tap((response: DataResponse<PosDto[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<PosDto[]>) => response.data || [])
      )
      .subscribe({
        next: (pos: PosDto[]) => {
          this.posOption = pos;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      });
  }

  onDelete(registro: any): void {
    const indice = this.recibo.detalles!.indexOf(registro);
    if (indice !== -1) {
      this.recibo.detalles!.splice(indice, 1);
    }
    this.recalculate();
  }

  hideDialog() {
    this.recibo.detalles = [];
    this.cobranzasService.setnuevaCobranza$(null);
    this.submitted = false;
    this.visible = false;
  }

  onAddDetalles() {
    if (this.saldando || this.alone) {
      const index = this.tipoPagosOption.findIndex(opcion => opcion.name === "CUENTA CORRIENTE");
      if (index !== -1) {
        this.tipoPagosOption.splice(index, 1);
      }
    }
     
    this.addDetallesContainer.clear();
    this.addDetalles = this.addDetallesContainer.createComponent(AddDetalleComponent);
    this.addDetalles.instance.maxmonto = this.alone ? 1000000000000 : this.pendiente;
    this.addDetalles.instance.posOption = this.posOption;
    this.addDetalles.instance.tipoPagosOption = this.tipoPagosOption;
    this.addDetalles.instance.visible = true;
  }

  recalculate() {
    this.total = 0;
    this.recibo.detalles!.map(x => {
      this.total += x.monto
    });
    this.pendiente = this.montoMax - this.total
  }

  onSubmit() {
    if (this.total === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "No hay nada para cobrar" });
    }
    this.confirmationService.confirm({
      message: '¿Emite el recibo?',
      accept: () => { 
        this.cobrando = true;
        this.cobranzasService.nuevaCobranza(this.recibo)
          .subscribe({
            next: (x) => {
              this.cobranzasService.setnuevaCobranza$(x.data);
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
              this.cobrando = false;
            }
          });
      }
    });
  }
} 
