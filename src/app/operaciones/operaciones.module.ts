import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material/material.module';
import { PrimeModule } from '../shared/prime/prime.module';
import { OperacionesRoutingModule } from './operaciones-routing.module';
import { GridoperacionesComponent } from './pages/components/gridoperaciones/gridoperaciones.component';
import { ListadoComponent } from './pages/components/listadostock/listado.component'; 
import { TipodropdownComponent } from './pages/components/tipodropdown/tipodropdown.component';
import { OperacionComponent } from './pages/operacion/operacion.component';
import { OperacionesComponent } from './pages/operaciones/operaciones.component';
import { ListadocustomersComponent } from './pages/components/listadocustomers/listadocustomers.component';
import { PagosModule } from '../pagos/pagos.module';

@NgModule({
  declarations: [ 
   OperacionesComponent , 
   OperacionComponent,
   GridoperacionesComponent,
   TipodropdownComponent ,
   ListadoComponent,
   ListadocustomersComponent 
  ],
  imports: [
    CommonModule,
    PrimeModule,
    MaterialModule,
    OperacionesRoutingModule ,
    FormsModule,
    PagosModule
  ]
})

export class OperacionesModule { }
