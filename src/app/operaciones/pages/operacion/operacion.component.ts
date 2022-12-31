import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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

  actualizar: boolean = false;

  editedRow: { [s: string]: BusDetallesOperacionesDto; } = {};

  constructor(
    private opservice: OperacionesService,
    private pagoservice: PagosService,
    private reportservice: ReportsService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

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
        this.childCus.operacion = x
    })
    this.loading = false;
  }

  actualizaroperacion() {
    this.loading = true;
    this.opservice.operacion(this.operacion.id).subscribe(x => {
      this.operacion = x,
        this.childProd.operacion = x.id,
        this.childProd.operador = x.operador,
        this.childCus.operacion = x
    })
    this.loading = false;
  }

  deletedetalle(id: string) {
    this.loading = true;
    this.opservice.deletedetalle(id)
      .subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'ELiminando', detail: 'Item Eliminado' });
        this.actualizaroperacion();
      },
        error => { this.messageService.add({ severity: 'warn', summary: 'Error', detail: error }); }
      )
    this.loading = false;
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
      this.opservice.updatedetalle(det).subscribe(x => {
        this.operacion = x
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Documento Actualizado' });
        delete this.editedRow[detalle.id!];
      })
    }
    else {
      delete this.editedRow[detalle.id!];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cantidad y Precio, deben ser mayores a 0' });
      this.actualizaroperacion();
    }
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
      .subscribe(x => {
        if (x) {
          this.nuevoremito(this.operacion.id);
        };
      });
  }

  private nuevoremito(op: string) {
    this.opservice.nuevoremito(op)
      .subscribe(r => {
        this.reportservice.remito(op).subscribe(
          x => {
            const fileURL = URL.createObjectURL(x);
            window.open(fileURL, '_blank');
            this.router.navigate(['operaciones']);
          }
        );
      });
  }

}

