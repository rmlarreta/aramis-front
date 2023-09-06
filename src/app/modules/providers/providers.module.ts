import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeModule } from 'src/app/shared/prime/prime.module';
import { AddDocumentComponent } from './components/add-document/add-document.component';
import { ListadoDocumentsComponent } from './components/listado-documents/listado-documents.component';
import { ProvidersRoutingModule } from './providers-routing.module';
import { PayDocumentComponent } from './components/pay-document/pay-document.component'; 



@NgModule({
  declarations: [
    ListadoDocumentsComponent,
    AddDocumentComponent,
    PayDocumentComponent, 
  ],
  imports: [
    CommonModule,
    ProvidersRoutingModule,
    PrimeModule, 
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ProvidersModule { }
