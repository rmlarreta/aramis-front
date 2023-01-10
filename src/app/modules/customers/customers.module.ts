import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeModule } from '../../shared/prime/prime.module';
import { CustomersRoutingModule } from './customers-routing.module';
import { GenderdropComponent } from './pages/components/genderdrop/genderdrop.component';
import { PaisdropComponent } from './pages/components/paisdrop/paisdrop.component';
import { RespodropComponent } from './pages/components/respodrop/respodrop.component';
import { MainComponent } from './pages/main/main.component';
 
@NgModule({
  declarations: [
    MainComponent,
    GenderdropComponent,
    RespodropComponent,
    PaisdropComponent
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
