import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReciboComponent } from './components/recibo/recibo.component';
import { PrimeModule } from 'src/app/shared/prime/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddDetalleComponent } from './components/add-detalle/add-detalle.component';
import { CobranzasRoutingModule } from './cobranzas-routing.module';



@NgModule({
  declarations: [
    ReciboComponent,
    AddDetalleComponent
  ],
  imports: [
    CommonModule,
    PrimeModule,
    FormsModule,
    ReactiveFormsModule,
    CobranzasRoutingModule
  ]
})
export class CobranzasModule { }
