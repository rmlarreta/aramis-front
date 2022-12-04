import { Component, OnInit } from '@angular/core';
import { BusEstadoDto } from 'src/app/model/busEstadosDto.interface';
import { BusOperacionesDto } from 'src/app/model/busOperacionesDto.interface';
import { BusOperacionesInsert } from 'src/app/model/busOperacionesInsert.interfaces';
import { BusOperacionTipo } from 'src/app/model/busOperacionTipo.interface';
import { OpClienteDto } from 'src/app/model/opClientesDto.interface';
import { StockProductDto } from 'src/app/model/stockProductDto.interface';
import { UserAuth } from 'src/app/model/userAuth.interface';
import { ClientesService } from 'src/app/service/clientes/clientes.service';
import { OperacionesService } from 'src/app/service/operaciones/operaciones.service';
import { AuthenticationService } from 'src/app/service/security/authentication.service';
import { StockService } from 'src/app/service/stock/stock.service';

@Component({
  selector: 'app-operacion',
  templateUrl: './operacion.component.html',
  styleUrls: ['./operacion.component.scss']
})

export class OperacionComponent implements OnInit {

  user?: UserAuth | null;
  cliente!: OpClienteDto;
  tipos!: BusOperacionTipo[] | [];
  estados!: BusEstadoDto[] | [];
  operacion!: BusOperacionesDto;
  products!: StockProductDto[] | [];
  draggedProduct!: StockProductDto | null;
  displaystock!: boolean;
  loading = false;

  constructor(
    private authenticationService: AuthenticationService,
    private operacionesService: OperacionesService,
    private customerService: ClientesService,
    private stockService: StockService
  ) {
    this.authenticationService.user.subscribe(x => this.user = x);
    this.operacionesService.tipos.subscribe(resp => this.tipos = resp);
    this.operacionesService.estados.subscribe(resp => this.estados = resp);
    this.stockService.products.subscribe(resp => this.products = resp);
  }

  ngOnInit() {
    this.nuevaoperacion('0');
  }

  nuevaoperacion(cui: string) {

    this.customerService.getbycui(cui).subscribe(x => {
      this.cliente = x;
      if (!this.cliente) return;
      let nop: BusOperacionesInsert = {
        clienteId: this.cliente.id,
        fecha: new Date(),
        vence: new Date(),
        razon: this.cliente.razon,
        codAut: null,
        tipoDocId: this.tipos.find(x => x.name === 'PRESUPUESTO')?.id!,
        estadoId: this.estados.find(x => x.name === 'ABIERTO')?.id!,
        pos: 0,
        operador: '',
        id: null,
        numero: null
      };
      this.operacionesService.nuevaoperacion(nop)
        .subscribe(x => { this.operacion = x });
      this.operacion.detalles = [];
      this.operacion.observaciones = [];
    })
  }

  showStock() {
    this.displaystock = true;
  }

  dragStart(product: StockProductDto) {
    this.draggedProduct = product;
  }

  drop() {
    if (this.draggedProduct) {
      let draggedProductIndex = this.findIndex(this.draggedProduct);
       
      this.products = this.products.filter((val: any, i: number) => i != draggedProductIndex);
      this.draggedProduct = null;
    }
  }

  dragEnd() {
    this.draggedProduct = null;
  }

  findIndex(product: StockProductDto) {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (product.id === this.products[i].id) {
        index = i;
        break;
      }
    }
    return index;
  }
}

