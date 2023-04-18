import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { BusEstadoDto } from 'src/app/model/busEstadosDto.interface';
import { OpClienteDto } from 'src/app/model/opClientesDto.interface';
import { OpDocumentoProveedorDto } from 'src/app/model/OpDocumentoProveedorDto.interface';
import { ClientesService } from 'src/app/service/clientes/clientes.service';
import { OperacionesService } from 'src/app/service/operaciones/operaciones.service';
import { SuppliersService } from 'src/app/service/suppliers/suppliers.service';
import { AddDocumentComponent } from '../../components/add-document/add-document.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild(AddDocumentComponent)
  childAddDocument!: AddDocumentComponent;
  listado: OpDocumentoProveedorDto[] = [];
  customers: OpClienteDto[] = [];
  estados: BusEstadoDto[] = [];
  estadoselected: string = '';
  first = 0;
  rows = 10;
  addDocument = false;
  constructor(
    private estadoService: OperacionesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private supplierService: SuppliersService,
    private customerService: ClientesService
  ) { }

  ngOnInit(): void {
    this.estadoService.estados.subscribe(
      {
        next: x => {
          this.estados = x;
          this.estados = this.estados.filter(x => x.name === 'PAGADO' || x.name === 'ABIERTO');
          this.estadoselected = this.estados.find(x => x.name === 'ABIERTO')?.id.toString() || '';
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
  }

  onAddDocument() {
    this.addDocument = !this.addDocument;
    this.childAddDocument.visible = this.addDocument;
    this.childAddDocument.estado = this.estados.find(x => x.name === 'ABIERTO')?.id.toString() || '';
  }

  onChangeEstado() {
    this.supplierService.documentByEstado(this.estadoselected).subscribe(
      {
        next: x => {
          this.listado = x;
        }
      }
    )
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
