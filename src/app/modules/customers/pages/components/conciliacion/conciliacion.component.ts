import { Component } from '@angular/core';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { ConciliacionCliente } from 'src/app/model/cobConciliacionCliente.interface';
import { ClientesService } from 'src/app/service/clientes/clientes.service';
import { ReportsService } from 'src/app/service/reports/reports.service';

@Component({
  selector: 'app-conciliacion',
  templateUrl: './conciliacion.component.html',
  styleUrls: ['./conciliacion.component.css']
})
export class ConciliacionComponent {

  visible = false;
  conciliacion: ConciliacionCliente = {
    operacionesImpagas: [],
    detallesCuentaCorriente: null,
    recibosSinImputar: [],
    debitos: null,
    creditos: null,
    saldoConciliado: null
  }
  constructor(
    private customerService: ClientesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private reportService: ReportsService
  ) { }

  public onCall(clienteId: string): void {
    this.customerService.conciliacion(clienteId)
      .subscribe({
        next: (c) => {
          this.conciliacion = c;
          this.visible = true;
          console.log(this.conciliacion)
        }
        , error: (error) => { this.messageService.add({ severity: 'error', summary: 'Error', detail: error }) }
      });
  }

  onHide() {
    this.visible = false;
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

  printremito(id: string) {
    this.reportService.remito(id)
      .subscribe({
        next: (x) => {
          const fileURL = URL.createObjectURL(x);
          window.open(fileURL, '_blank')
        }, error: (error) => { this.messageService.add({ severity: 'error', summary: 'Error', detail: error }) }
      })
  }

  printrecibo(id: string) {
    this.reportService.recibo(id)
      .subscribe({
        next: (x) => {
          const fileURL = URL.createObjectURL(x);
          window.open(fileURL, '_blank')
        }, error: (error) => { this.messageService.add({ severity: 'error', summary: 'Error', detail: error }) }
      })
  }

  imputarrecibo(id: string){
    this.confirmationService.confirm({
      message: 'Seguro de imputar este recibo ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.reportService.remito(id!)
          .subscribe({
            complete: () => {
              this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Cliente Eliminado', life: 3000 });
               
            }
            , error: (error) => { this.messageService.add({ severity: 'warn', summary: 'Error', detail: error }); }
          })
      }
    });
  }
}
