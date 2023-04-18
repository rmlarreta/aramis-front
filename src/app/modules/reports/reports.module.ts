import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeModule } from 'src/app/shared/prime/prime.module';
import { CuentasComponent } from './components/cuentas/cuentas.component';
import { MainComponent } from './main/main.component';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  declarations: [
    MainComponent,
    CuentasComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    PrimeModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ReportsModule { }
