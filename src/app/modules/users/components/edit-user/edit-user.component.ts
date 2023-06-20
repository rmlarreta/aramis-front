import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { map, tap } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { SecRoleDto } from '../../dtos/commons/rolesDto.interface';
import { UserDto } from '../../dtos/userDto.interface';
import { UserUpdateDto } from '../../dtos/userUpdateDto.inteface';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  visible: boolean = false;
  user: UserDto = {
    id: '',
    userName: '',
    realName: '',
    role: '',
    endOfLife: '',
    active: false,
    roleName: ''
  };
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
      id: [this.user.id],
      userName: [this.user.userName, Validators.required],
      realName: [this.user.realName, Validators.required],
      role: [this.user.role, Validators.required],
      endOfLife: [new Date(this.user.endOfLife), Validators.required],
      active: [this.user.active]
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
      return;
    }

    const formValues = this.editForm.value;

    // Crear objeto UserUpdateDto con los valores del formulario
    const userUpdate: UserUpdateDto = {
      id: formValues.id,
      userName: formValues.userName,
      realName: formValues.realName,
      role: formValues.role,
      endOfLife: formValues.endOfLife,
      active: formValues.active
    };

    // Llamar al servicio para actualizar el usuario
    this.userService.updateUser(userUpdate).subscribe({
      next: () => {
        // Realizar acciones adicionales después de la actualización, si es necesario
        this.messageService.add({ severity: 'success', summary: 'Aviso', detail: "Usuario actualizado" });

        // Reiniciar el formulario
        this.hideDialog();
      },
      error: error => {
        // Manejar el error, si ocurre 
        this.messageService.add({ severity: 'error', summary: 'Aviso', detail: error.errorResponse.message });
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
