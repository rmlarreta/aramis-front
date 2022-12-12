import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { BusDetalleOperacionesInsert } from 'src/app/model/busDetallesOperacionesInsert.interface';
import { StockProductDto } from 'src/app/model/stockProductDto.interface';
import { StockService } from 'src/app/service/stock/stock.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit {

  products: StockProductDto[] = [];
  selectedProducts: StockProductDto[] = [];
  detalles: BusDetalleOperacionesInsert[] = [];

  loading = false;
  visible = false;
  operacion = '';
  operador ='';
  constructor(
    private stockService: StockService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.stockService.products.subscribe(x => this.products = x);
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
  }

  confirmar() { 
    this.selectedProducts.forEach(
      (sp) => {
        let det: BusDetalleOperacionesInsert = {
          cantidad: 1,
          detalle: sp.descripcion,
          operacionId: this.operacion,
          productoId: sp.id,
          codigo: sp.plu,
          rubro: sp.rubroName!,
          unitario: sp.unitario!,
          ivaValue: sp.ivaValue!,
          internos: sp.internos!,
          facturado: 0,
          operador: this.operador,
          id: ''
        }
        this.detalles.push(det);
      })
      console.log(this.detalles)
  }
} 
