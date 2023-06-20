import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { ClientesService } from '../../clientes.service';
import { OpCustomerDto } from '../../dtos/opCustomerDto.interface';
import { OpCustomerInsert } from '../../dtos/opCustomerInsert.interface';
import { OpGenderDto } from '../../dtos/opGenderDto.interface';
import { OpPaisDto } from '../../dtos/opPais.interface';
import { OpRespDto } from '../../dtos/opRespDto.interface';

@Component({
  selector: 'app-add-cliente',
  templateUrl: './add-cliente.component.html',
  styleUrls: ['./add-cliente.component.css']
})
export class AddClienteComponent implements OnInit {
  visible: boolean = false;
  editForm!: FormGroup;
  cliente!: OpCustomerDto;
  gendersOptions: OpGenderDto[] = [];
  paisesOptions: OpPaisDto[] = [];
  respsOptions: OpRespDto[] = [];
  submitted = false;
  editing = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private clientesService: ClientesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      razon: [this.cliente?.razon, Validators.required],
      cui: [this.cliente?.cui, [Validators.required, Validators.minLength(11)]],
      domicilio: [this.cliente?.domicilio, Validators.required],
      resp: [this.cliente?.resp, Validators.required],
      gender: [this.cliente?.gender, Validators.required],
      pais: [this.cliente?.pais, Validators.required],
      mail: [this.cliente?.mail, Validators.email],
      contacto: [this.cliente?.contacto]
    });
    this.loadGendersOptions();
    this.loadPaisesOptions();
    this.loadRespsOptions();
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
    const cliente: OpCustomerInsert = {
      id: this.editing ? this.cliente.id : null,
      cui: formValues.cui,
      resp: formValues.resp,
      razon: formValues.razon,
      gender: formValues.gender,
      domicilio: formValues.domicilio,
      pais: formValues.pais,
      contacto: formValues.contacto,
      mail: formValues.mail,
    };
    if (this.editing) {
      this.clientesService.updateCliente(cliente)
        .subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Aviso', detail: 'Cliente Actualizado' });
            this.hideDialog();
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Aviso', detail: error.body.errorResponse.message });
            this.submitted = false;
          }
        });
    } else {
      this.clientesService.insertCliente(cliente)
        .subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Aviso', detail: 'CLiente Creado' });
            this.hideDialog();
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Aviso', detail: error.body.errorResponse.message });
            this.submitted = false;
          }
        });
    }
  }

  loadRespsOptions(): void {
    this.clientesService.getAllResps()
      .pipe(
        tap((response: DataResponse<OpRespDto[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<OpRespDto[]>) => response.data || [])
      )
      .subscribe({
        next: (data: OpRespDto[]) => {
          this.respsOptions = data;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      });
  }

  loadGendersOptions(): void {
    this.clientesService.getAllGenders()
      .pipe(
        tap((response: DataResponse<OpGenderDto[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<OpGenderDto[]>) => response.data || [])
      )
      .subscribe({
        next: (data: OpGenderDto[]) => {
          this.gendersOptions = data;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      });
  }

  loadPaisesOptions(): void {
    this.clientesService.GetAllPaises()
      .pipe(
        tap((response: DataResponse<OpPaisDto[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<OpPaisDto[]>) => response.data || [])
      )
      .subscribe({
        next: (data: OpPaisDto[]) => {
          this.paisesOptions = data;
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
