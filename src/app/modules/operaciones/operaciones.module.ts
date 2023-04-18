import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PagosModule } from '../pagos/pagos.module';
import { MaterialModule } from '../../shared/material/material.module';
import { PrimeModule } from '../../shared/prime/prime.module';
import { OperacionesRoutingModule } from './operaciones-routing.module';
import { EstadosdropdownComponent } from './pages/components/estadodropdown/estadosdropdown.component';
import { GridoperacionesComponent } from './pages/components/gridoperaciones/gridoperaciones.component';
import { ListadocustomersComponent } from './pages/components/listadocustomers/listadocustomers.component';
import { ListadoComponent } from './pages/components/listadostock/listado.component';
import { TipodropdownComponent } from './pages/components/tipodropdown/tipodropdown.component';
import { OperacionComponent } from './pages/operacion/operacion.component';
import { OperacionesComponent } from './pages/operaciones/operaciones.component';

@NgModule({
  declarations: [
    OperacionesComponent,
    OperacionComponent,
    GridoperacionesComponent,
    TipodropdownComponent,
    ListadoComponent,
    ListadocustomersComponent,
    EstadosdropdownComponent
  ],
  imports: [
    CommonModule,
    PrimeModule,
    MaterialModule,
    OperacionesRoutingModule,
    FormsModule,
    PagosModule
  ],
  exports: [
    ListadocustomersComponent
  ]
})

export class OperacionesModule { }
