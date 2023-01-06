import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { StockIvaDto } from 'src/app/model/stockIvaDto.interface';
import { StockProductDto } from 'src/app/model/stockProductDto.interface';
import { StockProductInsert } from 'src/app/model/stockProductInsert.interface';
import { StockRubroDto } from 'src/app/model/stockRubroDto.interface';
import { StockService } from 'src/app/service/stock/stock.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class MainComponent implements OnInit {

  listado: StockProductDto[] = [];
  loading = false;
  updating = false;
  first = 0;
  rows = 10;

  rubros: StockRubroDto[] = [];
  ivas: StockIvaDto[] = [];
  insert: StockProductInsert = {
    plu: '',
    cantidad: 0,
    descripcion: '',
    rubro: '',
    iva: '',
    neto: 0,
    internos: 0,
    tasa: 0,
    servicio: false,
    precio: 0
  };
  productDialog = false;
  submitted = false;

  constructor(
    private stockservice: StockService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.stockservice.products
      .subscribe(s => this.listado = s);

    this.stockservice.rubros
      .subscribe(r => this.rubros = r);

    this.stockservice.ivas
      .subscribe(i => this.ivas = i);
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.insert.plu = '',
      this.insert.cantidad = 0,
      this.insert.descripcion = '',
      this.insert.rubro = '',
      this.insert.iva = '',
      this.insert.neto = 0,
      this.insert.internos = 0,
      this.insert.tasa = 0,
      this.insert.servicio = false,
      this.insert.precio = 0
  }

  addProduct() {
    this.submitted = true;
    this.stockservice.productadd(this.insert)
      .subscribe({
        complete: () => {
          this.hideDialog()
          this.stockservice.products
            .subscribe(x => this.listado = x);
        }
      })
  }

  saveProduct() {
    this.submitted = true;
    this.updating = false;
    this.stockservice.productsave(this.insert)
      .subscribe({
        complete: () => {
          this.hideDialog()
          this.stockservice.products
            .subscribe(x => this.listado = x);
        }
      })
  }

  deleteProduct(product: StockProductDto) {
    this.confirmationService.confirm({
      message: 'Seguro de eliminar ' + product.descripcion + ' ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.stockservice.productdelete(product.id)
          .subscribe({
            complete: () => {
              this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Producto Eliminado', life: 3000 });
              this.stockservice.products
                .subscribe(p => this.listado = p);
            }
          })
      }
    });
  }

  onEdit(product: StockProductInsert) {
    this.insert = product;
    this.onCalculate();
    this.productDialog = true;
    this.updating = true;
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

  onCalculate(): void {
    let iva = (this.ivas.find(i => i.id === this.insert.iva)?.value) || 0;
    let final = (this.insert.neto * (1 + (iva / 100)) * (1 + (this.insert.tasa / 100))) + this.insert.internos;
    this.insert.precio = final;
  }

}
