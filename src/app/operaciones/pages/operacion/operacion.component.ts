import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { BusDetallesOperacionesDto } from 'src/app/model/busDetallesOperacionesDto.interface';
import { BusDetalleOperacionesInsert } from 'src/app/model/busDetallesOperacionesInsert.interface';
import { BusOperacionesDto } from 'src/app/model/busOperacionesDto.interface';
import { CobroComponent } from 'src/app/pagos/components/cobro/cobro.component';
import { OperacionesService } from 'src/app/service/operaciones/operaciones.service';
import { PagosService } from 'src/app/service/pagos/pagos.service';
import { ReportsService } from 'src/app/service/reports/reports.service';
import { ListadocustomersComponent } from '../components/listadocustomers/listadocustomers.component';
import { ListadoComponent } from '../components/listadostock/listado.component';

@Component({
  selector: 'app-operacion',
  templateUrl: './operacion.component.html',
  providers: [MessageService]
})

export class OperacionComponent implements OnInit {
  totalRemito = 0;
  @ViewChild(ListadocustomersComponent)
  childCus!: ListadocustomersComponent;

  @ViewChild(CobroComponent)
  childCob!: CobroComponent;

  @ViewChild(ListadoComponent)
  childProd!: ListadoComponent;

  operacion: BusOperacionesDto = {
    id: '',
    numero: null,
    clienteId: '',
    cui: null,
    resp: null,
    domicilio: null,
    fecha: null,
    vence: null,
    razon: '',
    codAut: null,
    tipoDocId: '',
    tipoDocName: null,
    estadoId: '',
    estadoName: null,
    pos: 0,
    operador: '',
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
    cuitEmpresa: '',
    razonEmpresa: '',
    domicilioEmpresa: '',
    fantasia: '',
    iibb: '',
    inicio: null,
    respoEmpresa: ''
  };

  loading: boolean = false;

  facturando: boolean = false;

  actualizar: boolean = false;

  editedRow: { [s: string]: BusDetallesOperacionesDto; } = {};

