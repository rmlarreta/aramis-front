import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BusDetalleOperacionesInsert } from 'src/app/model/busDetallesOperacionesInsert.interface';
import { StockProductDto } from 'src/app/model/stockProductDto.interface';
import { StockRubroDto } from 'src/app/model/stockRubroDto.interface';
import { OperacionesService } from 'src/app/service/operaciones/operaciones.service';
import { StockService } from 'src/app/service/stock/stock.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit {

  products: StockProductDto[] = [];
  listadoFt: StockProductDto[] = [];
  selectedProducts: StockProductDto[] = [];
  detalles: BusDetalleOperacionesInsert[] = [];

  rubros: StockRubroDto[] = [];
  rubroselected: string = '';

  loading = false;
  @Output() booleanEvent = new EventEmitter<boolean>()
  visible = false;
  operacion = '';
  operador = '';

  constructor(
    private stockService: StockService,
    private opService: OperacionesService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.stockService.products.subscribe(x => { this.products = x; this.listadoFt = x });
    this.stockService.rubros
      .subscribe(r => this.rubros = r);
    this.loading = false;
  }

  confirmar() {
    this.selectedProducts.forEach(
      (sp) => {
        let det: BusDetalleOperacionesInsert = {
          id: null,
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
          operador: this.operador
        }
        this.detalles.push(det);
      })
    if (this.detalles.length > 0) {
      this.opService.insertardetalle(this.detalles).subscribe(
        _x => this.booleanEvent.emit(true)
      )
    }
    this.selectedProducts = [];
    this.detalles = [];
    this.visible = false;
  }

  onChangeRubro() {
    this.listadoFt = this.products.filter(x => x.rubro === this.rubroselected);
  }
} 
