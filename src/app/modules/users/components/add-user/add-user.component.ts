import { Component } from '@angular/core';
import { UserInsertDto } from '../../dtos/userInsertDto.interface';
import { SecRoleDto } from '../../dtos/commons/rolesDto.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { tap, map } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { UserUpdateDto } from '../../dtos/userUpdateDto.inteface';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  visible: boolean = false;
  roleOptions: SecRoleDto[] = [];
  editForm!: FormGroup;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      userName: [null, Validators.required],
      realName: [null, Validators.required],
      role: [null, Validators.required],
      passWord: [null, Validators.required],
    });
    this.loadRoleOptions(); // Cargar las opciones de roles al inicializar el componente
  }

  get f() {
    return this.editForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // Stop here if the form is invalid
    if (this.editForm.invalid) {
      this.submitted = false;
      return;
    }

    const formValues = this.editForm.value;

    // Crear objeto UserUpdateDto con los valores del formulario
    const userInsert: UserInsertDto = {
      userName: formValues.userName,
      realName: formValues.realName,
      role: formValues.role,
      passWord: formValues.passWord
    };

    // Llamar al servicio para actualizar el usuario
    this.userService.createUser(userInsert).subscribe({
      next: () => {
        // Realizar acciones adicionales después de la actualización, si es necesario
        this.messageService.add({ severity: 'success', summary: 'Aviso', detail: "Usuario Creado" });

        // Reiniciar el formulario
        this.hideDialog();
      },
      error: error => {
        // Manejar el error, si ocurre 
        this.messageService.add({ severity: 'error', summary: 'Aviso', detail: error.error.errorResponse.message });
      }
    });
  }

  hideDialog() {
    this.submitted = false;
    this.editForm.reset();
    this.visible = false;
  }

  loadRoleOptions(): void {
    this.userService.getRoles()
      .pipe(
        tap((response: DataResponse<SecRoleDto[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<SecRoleDto[]>) => response.data || [])
      )
      .subscribe({
        next: (roles: SecRoleDto[]) => {
          // Acciones completadas después de obtener los usuarios
          this.roleOptions = roles;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      });
  }
}

