import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../shared/material/material.module';
import { PrimeModule } from '../shared/prime/prime.module';
import { OperacionesRoutingModule } from './operaciones-routing.module';
import { GridoperacionesComponent } from './pages/components/gridoperaciones/gridoperaciones.component';
import { TipodropdownComponent } from './pages/components/tipodropdown/tipodropdown.component';
import { OperacionComponent } from './pages/operacion/operacion.component';
import { OperacionesComponent } from './pages/operaciones/operaciones.component';

@NgModule({
  declarations: [ 
   OperacionesComponent , 
   OperacionComponent,
   GridoperacionesComponent,
   TipodropdownComponent
  ],
  imports: [
    CommonModule,
    PrimeModule,
    MaterialModule,
    OperacionesRoutingModule 
  ]
})

export class OperacionesModule { }
