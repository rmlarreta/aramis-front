import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeModule } from '../../shared/prime/prime.module';
import { CustomersRoutingModule } from './customers-routing.module';
import { MainComponent } from './pages/main/main.component';
import { ConciliacionComponent } from './pages/components/conciliacion/conciliacion.component';
 
@NgModule({
  declarations: [
    MainComponent,
    ConciliacionComponent 
  ],
  imports: [
    CommonModule,
    PrimeModule,
    FormsModule,
    CustomersRoutingModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class CustomersModule { }
