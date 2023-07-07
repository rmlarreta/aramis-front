import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeModule } from 'src/app/shared/prime/prime.module';
import { AddClienteComponent } from './components/add-cliente/add-cliente.component';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ListadoClientesComponent } from './components/listado/listadoClientes.component';
import { ConciliacionComponent } from './components/conciliacion/conciliacion.component';

@NgModule({
  declarations: [
    ListadoClientesComponent,
    AddClienteComponent,
    ConciliacionComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    PrimeModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ClientesModule { }
