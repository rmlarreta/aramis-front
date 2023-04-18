import { Component, OnInit } from '@angular/core';
import { CobCuentum } from 'src/app/model/cobCuentum.interface';
import { CuentasService } from 'src/app/service/cuentas/cuentas.service';
import { CobCuentaMovimientoDto } from 'src/app/model/cobCuentaMovimientoDto.interface';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit {

  cuentas: CobCuentum[] = [];
  movimientoCuentaDialog = false;
  submitted = false;
  error = '';
  //datos del form
  debitoOptions: any[] = [{ label: 'Ingreso', value: false }, { label: 'Retiro', value: true }];
  computaOptions: any[] = [{ label: 'Movimiento', value: false }, { label: 'Computa', value: true }];
  debito: boolean = false;
  movimiento: CobCuentaMovimientoDto = {
    id: '',
    cuenta: '',
    debito: false,
    computa: false,
    detalle: '',
    monto: 0,
    fecha: null,
    operador: null
  }


  constructor(
    private cuentasService: CuentasService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cuentasService.cuentas.subscribe(x => {
      this.cuentas = x;
    })
  }

  onShow(cuenta: string) {
    this.movimiento.cuenta = cuenta
    this.movimientoCuentaDialog = true;
  }

  hideDialog() {
    this.movimiento = {
      id: '',
      cuenta: '',
      debito: false,
      computa: false,
      detalle: '',
      monto: 0,
      fecha: null,
      operador: null
    };
    this.movimientoCuentaDialog = false;
  }
  onSubmit() { 
    this.cuentasService.cuenta.subscribe({
      next:(_cuenta)=>{ 
       this.cuentas = this.cuentas.filter(c=>c.id!==_cuenta.id);
        this.cuentas.push(_cuenta);
      }
    })
    this.cuentasService.movimiento(this.movimiento).subscribe(
      {
        complete: () => {
          this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'Movimiento ingresado correctamente' });
          this.hideDialog();
        }, error: (error) => { this.messageService.add({ severity: 'warn', summary: 'Error', detail: error }) }
      }
    )
  }
}
