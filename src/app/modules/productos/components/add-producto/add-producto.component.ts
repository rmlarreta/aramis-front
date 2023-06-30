import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription, map, tap } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { IvaDto } from '../../dtos/ivaDto.interface';
import { ProductoDto } from '../../dtos/productoDto.interface';
import { RubroDto } from '../../dtos/rubroDto.interface';
import { ProductosService } from '../../productos.service';
import { AddRubroComponent } from '../add-rubro/add-rubro.component';

@Component({
  selector: 'app-add-producto',
  templateUrl: './add-producto.component.html',
  styleUrls: ['./add-producto.component.css']
})
export class AddProductoComponent implements OnInit {
  visible: boolean = false;
  producto!: ProductoDto;
  rubroOptions: RubroDto[] = [];
  ivaOptions: IvaDto[] = [];
  editForm!: FormGroup;
  totalControl!: FormControl;
  submitted = false;
  editing = false;
  error = '';

  //Rubros
  @ViewChild('addRubroContainer', { read: ViewContainerRef }) addRubroContainer!: ViewContainerRef;
  addRubro!: ComponentRef<AddRubroComponent>;

  rubroUpdateSubscription: Subscription = new Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.totalControl = new FormControl(0);
    this.editForm = this.formBuilder.group({
      plu: [this.producto?.plu, [Validators.required, Validators.minLength(2)]], // Plu al menos 2 caracteres
      descripcion: [this.producto?.descripcion, [Validators.required, Validators.minLength(4)]], // Descripción al menos 4 caracteres
      rubro: [this.producto?.rubro, Validators.required],
      iva: [this.producto?.iva, Validators.required],
      neto: [this.producto?.neto || 0, [Validators.required, Validators.min(0)]], // Neto mayor a 0
      internos: [this.producto?.internos || 0, Validators.required],
      tasa: [this.producto?.tasa || 0, Validators.required],
      servicio: [this.producto?.servicio || false],
      total: this.totalControl
    });
    this.loadRubroOptions();
    this.loadIvaOptions();

    // Suscribirse a los eventos valueChange de los campos relevantes
    this.editForm.get('tasa')!.valueChanges.subscribe(() => {
      this.calcular();
    });

    this.editForm.get('iva')!.valueChanges.subscribe(() => {
      this.calcular();
    });

    this.editForm.get('internos')!.valueChanges.subscribe(() => {
      this.calcular();
    });

    this.editForm.get('neto')!.valueChanges.subscribe(() => {
      this.calcular();
    });

    this.rubroUpdateSubscription = this.productoService._rubrosUpdated$
      .subscribe(() => {
        this.loadRubroOptions()
      });
  }

  ngOnDestroy() { 
    this.rubroUpdateSubscription.unsubscribe();
  }

  calcular() {
    // Lógica de cálculo basada en los valores de tasa, iva, internos y neto 
    const tasa = this.editForm.get('tasa')?.value || 0;
    const selectedOption = this.ivaOptions.find(i => i.id === this.editForm.get('iva')?.value)?.value;
    const iva = selectedOption ? selectedOption : 0;
    const internos = this.editForm.get('internos')?.value || 0;
    const neto = this.editForm.get('neto')?.value || 0;

    // Realiza el cálculo necesario para obtener el nuevo valor del campo readOnly
    const totalValue = (neto * (1 + (iva / 100)) * (1 + (tasa / 100))) + internos;// Realiza tu cálculo aquí
    this.totalControl.setValue(totalValue.toFixed(2));
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
    const producto: ProductoDto = {
      id: this.editing ? this.producto.id : null,
      cantidad: this.editing ? this.producto.cantidad : 0,
      descripcion: formValues.descripcion,
      rubro: formValues.rubro,
      iva: formValues.iva,
      neto: formValues.neto,
      internos: formValues.internos,
      tasa: formValues.tasa,
      servicio: formValues.servicio,
      plu: formValues.plu
    };
    if (this.editing) {
      this.productoService.updateProducto(producto)
        .subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Aviso', detail: 'Producto Actualizado' });
            this.hideDialog();
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Aviso', detail: error.errorResponse.message });
          }
        });
    } else {
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
          if (this.editing) this.calcular();
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      });
  }

  openRubroAdd() {
    this.addRubroContainer.clear();
    this.addRubro = this.addRubroContainer.createComponent(AddRubroComponent);
    this.addRubro.instance.visible = true;
  }

  openRubroEdit() {
    const rubroId = this.editForm.get('rubro')?.value || 0;
    if (rubroId === 0) return;
    const selectedOption = this.rubroOptions.find(i => i.id === rubroId)?.name;

    const rubro: RubroDto = {
      id: rubroId,
      name: selectedOption!
    }
    this.addRubroContainer.clear();
    this.addRubro = this.addRubroContainer.createComponent(AddRubroComponent);
    this.addRubro.instance.editing = true;
    this.addRubro.instance.rubro = rubro; // Pasar el rubro a editar al componente hijo
    this.addRubro.instance.visible = true;
  }

  openRubroDelete() {
    const rubroId = this.editForm.get('rubro')?.value || 0;
    if (rubroId === 0) return;
    const selectedOption = this.rubroOptions.find(i => i.id === rubroId)?.name;
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el rubro? ${selectedOption}`,
      accept: () => {
        this.productoService.deleteRubro(rubroId)
          .subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Aviso', detail: 'Rubro Eliminado' });            
            },
            error: error => {
              this.messageService.add({ severity: 'error', summary: 'Aviso', detail: error.body.errorResponse.message });
            }
          });
      }
    });
  }
}