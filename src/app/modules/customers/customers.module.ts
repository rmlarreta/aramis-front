import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeModule } from '../../shared/prime/prime.module';
import { CustomersRoutingModule } from './customers-routing.module';
import { MainComponent } from './pages/main/main.component';
 
@NgModule({
  declarations: [
    MainComponent 
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
