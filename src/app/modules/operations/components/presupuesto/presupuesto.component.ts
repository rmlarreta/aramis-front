import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription, map, tap } from 'rxjs';
import { ClientesService } from 'src/app/modules/clientes/clientes.service';
import { ListadoClientesComponent } from 'src/app/modules/clientes/components/listado/listadoClientes.component';
import { OpCustomerDto } from 'src/app/modules/clientes/dtos/opCustomerDto.interface';
import { CobranzasService } from 'src/app/modules/cobranzas/cobranzas.service';
import { ReciboComponent } from 'src/app/modules/cobranzas/components/recibo/recibo.component';
import { ListadoProductosComponent } from 'src/app/modules/productos/components/listado/listadoProductos.component';
import { ProductoSummaryDto } from 'src/app/modules/productos/dtos/productoSummaryDto.interface';
import { ProductosService } from 'src/app/modules/productos/productos.service';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { BusOperacionDetalleDto } from '../../dtos/busOperacionDetalleDto.interface';
import { BusOperacionDetalleSumaryDto } from '../../dtos/busOperacionDetalleSummaryDto.interface';
import { BusOperacionInsert } from '../../dtos/busOperacionInsert.interface';
import { BusOperacionSumaryDto } from '../../dtos/busOperacionSummaryDto.interface';
import { RequestDto } from '../../dtos/requestDto.interface';
import { OperationsService } from '../../operations.service';

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  styleUrls: ['./presupuesto.component.css']
})

export class PresupuestoComponent implements OnInit {
  operacion: BusOperacionSumaryDto = {
    total: 0,
    totalLetras: null,
    totalInternos: null,
    totalNeto: null,
    totalIva: null,
    totalIva10: null,
    totalIva21: null,
    totalExento: null,
    detalles: [],
    observaciones: [],
    cui: null,
    resp: null,
    domicilio: null,
    tipoDocName: null,
    estadoName: null,
    id: '',
    clienteId: '',
    fecha: '',
    vence: '',
    razon: '',
    codAut: null,
    tipoDocId: '',
    estadoId: '',
    pos: 0,
    operador: '',
    numero: 0
  };
  operacionId!: string;
  editedRow: { [s: string]: BusOperacionDetalleSumaryDto; } = {};
  selectedDetalles: BusOperacionDetalleSumaryDto[] = [];

  @ViewChild('addDetallesContainer', { read: ViewContainerRef }) addDetallesContainer!: ViewContainerRef;
  addDetalles!: ComponentRef<ListadoProductosComponent>;
  visibleProductos: boolean = false;
  private productosSeleccionadosSubscription!: Subscription;

  @ViewChild('listadoClientesContainer', { read: ViewContainerRef }) listadoClientesContainer!: ViewContainerRef;
  changeCliente!: ComponentRef<ListadoClientesComponent>;
  visibleClientes: boolean = false;
  private clienteSeleccionadoSubscription!: Subscription;

  @ViewChild('recibosContainer', { read: ViewContainerRef }) recibosContainer!: ViewContainerRef;
  recibo!: ComponentRef<ReciboComponent>;
  visibleRecibo: boolean = false;
  private reciboUpdateSubscription!: Subscription;

