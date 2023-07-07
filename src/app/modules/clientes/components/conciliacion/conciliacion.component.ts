import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClientesService } from '../../clientes.service';
import { CustomerConciliacion } from '../../dtos/conciliacion.interface';

@Component({
  selector: 'app-conciliacion',
  templateUrl: './conciliacion.component.html',
  styleUrls: ['./conciliacion.component.css']
})
export class ConciliacionComponent implements OnInit {
  visible = false;
  cliente!: string;
  conciliacion: CustomerConciliacion = {
    customer: null,
    operacionesImpagas: null,
    recibosNoImputados: null,
    debe: 0,
    haber: 0,
    balance: 0
  };
  constructor(
    private clientesService: ClientesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getConciliacion();
  }

  hideDialog() {
    this.visible = false;
  }

  getConciliacion(): void {
    this.clientesService.getConciliacion(this.cliente)
      .subscribe({
        next: (response) => {
          this.conciliacion = response.data
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
        }
      });
  }
}

