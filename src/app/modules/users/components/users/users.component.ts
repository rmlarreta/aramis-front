import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { Subscription, map, tap } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { UserDto } from '../../dtos/userDto.interface';
import { UsersService } from '../../users.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  listado: UserDto[] = [];
  selectedUser: UserDto[] = [];
  first = 0;
  rows = 10;
  //abm  
  @ViewChild('addUserContainer', { read: ViewContainerRef }) addUserContainer!: ViewContainerRef;
  addUser!: ComponentRef<AddUserComponent>;

  @ViewChild('editUserContainer', { read: ViewContainerRef }) editUserContainer!: ViewContainerRef;
  editUser!: ComponentRef<EditUserComponent>;

  userUpdateSubscription: Subscription = new Subscription;
  //abm
  constructor(
    private userService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.userUpdateSubscription = this.userService.userUpdated$.subscribe(() => {
      this.getAllUsers()
    });
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getAllUsers()
      .pipe(
        tap((response: DataResponse<UserDto[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<UserDto[]>) => response.data || [])
      )
      .subscribe({
        next: (users: UserDto[]) => {
          // Acciones completadas después de obtener los usuarios
          this.listado = users;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.errorResponse.message });
        }
      });
  }

  deleteUser(id: string): void {
    this.confirmationService.confirm({
      message: 'Seguro de eliminar este usuario?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(id)
          .pipe(
            tap(() => {
              // Realizar acciones adicionales después de eliminar el usuario, si es necesario
              this.messageService.add({ severity: 'success', summary: 'Aviso', detail: "Usuario Eliminado" });
            })
          )
          .subscribe({
            next: () => {
              // Acciones completadas después de eliminar el usuario
              this.getAllUsers();
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error.errorResponse.message });
            }
          });
        }
      });
    }

  // Otros métodos y propiedades del componente...
  openUserAdd() {
      this.addUserContainer.clear();
      this.addUser = this.addUserContainer.createComponent(AddUserComponent);
      this.addUser.instance.visible = true;
    }

  onEdit(user: UserDto) {
      this.editUserContainer.clear();
      this.editUser = this.editUserContainer.createComponent(EditUserComponent);
      this.editUser.instance.user = user;
      this.editUser.instance.visible = true;
    }

  next() {
      this.first = this.first + this.rows;
    }

  prev() {
      this.first = this.first - this.rows;
    }

  reset() {
      this.first = 0;
    }

  isLastPage(): boolean {
      return this.listado ? this.first === (this.listado.length - this.rows) : true;
    }

  isFirstPage(): boolean {
      return this.listado ? this.first === 0 : true;
    }

  customSort(event: SortEvent) {
      event.data!.sort((data1, data2) => {
        const value1 = data1[event.field!];
        let value2 = data2[event.field!];
        let result = null;

        if (value1 == null && value2 != null)
          result = -1;
        else if (value1 != null && value2 == null)
          result = 1;
        else if (value1 == null && value2 == null)
          result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
          result = value1.localeCompare(value2);
        else
          result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

        return (event.order! * result);
      });
    }
}