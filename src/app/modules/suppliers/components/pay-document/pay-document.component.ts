import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CobCuentum } from 'src/app/model/cobCuentum.interface';
import { OpDocumentoProveedorPago } from 'src/app/model/opDocumentoProveedorPagoDto.interface';
import { CuentasService } from 'src/app/service/cuentas/cuentas.service';
import { SuppliersService } from 'src/app/service/suppliers/suppliers.service';

@Component({
  selector: 'app-pay-document',
  templateUrl: './pay-document.component.html',
  styleUrls: ['./pay-document.component.css']
})
export class PayDocumentComponent implements OnInit {
  pago: OpDocumentoProveedorPago = {
    documento: null,
    cuenta: null,
    operador: null
  };
  cuentas: CobCuentum[] = [];
  cuentaSelected: CobCuentum = {
    id: '',
    name: '',
    saldo: 0
  };
  botonPago: boolean = false;
  @Output() pagado = new EventEmitter<boolean>();
  constructor(
    private cuentasService: CuentasService,
    private suppliersService: SuppliersService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cuentasService.cuentas
      .subscribe({
        next: x => {
          this.cuentas = x;
        }
      })
  }

  onChange(): void {
    // Capturar cambios en la variable local
    if (this.cuentaSelected && this.pago.documento) {
      if (this.cuentaSelected.saldo >= this.pago.documento.monto && this.cuentaSelected.name !== 'CUENTA CORRIENTE') {
        this.botonPago = true;
      } else { this.botonPago = false }
    }
  }

  onPay() {
    if (!this.cuentaSelected) {
      this.messageService.add({ severity: 'warn', summary: 'Error', detail: "Selecciona la cuenta!" });
      return;
    }
    if (this.cuentaSelected.name === 'CUENTA CORRIENTE') {
      this.messageService.add({ severity: 'warn', summary: 'Error', detail: "No puede Pagarse con " + this.cuentaSelected.name });
      return;
    }
    this.pago.cuenta = this.cuentaSelected.id;
    this.suppliersService.PagarDocumento(this.pago)
      .subscribe({
        complete: () => {
          this.pagado.emit(true);
          this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Pagado!', life: 3000 })
        }, error: (error) => { this.messageService.add({ severity: 'warn', summary: 'Error', detail: error }); }
      })
  }
}
