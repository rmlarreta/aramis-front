import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeModule } from 'src/app/shared/prime/prime.module';
import { AddDocumentComponent } from './components/add-document/add-document.component';
import { MainComponent } from './pages/main/main.component';
import { SuppliersRoutingModule } from './suppliers-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PayDocumentComponent } from './components/pay-document/pay-document.component';



@NgModule({
  declarations: [
    MainComponent,
    AddDocumentComponent,
    PayDocumentComponent
  ],
  providers: [MessageService, ConfirmationService],
  imports: [
    CommonModule,
    PrimeModule,
    FormsModule,
    ReactiveFormsModule,
    SuppliersRoutingModule  
  ]
})
export class SuppliersModule { }
