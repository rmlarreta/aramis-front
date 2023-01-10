import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { OpGenderDto, OpPaiDto, OpRespDto } from 'src/app/model/opClientesAttributes.interface';
import { OpClienteDto } from 'src/app/model/opClientesDto.interface';
import { OpClienteInsert } from 'src/app/model/opClientesInsert.interface';
import { ClientesService } from 'src/app/service/clientes/clientes.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  respos: OpRespDto[] = [];
  genders: OpGenderDto[] = [];
  paises: OpPaiDto[] = [];
  listado: OpClienteDto[] = [];
  loading = false;
  updating = false;
  first = 0;
  rows = 10;
  customerDialog = false;

  insert: OpClienteInsert = {
    id: null,
    cui: '',
    resp: '',
    razon: '',
    gender: '',
    domicilio: '',
    pais: null,
    contacto: null,
    mail: null
  };

  submitted = false;

  constructor(
    private clienteservice: ClientesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.clienteservice.clientes
      .subscribe(s => this.listado = s);

    this.clienteservice.respos
      .subscribe(x => this.respos = x);

    this.clienteservice.genders
      .subscribe(x => this.genders = x);

    this.clienteservice.paises
      .subscribe(x => this.paises = x);
  }

  hideDialog() {
    this.customerDialog = false;
    this.submitted = false;
    this.updating = false;
  }

  addCustomer() {
    this.submitted = true;
    this.clienteservice.customeradd(this.insert)
      .subscribe({
        complete: () => {
          this.hideDialog()
          this.clienteservice.clientes
            .subscribe(x => this.listado = x);
        },
        error: (error) => { this.messageService.add({ severity: 'warn', summary: 'Error', detail: error }); }
      })
  }

  saveCustomer() {
    this.submitted = true;
    this.updating = false;
    this.clienteservice.customersave(this.insert)
      .subscribe({
        complete: () => {
          this.hideDialog()
          this.clienteservice.clientes
            .subscribe(x => this.listado = x);
        },
        error: (error) => { this.messageService.add({ severity: 'warn', summary: 'Error', detail: error }); }
      })
  }

  deleteCustomer(customer: OpClienteDto) {
    this.confirmationService.confirm({
      message: 'Seguro de eliminar ' + customer.razon + ' ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clienteservice.customerdelete(customer.id!)
          .subscribe({
            complete: () => {
              this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Cliente Eliminado', life: 3000 });
              this.clienteservice.clientes
                .subscribe(p => this.listado = p);
            }
            , error: (error) => { this.messageService.add({ severity: 'warn', summary: 'Error', detail: error }); }
          })
      }
    });
  }

  onEdit(customer: OpClienteInsert) {
    this.insert = customer;
    this.customerDialog = true;
    this.updating = true;
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