  afipresponse$: Observable<BusOperacionesDto>;
  constructor(
    private opservice: OperacionesService,
    private pagoservice: PagosService,
    private reportservice: ReportsService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.afipresponse$ = this.opservice.afip;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.operacion.id = params.get('id')!;
    });

    if (this.operacion.id === '0') {
      this.nuevaOperacion()
    }
    else {
      this.getoperacion(this.operacion.id);
    };
  }

  private nuevaOperacion() {
    this.loading = true;
    this.opservice.nuevaoperacion.subscribe(x => {
      this.operacion = x,
        this.childProd.operacion = x.id,
        this.childProd.operador = x.operador,
        this.childCus.operacion = x
    });
    this.loading = false;
  }

  private getoperacion(id: string) {
    this.loading = true;
    this.opservice.operacion(id).subscribe(x => {
      this.operacion = x,
        this.childProd.operacion = x.id,
        this.childProd.operador = x.operador,
        this.childCus.operacion = x,
        this.totalRemito = this.operacion.total;
    })
    this.loading = false;
  }

  actualizaroperacion() {
    this.loading = true;
    this.opservice.operacion(this.operacion.id).subscribe(x => {
      this.operacion = x,
        this.childProd.operacion = x.id,
        this.childProd.operador = x.operador,
        this.childCus.operacion = x,
        this.totalRemito = this.operacion.total;
    })
    this.loading = false;
  }

  deletedetalle(id: string) {
    this.loading = true;
    this.opservice.deletedetalle(id)
      .subscribe({
        complete: () => {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'ELiminando', detail: 'Item Eliminado' });
          this.actualizaroperacion();
        },
        error: (error) => { this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: error }); }
      });
    this.loading = false;
  }

  deletedetalleremito(detalle: BusDetallesOperacionesDto) {
    this.operacion.detalles = this.operacion.detalles.filter(val => val.id !== detalle.id);
    let total = 0;
    this.operacion.detalles.forEach(x => total += x.cantidad * x.unitario)
    this.operacion.total = total;
  }

  onRowEditInit(detalle: BusDetallesOperacionesDto) {
    this.editedRow[detalle.id!] = { ...detalle };
  }

  onRowEditSave(detalle: BusDetallesOperacionesDto) {
    if (detalle.cantidad! > 0 && detalle.unitario! > 0) {
      let det: BusDetalleOperacionesInsert = {
        id: detalle.id,
        cantidad: detalle.cantidad,
        detalle: detalle.detalle,
        operacionId: detalle.operacionId,
        productoId: detalle.productoId,
        codigo: detalle.codigo,
        rubro: detalle.rubro,
        unitario: detalle.unitario,
        ivaValue: detalle.ivaValue,
        internos: detalle.internos,
        facturado: detalle.facturado,
        operador: this.childProd.operador
      }
      this.opservice.updatedetalle(det).subscribe({
        next: (x) => {
          this.operacion = x
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Correcto', detail: 'Documento Actualizado' });
          delete this.editedRow[detalle.id!];
        },
        error: (error) => { this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: error }) }
      })
    }
    else {
      delete this.editedRow[detalle.id!];
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Cantidad y Precio, deben ser mayores a 0' });
      this.actualizaroperacion();
    }
  }

  onRowEditSaveRemito(detalle: BusDetallesOperacionesDto, index: number) {

    let total = 0;
    this.operacion.detalles.forEach(x => total += x.cantidad * x.unitario)
    total = total - this.operacion.detalles[index].cantidad * this.operacion.detalles[index].unitario;
    total = total + (detalle.cantidad * detalle.unitario);
    if (total > this.totalRemito) {
      this.onRowEditCancel(detalle, index);
      return;
    }
    if (detalle.cantidad <= 0) {
      this.onRowEditCancel(detalle, index);
      return;
    }
    delete this.editedRow[detalle.id];
    this.operacion.total = total;
    this.operacion.detalles.forEach(x => x.total = x.cantidad * x.unitario);
  }

  onRowEditCancel(detalle: BusDetallesOperacionesDto, index: number) {
    this.operacion.detalles[index] = this.editedRow[detalle.id!];
    delete this.editedRow[detalle.id];
  }

  displaycobro() {
    this.childCob.operacion = this.operacion;
    this.childCob.reciboDetalle.monto = this.operacion.total;
    this.childCob.recibo.clienteId = this.operacion.clienteId;
    this.childCob.visible = true;
    this.pagoservice.resetpagado = false;
    this.pagoservice.pagado
      .subscribe({
        next: (x) => { if (x) { this.nuevoremito(this.operacion.id) } }
        , error: (error) => { this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: error }); this.facturando = false; }
      });
  }

  private nuevoremito(op: string) {
    this.opservice.nuevoremito(op)
      .subscribe({
        complete: () => {
          this.reportservice.remito(op).subscribe(x => {
            const fileURL = URL.createObjectURL(x);
            window.open(fileURL, '_blank');
            this.router.navigate(['operaciones']);
          }
          );
        }
        , error: (error) => { this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: error }); this.facturando = false; }
      });
  }

  nuevaorden(id: string) {
    this.opservice.nuevaorden(id)
      .subscribe({
        next: (r) => { this.router.navigate(['operacion', r.id]) }
        , error: (error) => { this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: error }); this.facturando = false; }
      });
  }

  facturar() {
    this.facturando = true;
    this.opservice.facturar(this.operacion.detalles)
      .subscribe({
        next: (x) => console.log(x)
        , error: (error) => { this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: error }); this.facturando = false; }
      })
    this.afipresponse$
      .subscribe({
        next: (x) => { if (x.codAut !== null) { this.facturando = false; console.log(x) } }
        , error: (error) => { this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: error }); this.facturando = false; }
      });
  }

}

