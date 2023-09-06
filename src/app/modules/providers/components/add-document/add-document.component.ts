import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription, map, tap } from 'rxjs';
import { ClientesService } from 'src/app/modules/clientes/clientes.service';
import { ListadoClientesComponent } from 'src/app/modules/clientes/components/listado/listadoClientes.component';
import { OpCustomerDto } from 'src/app/modules/clientes/dtos/opCustomerDto.interface';
import { TipoOperacionDto } from 'src/app/modules/operations/dtos/tipoOperacionDto.interface';
import { OperationsService } from 'src/app/modules/operations/operations.service';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { OpDocumentoProveedorDto } from '../../dtos/opDocumentoProveedorDto.interface';
import { ProvidersService } from '../../providers.service';
import { OpDocumentoProveedorInsert } from '../../dtos/opDocumentoProveedorInsert.interface';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit {
  visible: boolean = false;
  documento!: OpDocumentoProveedorDto;
  proveedor!: OpCustomerDto; 
  tipoOptions: TipoOperacionDto[] = [];
  editForm!: FormGroup;
  razonControl!: FormControl;
  submitted = false;
  editing = false;
  error = '';

  @ViewChild('listadoClientesContainer', { read: ViewContainerRef }) listadoClientesContainer!: ViewContainerRef;
  changeCliente!: ComponentRef<ListadoClientesComponent>;
  visibleClientes: boolean = false;
  private clienteSeleccionadoSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private providerService: ProvidersService,
    private operacionesService: OperationsService,
    private clientesService: ClientesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.razonControl = new FormControl();
    this.editForm = this.formBuilder.group({
      pos: [this.documento?.pos, [Validators.required, Validators.min(0)]],
      numero: [this.documento?.numero, [Validators.required, Validators.min(1)]],
      fecha: [this.documento?.fecha, Validators.required],
      tipoDoc: [this.documento?.tipoDoc.id, Validators.required],
      monto: [this.documento?.monto || 0, [Validators.required, Validators.min(0)]],
      razon: this.documento ? [this.documento?.razon, [Validators.required]] : this.razonControl
    });
    this.getAllTipos();

    this.clienteSeleccionadoSubscription = this.clientesService.getClienteSeleccionadoSubject()
      .subscribe(clienteSeleccionado => {
        this.visibleClientes = false;
        if (clienteSeleccionado !== null) {
          this.updateCliente(clienteSeleccionado);
        }
      });
  }

  ngOnDestroy() {
    this.clienteSeleccionadoSubscription.unsubscribe();
  }

  get f() {
    return this.editForm.controls;
  }

  hideDialog() { 
    this.submitted = false;
    this.editForm.reset();
    this.visible = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    }

    const formValues = this.editForm.value;
    const documento: OpDocumentoProveedorInsert = {
      id: this.editing ? this.documento.id : null,
      fecha: formValues.fecha,
      razon: formValues.razon,
      pos: formValues.pos,
      numero: formValues.numero,
      monto: formValues.monto,
      estadoId: null,
      proveedorId: this.proveedor.id!,
      tipoDocId: formValues.tipoDoc
    };
    if (this.editing) {

    } else {
      this.providerService.insertDocumento(documento)
        .subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Aviso', detail: 'Documento Creado' });
            this.hideDialog();
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Aviso', detail: error.errorResponse.message });
          }
        });
    }
    this.hideDialog();
  }


  openListadoClientes() {
    this.listadoClientesContainer.clear();
    this.changeCliente = this.listadoClientesContainer.createComponent(ListadoClientesComponent);
    this.changeCliente.instance.presupuestando = true;
    this.visibleClientes = true;
  }

  updateCliente(cliente: OpCustomerDto) {

    this.proveedor = cliente;
    this.razonControl.setValue(cliente.razon);
    this.clientesService.setClienteSeleccionado(null);
  }

  getAllTipos() {
    this.operacionesService.getAllTipos()
      .pipe(
        tap((response: DataResponse<TipoOperacionDto[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<TipoOperacionDto[]>) => response.data || [])
      )
      .subscribe({
        next: (data: TipoOperacionDto[]) => {
          this.tipoOptions = data;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.errorResponse.message });
        }
      });
  }
}
