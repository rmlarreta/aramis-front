import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { OperacionesComponent } from './pages/operaciones/operaciones.component';   
import { PrimeModule } from '../shared/prime/prime.module';
import { OperacionesRoutingModule } from './operaciones-routing.module';
import { GridoperacionesComponent } from './pages/components/gridoperaciones/gridoperaciones.component';
import { TipodropdownComponent } from './pages/components/tipodropdown/tipodropdown.component';
import { OperacionComponent } from './pages/operacion/operacion.component';
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
    OperacionesRoutingModule
  ]
})
export class OperacionesModule { }
