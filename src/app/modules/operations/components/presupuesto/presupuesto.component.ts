import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription, map, tap } from 'rxjs';
import { ListadoComponent } from 'src/app/modules/productos/components/listado/listado.component';
import { ProductoSummaryDto } from 'src/app/modules/productos/dtos/productoSummaryDto.interface';
import { ProductosService } from 'src/app/modules/productos/productos.service';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { BusOperacionDetalleDto } from '../../dtos/busOperacionDetalleDto.interface';
import { BusOperacionDetalleSumaryDto } from '../../dtos/busOperacionDetalleSummaryDto.interface';
import { BusOperacionSumaryDto } from '../../dtos/busOperacionSummaryDto.interface';
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
  addDetalles!: ComponentRef<ListadoComponent>;
  visibleProductos: boolean = false;
  private productosSeleccionadosSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private operationsService: OperationsService,
    private productoService: ProductosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
  }

  ngOnDestroy() {
    this.productosSeleccionadosSubscription.unsubscribe();
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
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.errorResponse.message });
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
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.errorResponse.message });
        }
      });
  }

  onRowEditInit(detalle: BusOperacionDetalleSumaryDto) {
    this.editedRow[detalle.id!] = { ...detalle };
  }

  onRowEditSave(detalle: BusOperacionDetalleSumaryDto, index: number) {
    if (detalle.cantidad! > 0 && detalle.unitario! > 0) {
      let det: BusOperacionDetalleDto = {
        id: detalle.id,
        operacionId: detalle.operacionId,
        cantidad: detalle.cantidad,
        productoId: detalle.productoId,
        codigo: detalle.codigo,
        detalle: detalle.detalle,
        rubro: detalle.rubro,
        unitario: detalle.unitario,
        ivaValue: detalle.ivaValue,
        internos: detalle.internos,
        facturado: detalle.facturado
      }
      this.operationsService.updateDetallePresupuesto(detalle)
        .subscribe({
          next: () => {
            this.productoService.setProductosSeleccionados([]);
            this.getOperacion();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.errorResponse.message });
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
    this.addDetalles = this.addDetallesContainer.createComponent(ListadoComponent);
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
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.errorResponse.message });
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
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.errorResponse.message });
        }
      });
  }
}
