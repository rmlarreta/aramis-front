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
  listadoFt: StockProductDto[] = [];
  selectedProducts: StockProductDto[] = [];
  loading = false;
  updating = false;
  abmRubro = false;
  first = 0;
  rows = 10;

  rubros: StockRubroDto[] = [];
  rubroselected: string = '';
  ivas: StockIvaDto[] = [];
  inserts: StockProductInsert[] = [];
  insert: StockProductInsert = {
    id: null,
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
  remitoIn: number = 0;
  percent: number = 0;
  ingresaStockDialog = false;
  aumentaStockDialog = false;

  constructor(
    private stockservice: StockService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.stockservice.rubrosObservable
    .subscribe(r => this.rubros = r);

    this.stockservice.products
      .subscribe(s => { this.listado = s; this.listadoFt = s });

    this.stockservice.rubros
      .subscribe(r => this.rubros = r);

    this.stockservice.ivas
      .subscribe(i => this.ivas = i);
  }

  onChangeRubro() {
    this.listadoFt = this.listado.filter(x => x.rubro === this.rubroselected);
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.updating = false;
  }

  addProduct() {
    this.submitted = true;
    this.stockservice.productadd(this.insert)
      .subscribe({
        complete: () => {
          this.hideDialog()
          this.stockservice.products
            .subscribe(s => { this.listado = s; this.listadoFt = s });
        },
        error: (error) => { this.messageService.add({ severity: 'warn', summary: 'Error', detail: error }); }
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
            .subscribe(s => { this.listado = s; this.listadoFt = s });
        },
        error: (error) => { this.messageService.add({ severity: 'warn', summary: 'Error', detail: error }); }
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
            , error: (error) => { this.messageService.add({ severity: 'warn', summary: 'Error', detail: error }); }
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
    return this.listadoFt ? this.first === (this.listadoFt.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.listadoFt ? this.first === 0 : true;
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

  dialogRemito() {
    this.ingresaStockDialog = true;
  }

  ingresaStock() {
    this.selectedProducts.length > 0 ? this.updateRangeProducts() : this.ingresaStockDialog = false;
  }

  updateRangeProducts() {
    this.selectedProducts.forEach(x => {
      this.inserts.push({
        id: x.id,
        plu: x.plu,
        cantidad: x.cantidad + this.remitoIn,
        descripcion: x.descripcion,
        rubro: x.rubro,
        iva: x.iva,
        neto: x.neto,
        internos: x.internos,
        tasa: x.tasa,
        servicio: x.servicio,
        precio: x.unitario!
      })
    })
    this.stockservice.productssave(this.inserts)
      .subscribe(
        {
          complete: () => {
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Productos Actualizados', life: 3000 });
            this.stockservice.products
              .subscribe(s => { this.listado = s; this.listadoFt = s });
            this.ingresaStockDialog = false;
            this.selectedProducts = [];
            this.inserts = [];
            this.remitoIn = 0;
          },
          error: (error) => {
            this.messageService.add({ severity: 'warn', summary: 'Error', detail: error });
            this.ingresaStockDialog = false;
            this.selectedProducts = [];
            this.inserts = [];
            this.remitoIn = 0;
          }
        })
  }

  aumentaPrecioStock() {
    this.selectedProducts.forEach(x => {
      this.inserts.push({
        id: x.id,
        plu: x.plu,
        cantidad: x.cantidad,
        descripcion: x.descripcion,
        rubro: x.rubro,
        iva: x.iva,
        neto: x.neto * (1 + (this.percent / 100)),
        internos: x.internos,
        tasa: x.tasa,
        servicio: x.servicio,
        precio: x.unitario!
      })
    })
    this.stockservice.productssave(this.inserts)
      .subscribe(
        {
          complete: () => {
            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Productos Actualizados', life: 3000 });
            this.stockservice.products
              .subscribe(s => { this.listado = s; this.listadoFt = s });
            this.aumentaStockDialog = false;
            this.selectedProducts = [];
            this.inserts = [];
            this.percent = 0;
          },
          error: (error) => {
            this.messageService.add({ severity: 'warn', summary: 'Error', detail: error });
            this.aumentaStockDialog = false;
            this.selectedProducts = [];
            this.inserts = [];
            this.percent = 0;
          }
        })
  }
}
