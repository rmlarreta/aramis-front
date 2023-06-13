import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoComponent } from './components/listado/listado.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeModule } from 'src/app/shared/prime/prime.module';
import { ProductosRoutingModule } from './productos-routing.module';
import { AddProductoComponent } from './components/add-producto/add-producto.component';



@NgModule({
  declarations: [
    ListadoComponent,
    AddProductoComponent
  ],
  imports: [
    CommonModule,
    PrimeModule, 
    ProductosRoutingModule,
    ReactiveFormsModule,
  ]
})
export class ProductosModule { }
