import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { map, tap } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { ProductoSummaryDto } from '../../dtos/productoSummaryDto.interface';
import { ProductosService } from '../../productos.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  visible: boolean = false;
  presupuestando: boolean = false;
  listado: ProductoSummaryDto[] = [];
  selected: ProductoSummaryDto[] = [];
  first = 0;
  rows = 10;

  constructor(
    private productoService: ProductosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.productoService.getAllProductos()
      .pipe(
        tap((response: DataResponse<ProductoSummaryDto[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<ProductoSummaryDto[]>) => response.data || [])
      )
      .subscribe({
        next: (data: ProductoSummaryDto[]) => {
          // Acciones completadas después de obtener los usuarios
          this.listado = data;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.errorResponse.message });
        }
      });
  }

  enviarSeleccionados() {
    this.productoService.setProductosSeleccionados(this.selected);
    this.visible = false;
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