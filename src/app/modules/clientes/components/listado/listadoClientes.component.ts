import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { Subscription, map, tap } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { ClientesService } from '../../clientes.service';
import { OpCustomerDto } from '../../dtos/opCustomerDto.interface';
import { AddClienteComponent } from '../add-cliente/add-cliente.component';

@Component({
  selector: 'app-listadoClientes',
  templateUrl: './listadoClientes.component.html',
  styleUrls: ['./listadoClientes.component.css']
})
export class ListadoClientesComponent implements OnInit {
  presupuestando: boolean = false;
  listado: OpCustomerDto[] = [];
  selected!: OpCustomerDto;
  first = 0;
  rows = 10;

  @ViewChild('addCLienteContainer', { read: ViewContainerRef }) addClienteContainer!: ViewContainerRef;
  addCliente!: ComponentRef<AddClienteComponent>;

  clienteUpdateSubscription: Subscription = new Subscription;

  constructor(
    private clientesService: ClientesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.clienteUpdateSubscription = this.clientesService._clientesUpdated$
      .subscribe(() => {
        this.getAll()
      });

    this.getAll();
  }

  onRowSelect(customer: OpCustomerDto): void {
    this.selected = customer;
    this.enviarSeleccionados();
  }

  getAll(): void {
    this.clientesService.getAllClientes()
      .pipe(
        tap((response: DataResponse<OpCustomerDto[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<OpCustomerDto[]>) => response.data || [])
      )
      .subscribe({
        next: (data: OpCustomerDto[]) => {
          this.listado = data;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
        }
      });
  }

  deleteCliente(id: string): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este cliente?',
      accept: () => {
        this.clientesService.deleteCliente(id)
          .pipe(
            tap(() => {
              this.messageService.add({ severity: 'success', summary: 'Aviso', detail: "Cliente Eliminado" });
            })
          )
          .subscribe({
            next: () => {
              this.getAll();
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
            }
          });
      }
    });
  }

  enviarSeleccionados() {
    this.clientesService.setClienteSeleccionado(this.selected);
  }

  // Otros métodos y propiedades del componente...
  openClienteAdd() {
    this.addClienteContainer.clear();
    this.addCliente = this.addClienteContainer.createComponent(AddClienteComponent);
    this.addCliente.instance.visible = true;
  }

  openClienteEdit(cliente: OpCustomerDto) {
    this.addClienteContainer.clear();
    this.addCliente = this.addClienteContainer.createComponent(AddClienteComponent);
    this.addCliente.instance.visible = true;
    this.addCliente.instance.editing = true;
    this.addCliente.instance.cliente = cliente; // Pasar el producto a editar al componente hijo
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

  onConciliar() {
    console.log("A componente")
  }
}
