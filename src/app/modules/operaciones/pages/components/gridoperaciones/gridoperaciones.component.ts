import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SortEvent } from 'primeng/api';
import { BusOperacionesDto } from 'src/app/model/busOperacionesDto.interface';
import { OperacionesService } from 'src/app/service/operaciones/operaciones.service';
import { EstadosdropdownComponent } from '../estadodropdown/estadosdropdown.component';


@Component({
  selector: 'app-gridoperaciones',
  templateUrl: './gridoperaciones.component.html',
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ],
  providers: [MessageService]
})

export class GridoperacionesComponent implements OnInit {

  @ViewChild(EstadosdropdownComponent)
  childEstados!: EstadosdropdownComponent;

  operaciones: BusOperacionesDto[] = [];
  loading = false;
  first = 0;
  rows = 10; 
  
  constructor(
    private operacionesService: OperacionesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getoperaciones();
  }

  getoperaciones() {
    this.loading = true;
    this.operacionesService.presupuestos
      .subscribe(ops => {
        this.operaciones = ops;
      });
    this.loading = false;
  }

  getremitos() {
    this.loading = true;
    this.operacionesService.remitos
      .subscribe(ops => {
        this.operaciones = ops;
      });
    this.loading = false;
  }

  getordenes() {
    this.loading = true;
    this.childEstados.visible = true;
    this.loading = false;
  }

  deleteoperacion(id: string) {
    this.loading = true;
    this.operacionesService.deleteoperacion(id)
      .subscribe({
        complete: () => {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'ELiminando', detail: 'Documento Eliminado' });
          this.getoperaciones();
        },
        error: (error) => {
          this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: error });
        }
      }
      );
    this.loading = false;
  }

  deletedetalle(id: string) {
    this.loading = true;
    this.operacionesService.deletedetalle(id)
      .subscribe({
        complete: () => {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'ELiminando', detail: 'Item Eliminado' });
          this.getoperaciones();
        },
        error: (error) => { this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: error }); }
      });
    this.loading = false;
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
    return this.operaciones ? this.first === (this.operaciones.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.operaciones ? this.first === 0 : true;
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

  getbyTipo(stringEvent: any) {
    switch (stringEvent) {
      case "PRESUPUESTO": this.getoperaciones();
        break;
      case "REMITO": this.getremitos();
        break;
      case "ORDEN": this.getordenes();
    }
  }

  getbyEstado(stringEvent: any) {
    this.childEstados.visible = false;
    this.operacionesService.ordenesbyestado(stringEvent)
      .subscribe(ops => {
        this.operaciones = ops;
      });

  }
}