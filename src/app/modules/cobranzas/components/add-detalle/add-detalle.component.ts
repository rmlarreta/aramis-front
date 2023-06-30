import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CobranzasService } from '../../cobranzas.service';
import { CobReciboDetallesInsert } from '../../dtos/cobReciboDetallesInsert.interface';
import { CobTipoPagoDto } from '../../dtos/cobTipoPagoDto.interface';
import { PosDto } from '../../dtos/posDto.interface';

@Component({
  selector: 'app-add-detalle',
  templateUrl: './add-detalle.component.html',
  styleUrls: ['./add-detalle.component.css']
})
export class AddDetalleComponent implements OnInit {
  visible: boolean = false;
  tipoPagosOption: CobTipoPagoDto[] = [];
  posOption: PosDto[] = [];
  editForm!: FormGroup;
  submitted = false;
  maxmonto: number = 0;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private cobranzasService: CobranzasService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      monto: [0, [Validators.required, Validators.min(0), Validators.max(this.maxmonto)]],
      tipo: [null, Validators.required], // Descripción al menos 4 caracteres
      observacion: ['', Validators.required],
      posId: [null]
    });

    // Suscribirse a los cambios del campo de tipo
    this.editForm.get('tipo')!.valueChanges
      .subscribe(tipoId => {
        const tipoOption = this.tipoPagosOption.find(option => option.id === tipoId);
        if (tipoOption) {
          // Establecer el valor del campo de observación según la opción seleccionada
          this.editForm.get('observacion')!.setValue(tipoOption.name);
          if (tipoOption.name === 'MERCADO PAGO') {
            this.editForm.get('posId')!.setValidators(Validators.required);
          } else {
            this.editForm.get('posId')!.clearValidators();
          }
          this.editForm.get('posId')!.updateValueAndValidity();
        }
      });
  }

  get f() {
    return this.editForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.editForm.invalid) {
      this.submitted = false;
      return;
    }
    const formValues = this.editForm.value;
    if (formValues.monto <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "El monto debe ser mayor a 0" });
      this.submitted = false;
      return;
    }
    const detalle: CobReciboDetallesInsert = {
      id: null,
      reciboId: null,
      monto: formValues.monto,
      tipo: formValues.tipo,
      observacion: formValues.observacion,
      posId: formValues.posId,
      codAut: null,
      cancelado: null
    };
    this.cobranzasService.setnuevoDetalle$(detalle);
    this.hideDialog();
  }

  hideDialog() {
    this.submitted = false;
    this.visible = false;
  }
}
