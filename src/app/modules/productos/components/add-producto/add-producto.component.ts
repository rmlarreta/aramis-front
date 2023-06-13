import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { ProductoDto } from '../../dtos/productoDto.interface';
import { ProductosService } from '../../productos.service';

@Component({
  selector: 'app-add-producto',
  templateUrl: './add-producto.component.html',
  styleUrls: ['./add-producto.component.css']
})
export class AddProductoComponent {
  visible: boolean = false;
  rubroOptions: RubroDto[] = [];
  ivaOptions: IvaDto[] = [];
  editForm!: FormGroup;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductosService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      plu: [null, Validators.required],
      cantidad: [null, Validators.required],
      descripcion: [null, Validators.required],
      rubro: [null, Validators.required],
      iva: [null, Validators.required],
      neto: [null, Validators.required],
      internos: [null, Validators.required],
      tasa: [null, Validators.required],
      servicio: [false]
    });
    this.loadRubroOptions();
    this.loadIvaOptions();
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

    const producto: ProductoDto = {
      id: '',
      cantidad: formValues.cantidad,
      descripcion: formValues.descripcion,
      rubro: formValues.rubro,
      iva: formValues.iva,
      neto: formValues.neto,
      internos: formValues.internos,
      tasa: formValues.tasa,
      servicio: formValues.servicio,
      plu: formValues.plu
    };

    this.productoService.insertProducto(producto)
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Aviso', detail: 'Producto Creado' });
          this.hideDialog();
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Aviso', detail: error.errorResponse.message });
        }
      });
  }

  hideDialog() {
    this.submitted = false;
    this.editForm.reset();
    this.visible = false;
  }

  loadRubroOptions(): void {
    this.productoService.getRubros()
      .pipe(
        tap((response: DataResponse<RubroDto[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<RubroDto[]>) => response.data || [])
      )
      .subscribe({
        next: (rubros: RubroDto[]) => {
          this.rubroOptions = rubros;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      });
  }

  loadIvaOptions(): void {
    this.productoService.getIvas()
      .pipe(
        tap((response: DataResponse<IvaDto[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<IvaDto[]>) => response.data || [])
      )
      .subscribe({
        next: (ivas: IvaDto[]) => {
          this.ivaOptions = ivas;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      });
  }
}