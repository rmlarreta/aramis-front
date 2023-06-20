import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RubroDto } from '../../dtos/rubroDto.interface';
import { ProductosService } from '../../productos.service';

@Component({
  selector: 'app-add-rubro',
  templateUrl: './add-rubro.component.html',
  styleUrls: ['./add-rubro.component.css']
})
export class AddRubroComponent {
  visible: boolean = false;
  rubro!: RubroDto;
  editForm!: FormGroup;
  submitted = false;
  editing = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductosService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      name: [this.rubro?.name, [Validators.required, Validators.minLength(4)]], // Descripción al menos 4 caracteres
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
    const rubro: RubroDto = {
      id: this.editing ? this.rubro.id : null,
      name: formValues.name,
    };
    if (this.editing) {
      this.productoService.updateRubro(rubro)
        .subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Aviso', detail: 'Rubro Actualizado' });
            this.hideDialog();
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Aviso', detail: error.errorResponse.message });
          }
        });
    } else {
      this.productoService.insertRubro(rubro)
        .subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Aviso', detail: 'Rubro Creado' });
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
} 
