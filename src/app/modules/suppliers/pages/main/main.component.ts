import { Component, OnInit, ViewChild } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { OpDocumentoProveedorDto } from 'src/app/model/OpDocumentoProveedorDto.interface';
import { BusEstadoDto } from 'src/app/model/busEstadosDto.interface';
import { OpClienteDto } from 'src/app/model/opClientesDto.interface';
import { ClientesService } from 'src/app/service/clientes/clientes.service';
import { OperacionesService } from 'src/app/service/operaciones/operaciones.service';
import { SuppliersService } from 'src/app/service/suppliers/suppliers.service';
import { AddDocumentComponent } from '../../components/add-document/add-document.component';
import { PayDocumentComponent } from '../../components/pay-document/pay-document.component';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild(AddDocumentComponent)
  childAddDocument!: AddDocumentComponent;
  @ViewChild(PayDocumentComponent)
  childPayDocument!: PayDocumentComponent;
  pagando: boolean = false;
  listado: OpDocumentoProveedorDto[] = [];
  customers: OpClienteDto[] = [];
  estados: BusEstadoDto[] = [];
  estadoselected: BusEstadoDto = {
    id: '',
    name: ''
  };
  first = 0;
  rows = 10;
  addDocument = false;
  constructor(
    private estadoService: OperacionesService,
    private supplierService: SuppliersService,
    private customerService: ClientesService
  ) { }

  ngOnInit(): void {
    this.estadoService.estados.subscribe(
      {
        next: x => {
          this.estados = x;
          this.estados = this.estados.filter(x => x.name === 'PAGADO' || x.name === 'ABIERTO');
          this.estadoselected.id = this.estados.find(x => x.name === 'ABIERTO')?.id || '';
          this.estadoselected.name = this.estados.find(x => x.name === 'ABIERTO')?.name || '';
          this.onChangeEstado();
        }
      }
    );

    this.customerService.clientes.subscribe({
      next: x => {
        this.customers = x;
        this.customers.forEach(x => {
          x.razoncui = x.razon + ' (' + x.cui + ')'
        })
      }
    })

    this.supplierService.newdocumentsuccess.subscribe({
      next: x => {
        if (x) {
          this.onChangeEstado();
        }
      }
    }
    )
  }

  onAddDocument() {
    this.addDocument = !this.addDocument;
    this.childAddDocument.visible = this.addDocument;
    this.childAddDocument.estado = this.estados.find(x => x.name === 'ABIERTO')?.id.toString() || '';
  }

  onChangeEstado() {
    this.estadoselected.name = this.estados.find(x => x.id === this.estadoselected.id)?.name || '';
    this.supplierService.documentByEstado(this.estadoselected.id).subscribe(
      {
        next: x => {
          this.listado = x;
        }
      }
    )
  }

  onPayDocument(documento: OpDocumentoProveedorDto) {
    this.pagando = true;
    this.childPayDocument.pago.documento = documento;
    this.supplierService.newdocumentsuccess.subscribe({
      next: x => {
        if (x) {
          this.onChangeEstado();
        }
      }
    }
    )
  }

  pagado(pagado: boolean) {
    this.pagando = !pagado;

  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.listado ? this.first === (this.listado.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.listado ? this.first === 0 : true;
  }

  customSort(event: SortEvent) {
    event.data!.sort((data1, data2) => {
      const value1 = data1[event.field!];
      let value2 = data2[event.field!];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order! * result);
    });
  }
}
