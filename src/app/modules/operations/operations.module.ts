import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeModule } from 'src/app/shared/prime/prime.module'; 
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { OperationsRoutingModule } from './operations-routing.module';
import { OperationsComponent } from './components/operations/operations.component';

@NgModule({
  declarations: [ 
    PresupuestoComponent,
    OperationsComponent
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
