import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrimeModule } from 'src/app/shared/prime/prime.module'; 
import { MainComponent } from './main/main.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { CuentasComponent } from './components/cuentas/cuentas.component'; 

@NgModule({
  declarations: [
    MainComponent,
    CuentasComponent 
    ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    PrimeModule
  ]
})
export class ReportsModule { }
