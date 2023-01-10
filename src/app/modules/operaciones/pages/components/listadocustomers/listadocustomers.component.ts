import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BusOperacionesInsert } from 'src/app/model/busOperacionesInsert.interfaces';
import { OpClienteDto } from 'src/app/model/opClientesDto.interface';
import { ClientesService } from 'src/app/service/clientes/clientes.service';
import { OperacionesService } from 'src/app/service/operaciones/operaciones.service';

@Component({
  selector: 'app-listadocustomers',
  templateUrl: './listadocustomers.component.html',
  styleUrls: ['./listadocustomers.component.scss']
})
export class ListadocustomersComponent implements OnInit {

  customers: OpClienteDto[] = [];
  operacion!: BusOperacionesInsert;
  loading = false;
  @Output() booleanEvent = new EventEmitter<boolean>()
  visible = false;

  constructor(
    private customerservice: ClientesService,
    private opService: OperacionesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.customerservice.clientes.subscribe(x => this.customers = x);
    this.loading = false;
  }

  confirmar(customerid: string) {
    let op: BusOperacionesInsert = {
      id: this.operacion.id,
      numero: this.operacion.numero,
      clienteId: customerid,
      fecha: this.operacion.fecha,
      vence: this.operacion.vence,
      razon: this.operacion.razon,
      codAut: this.operacion.codAut,
      tipoDocId: this.operacion.tipoDocId,
      estadoId: this.operacion.estadoId,
      pos: this.operacion.pos,
      operador: this.operacion.operador
    }
    this.opService.updateoperacion(op).subscribe({
      complete: () => this.booleanEvent.emit(true)
      , error: (error) => { this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Error', detail: error }); }
    }
    )
    this.visible = false;
  }
} 