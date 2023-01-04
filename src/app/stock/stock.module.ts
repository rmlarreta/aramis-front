import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material/material.module';
import { PrimeModule } from '../shared/prime/prime.module';
import { RubrodropdownComponent } from './pages/components/rubrodropdown/rubrodropdown.component';
import { MainComponent } from './pages/main/main.component'; 
import { StockRoutingModule } from './stock-routing.module';


@NgModule({
  declarations: [   
    MainComponent,
    RubrodropdownComponent
  ],
  imports: [
    CommonModule, 
    PrimeModule,
    MaterialModule,
    FormsModule,
    StockRoutingModule
  ] 
})
export class StockModule { }
