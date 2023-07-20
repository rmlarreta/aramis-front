import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { map, tap } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { BusOperacionSumaryDto } from '../../dtos/busOperacionSummaryDto.interface';
import { OperationsService } from '../../operations.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})

export class OperationsComponent implements OnInit {
  listado: BusOperacionSumaryDto[] = [];
  selectedOperations: BusOperacionSumaryDto[] = [];
  first = 0;
  rows = 10;
  
  constructor(
    private operacionsService: OperationsService, 
    private messageService : MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getAllPresupuestos();
  }

  getAllPresupuestos(): void {
    this.operacionsService.getAllPresupuestos()
      .pipe(
        tap((response: DataResponse<BusOperacionSumaryDto[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<BusOperacionSumaryDto[]>) => response.data || [])
      )
      .subscribe({
        next: (operations: BusOperacionSumaryDto[]) => {
          this.listado = operations; 
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
        }
      });
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

  deleteDetallePresupuesto(guid: string) {
    this.operacionsService.deleteDetallePresupuesto(guid)
      .subscribe({
        next: () => {
          this.getAllPresupuestos();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
        }
      });
  }

  deletePresupuesto(guid: string) {
    this.operacionsService.deletePresupuesto(guid)
      .subscribe({
        next: () => {
          this.getAllPresupuestos();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
        }
      });
  }
}