  private remitoUpdateSubscription!: Subscription;
  constructor(
    private route: ActivatedRoute,
    private operationsService: OperationsService,
    private clientesService: ClientesService,
    private productoService: ProductosService,
    private cobranzaService: CobranzasService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.operacionId = params.get('id')!;
    });
    this.operacionId ? this.getOperacion() : this.nuevaOperacion();

    this.productosSeleccionadosSubscription = this.productoService.getProductosSeleccionadosSubject()
      .subscribe(productosSeleccionados => {
        this.visibleProductos = false;
        if (productosSeleccionados.length > 0)
          this.insertDetalles(productosSeleccionados);
      });

    this.clienteSeleccionadoSubscription = this.clientesService.getClienteSeleccionadoSubject()
      .subscribe(clienteSeleccionado => {
        this.visibleClientes = false;
        if (clienteSeleccionado !== null) {
          this.updateClienteDelRemito(clienteSeleccionado);
        }
      });

    this.reciboUpdateSubscription = this.cobranzaService.nuevaCobranza$
      .subscribe(recibo => {
        this.visibleRecibo = false;
        if (recibo !== null) {
          this.onEmitirRemito(recibo);
        }
      });

    this.remitoUpdateSubscription = this.operationsService.nuevoremito$
      .subscribe(remito => {
        if (remito != null) {
          this.onPrintRemito(remito.id);
        }
      });
  }

  ngOnDestroy() {
    this.clientesService.setClienteSeleccionado(null);
    this.productoService.setProductosSeleccionados([]);
    this.operationsService.setnuevoremito$(null);
    this.productosSeleccionadosSubscription.unsubscribe();
    this.clienteSeleccionadoSubscription.unsubscribe();
    this.reciboUpdateSubscription.unsubscribe();
    this.remitoUpdateSubscription.unsubscribe();
  }

  nuevaOperacion(): void {
    this.operationsService.nuevoPresupuesto()
      .pipe(
        tap((response: DataResponse<BusOperacionSumaryDto>) => {
          if (response.errorResponse !== null) {
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
          }
        }),
        map((response: DataResponse<BusOperacionSumaryDto>) => response.data || null)
      )
      .subscribe({
        next: (response: BusOperacionSumaryDto | null) => {
          if (response) {
            this.operacion = response;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se cargó el documento' });
          }
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
        }
      });
  }

  getOperacion(): void {
    this.operationsService.getPresupuestoById(this.operacionId)
      .pipe(
        tap((response: DataResponse<BusOperacionSumaryDto>) => {
          if (response.errorResponse !== null) {
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
          }
        }),
        map((response: DataResponse<BusOperacionSumaryDto>) => response.data || null)
      )
      .subscribe({
        next: (response: BusOperacionSumaryDto | null) => {
          if (response) {
            this.operacion = response;
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se cargó el documento' });
          }
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
        }
      });
  }

  onRowEditInit(detalle: BusOperacionDetalleSumaryDto) {
    this.editedRow[detalle.id!] = { ...detalle };
  }

  onRowEditSave(detalle: BusOperacionDetalleSumaryDto, index: number) {
    if (detalle.cantidad! > 0 && detalle.unitario! > 0) {
      this.operationsService.updateDetallePresupuesto(detalle)
        .subscribe({
          next: () => {
            this.productoService.setProductosSeleccionados([]);
            this.getOperacion();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
          }
        });
    }
    else {
      this.onRowEditCancel(detalle, index);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cantidad y Precio, deben ser mayores a 0' });
    }
  }

  onRowEditCancel(detalle: BusOperacionDetalleSumaryDto, index: number) {
    this.operacion.detalles[index] = this.editedRow[detalle.id!];
    delete this.editedRow[detalle.id!];
  }

  openDetallesAdd() {
    this.addDetallesContainer.clear();
    this.addDetalles = this.addDetallesContainer.createComponent(ListadoProductosComponent);
    this.addDetalles.instance.presupuestando = true;
    this.visibleProductos = true;
  }

  insertDetalles(listado: ProductoSummaryDto[]) {
    const detalles: BusOperacionDetalleDto[] = [];
    listado.forEach((producto) => {
      const detalle: BusOperacionDetalleDto = {
        productoId: producto.id!,
        cantidad: 1,
        codigo: producto.plu,
        id: null,
        operacionId: this.operacion.id,
        detalle: producto.descripcion,
        rubro: producto.rubro,
        unitario: producto.unitario,
        ivaValue: null,
        internos: producto.internos,
        facturado: 0
      };
      detalles.push(detalle);
    });

    this.operationsService.insertDetallesPresupuesto(detalles)
      .subscribe({
        next: () => {
          this.productoService.setProductosSeleccionados([]);
          this.getOperacion();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.errorResponse.message });
        }
      });
  }

  deleteDetalle(guid: string) {
    this.operationsService.deleteDetallePresupuesto(guid)
      .subscribe({
        next: () => {
          this.productoService.setProductosSeleccionados([]);
          this.getOperacion();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.errorResponse.message });
        }
      });
  }

  openListadoClientes() {
    this.listadoClientesContainer.clear();
    this.changeCliente = this.listadoClientesContainer.createComponent(ListadoClientesComponent);
    this.changeCliente.instance.presupuestando = true;
    this.visibleClientes = true;
  }

  updateClienteDelRemito(cliente: OpCustomerDto) {
    const presupuesto: BusOperacionInsert = {
      id: this.operacion.id,
      clienteId: cliente.id!,
      fecha: this.operacion.fecha,
      vence: this.operacion.vence,
      razon: cliente.razon,
      codAut: this.operacion.codAut,
      tipoDocId: this.operacion.tipoDocId,
      estadoId: this.operacion.estadoId,
      pos: this.operacion.pos,
      operador: this.operacion.operador,
      numero: this.operacion.numero
    }
    this.operationsService.updatePresupuesto(presupuesto)
      .subscribe({
        next: () => {
          this.clientesService.setClienteSeleccionado(null);
          this.getOperacion();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
        }
      });
  }

  onPrint() {
    this.operationsService.imprimirPresupuesto(this.operacion.id)
      .subscribe(x => {
        const fileURL = URL.createObjectURL(x);
        window.open(fileURL, '_blank');
      })
  }

  onPrintRemito(remito: string) {
    this.operationsService.imprimirRemito(remito)
      .subscribe(x => {
        const fileURL = URL.createObjectURL(x);
        window.open(fileURL, '_blank');
        this.router.navigate(['operations']);
      })
  }

  openPay() {
    if (this.operacion.total === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "No hay nada para cobrar" });
    }
    this.confirmationService.confirm({
      message: '¿Comienza cobranza del documento?',
      accept: () => {
        this.recibosContainer.clear();
        this.recibo = this.recibosContainer.createComponent(ReciboComponent);
        this.recibo.instance.nroOperacion = this.operacion.id;
        this.recibo.instance.montoMax = this.operacion.total;
        this.recibo.instance.pendiente = this.operacion.total;
        this.recibo.instance.presupuestando = true;
        this.recibo.instance.recibo.operacion = this.operacionId;
        this.recibo.instance.recibo.clienteId = this.operacion.clienteId;
        this.recibo.instance.razon = this.operacion.razon;
        this.visibleRecibo = true;
      }
    });
  }

  onEmitirRemito(recibo: string) {
    const request: RequestDto = {
      guidOperacion: this.operacionId,
      guidRecibo: recibo
    }
    this.operationsService.nuevoRemito(request)
      .subscribe({
        next: (resp) => {
          this.operationsService.setnuevoremito$(resp.data!);
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
        }
      });
  }
}
