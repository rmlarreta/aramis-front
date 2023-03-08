import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material/material.module';
import { PrimeModule } from '../../shared/prime/prime.module';
import { MainComponent } from './pages/main/main.component';
import { StockRoutingModule } from './stock-routing.module';
import { RubrosabmComponent } from './components/rubrosabm/rubrosabm.component';


@NgModule({
  declarations: [   
    MainComponent, RubrosabmComponent 
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
