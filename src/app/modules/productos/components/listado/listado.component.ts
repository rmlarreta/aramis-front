import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { Subscription, map, tap } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { ProductoDto } from '../../dtos/productoDto.interface';
import { ProductoSummaryDto } from '../../dtos/productoSummaryDto.interface';
import { ProductosService } from '../../productos.service';
import { AddProductoComponent } from '../add-producto/add-producto.component';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  presupuestando: boolean = false;
  listado: ProductoSummaryDto[] = [];
  selected: ProductoSummaryDto[] = [];
  first = 0;
  rows = 10;

  @ViewChild('addProductoContainer', { read: ViewContainerRef }) addProductoContainer!: ViewContainerRef;
  addProducto!: ComponentRef<AddProductoComponent>;

  productoUpdateSubscription: Subscription = new Subscription;

  constructor(
    private productoService: ProductosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.productoUpdateSubscription = this.productoService._productosUpdated$
      .subscribe(() => {
        this.getAll()
      });

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
          this.listado = data;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.errorResponse.message });
        }
      });
  }

  deleteProducto(id: string): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este producto?',
      accept: () => {
        this.productoService.deleteProducto(id)
          .pipe(
            tap(() => {
              this.messageService.add({ severity: 'success', summary: 'Aviso', detail: "Producto Eliminado" });
            })
          )
          .subscribe({
            next: () => {
              this.getAll();
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.errorResponse.message });
            }
          });
      }
    });
  }

  enviarSeleccionados() {
    this.productoService.setProductosSeleccionados(this.selected);
  }

  // Otros métodos y propiedades del componente...
  openProductoAdd() {
    this.addProductoContainer.clear();
    this.addProducto = this.addProductoContainer.createComponent(AddProductoComponent);
    this.addProducto.instance.visible = true;
  }

  openProductoEdit(producto: ProductoDto) {
    this.addProductoContainer.clear();
    this.addProducto = this.addProductoContainer.createComponent(AddProductoComponent);
    this.addProducto.instance.visible = true;
    this.addProducto.instance.editing = true;
    this.addProducto.instance.producto = producto; // Pasar el producto a editar al componente hijo
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
