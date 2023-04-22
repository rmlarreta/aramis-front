import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { OpDocumentoProveedorDto } from 'src/app/model/OpDocumentoProveedorDto.interface';
import { BusOperacionTipo } from 'src/app/model/busOperacionTipo.interface';
import { OpClienteDto } from 'src/app/model/opClientesDto.interface';
import { OperacionesService } from 'src/app/service/operaciones/operaciones.service';
import { SuppliersService } from 'src/app/service/suppliers/suppliers.service';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private supplierService: SuppliersService,
    private opServive: OperacionesService,
    private messageService: MessageService,

  ) { }

  @Input() customers: OpClienteDto[] = [];
  tipoOperaciones: BusOperacionTipo[] = [];
  selectedCustomer: OpClienteDto = {
    id: null,
    cui: '',
    resp: '',
    respName: '',
    razon: '',
    razoncui: null,
    gender: '',
    genderName: '',
    domicilio: '',
    pais: null,
    paisName: '',
    contacto: null,
    mail: null
  }
  estado: string = '';
  submitted = false;
  visible = false;
  loading = false;
  error = '';
  addDocument!: FormGroup;
  document: OpDocumentoProveedorDto = {
    id: null,
    proveedorId: '',
    fecha: '',
    razon: '',
    tipoDocId: '',
    estadoId: null,
    pos: 0,
    numero: 0,
    monto: 0
  }
  ngOnInit(): void {
    this.addDocument = this.formBuilder.group({
      proveedorId: [null, Validators.required],
      tipoDocId: [null, [Validators.required]],
      fecha: [null, [Validators.required]],
      pos: [null, Validators.min(1)],
      numero: [null, Validators.min(1)],
      monto: [null, Validators.min(0.01)]
    });
    this.opServive.tipos.subscribe(x => {
      this.tipoOperaciones = x;
    });
  }

  get f() {
    return this.addDocument.controls;
  }

  public onSubmit() {
    this.loading = true;
    this.submitted = true;

    if (this.addDocument.invalid) {
      this.loading = false;
      return;
    }

    this.document.proveedorId = this.selectedCustomer.id || '',
      this.document.razon = this.selectedCustomer.razon,
      this.document.tipoDocId = this.f['tipoDocId'].value;
    this.document.estadoId = this.estado;
    this.document.pos = this.f['pos'].value;
    this.document.numero = this.f['numero'].value;
    this.document.monto = this.f['monto'].value;
    this.document.fecha = this.f['fecha'].value;
    this.error = '';
    this.loading = false;
    this.add();
  }

  add() {
    this.submitted = true;
    this.supplierService.InsertDocument(this.document).subscribe({
      complete: () => {
        this.hideDialog();
        this.messageService.add({
          severity: 'success',
          summary: 'Completado',
          detail: 'Se ha insertado el documento con éxito',
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
      },
    });
  }

  public razon() {
    this.document.razon = this.selectedCustomer.razon;
  }

  private hideDialog() {
    this.visible = false;
    this.document.id = null,
      this.document.proveedorId = '',
      this.document.fecha = '',
      this.document.razon = '',
      this.document.tipoDocId = '',
      this.document.estadoId = null,
      this.document.pos = 0,
      this.document.numero = 0,
      this.document.monto = 0
  }
}