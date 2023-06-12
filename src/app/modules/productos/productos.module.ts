import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoComponent } from './components/listado/listado.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeModule } from 'src/app/shared/prime/prime.module';



@NgModule({
  declarations: [
    ListadoComponent
  ],
  imports: [
    CommonModule,
    PrimeModule, 
    ReactiveFormsModule,
  ]
})
export class ProductosModule { }
