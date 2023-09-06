import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';
import { CobranzasService } from 'src/app/modules/cobranzas/cobranzas.service';
import { CobTipoPagoDto } from 'src/app/modules/cobranzas/dtos/cobTipoPagoDto.interface';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { OpPagoProveedor } from '../../dtos/opPagoProveedor.interface';
import { ProvidersService } from '../../providers.service';

@Component({
  selector: 'app-pay-document',
  templateUrl: './pay-document.component.html',
  styleUrls: ['./pay-document.component.css']
})
export class PayDocumentComponent {
  visible: boolean = false;
  editForm!: FormGroup;
  submitted = false;
  error = '';

  pago : OpPagoProveedor ={
    id: null,
    fecha: null,
    tipo: '',
    documento: '',
    operador: null
  };
  tipoPagosOption: CobTipoPagoDto[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private providersService: ProvidersService,
    private cobranzasService: CobranzasService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadTipoPagosOptions();
    this.editForm = this.formBuilder.group({
      tipoPago: [this.pago?.tipo, Validators.required], 
    });
  }

  get f() {
    return this.editForm.controls;
  }

  onSubmit() { 
    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    }

    const formValues = this.editForm.value; 
    this.pago.tipo =formValues.tipoPago; 
    console.log(this.pago)
      this.providersService.pago(this.pago)
        .subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Aviso', detail: 'Pago Realizado' });
            this.hideDialog();
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Aviso', detail: error.errorResponse.message });
          }
        }); 
  }

  loadTipoPagosOptions(): void {
    this.cobranzasService.getAllTipoPagos()
      .pipe(
        tap((response: DataResponse<CobTipoPagoDto[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<CobTipoPagoDto[]>) => response.data || [])
      )
      .subscribe({
        next: (tipos: CobTipoPagoDto[]) => {
          this.tipoPagosOption = tipos;
          const index = this.tipoPagosOption.findIndex(opcion => opcion.name === "CUENTA CORRIENTE");
          if (index !== -1) {
            this.tipoPagosOption.splice(index, 1);
          }
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      });
  }
  
  hideDialog() {
    this.submitted = false;
    this.editForm.reset();
    this.visible = false;
  }
}   
