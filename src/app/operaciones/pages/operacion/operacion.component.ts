import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BusDetallesOperacionesDto } from 'src/app/model/busDetallesOperacionesDto.interface';
import { BusDetalleOperacionesInsert } from 'src/app/model/busDetallesOperacionesInsert.interface';
import { BusOperacionesDto } from 'src/app/model/busOperacionesDto.interface';
import { CobroComponent } from 'src/app/pagos/components/cobro/cobro.component';
import { OperacionesService } from 'src/app/service/operaciones/operaciones.service';
import { ListadocustomersComponent } from '../components/listadocustomers/listadocustomers.component';
import { ListadoComponent } from '../components/listadostock/listado.component';

@Component({
  selector: 'app-operacion',
  templateUrl: './operacion.component.html',
  providers: [MessageService]
})

export class OperacionComponent implements OnInit {
  @ViewChild(ListadocustomersComponent)
  childCus!: ListadocustomersComponent

  @ViewChild(CobroComponent)
  childCob!: CobroComponent

  @ViewChild(ListadoComponent)
  child!: ListadoComponent
  operacion!: BusOperacionesDto;
  loading: boolean = false;
  actualizar: boolean = false;
  id: string = '0';
  editedRow: { [s: string]: BusDetallesOperacionesDto; } = {}; 

  constructor(
    private opservice: OperacionesService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id')!;
    })
    if (this.id === '0') {
      this.nuevaOperacion()
    } else {
      this.getoperacion(this.id);
    }
  }

  nuevaOperacion() {
    this.loading = true;
    this.opservice.nuevaoperacion.subscribe(x => {
      this.operacion = x,
        this.child.operacion = x.id,
        this.child.operador = x.operador,
        this.childCus.operacion = x
    })
    this.loading = false;
  }

  getoperacion(id: string) {
    this.loading = true;
    this.opservice.operacion(id).subscribe(x => {
      this.operacion = x,
        this.child.operacion = x.id,
        this.child.operador = x.operador,
        this.childCus.operacion = x 
    })
    this.loading = false;
  }

  actualizaroperacion() {
    this.loading = true;
    this.opservice.operacion(this.operacion.id).subscribe(x => {
      this.operacion = x,
        this.child.operacion = x.id,
        this.child.operador = x.operador,
        this.childCus.operacion = x 
    })
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
        operador: this.child.operador
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

  deletedetalle(id: string) {
    this.loading = true;
    this.opservice.deletedetalle(id)
      .subscribe(() => {
        this.messageService.add({severity: 'success', summary: 'ELiminando', detail: 'Item Eliminado' });
        this.actualizaroperacion();
      },
        error => { this.messageService.add({severity: 'warn', summary: 'Error', detail: error }); }
      )
    this.loading = false;
  }

  displaycobro(){ 
    this.childCob.operacion=this.operacion;
    this.childCob.pago.monto=this.operacion.total;
    this.childCob.visible=true;
  }
}

