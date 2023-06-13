import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeModule } from 'src/app/shared/prime/prime.module';
import { OperationsComponent } from './components/operations/operations.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { OperationsRoutingModule } from './operations-routing.module';

@NgModule({
  declarations: [
    OperationsComponent,
    PresupuestoComponent 
  ],
  imports: [
    CommonModule,
    OperationsRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class OperationsModule { }
