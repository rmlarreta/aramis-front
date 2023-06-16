import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoComponent } from './components/listado/listado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeModule } from 'src/app/shared/prime/prime.module';
import { ProductosRoutingModule } from './productos-routing.module';
import { AddProductoComponent } from './components/add-producto/add-producto.component'; 
import { AddRubroComponent } from './components/add-rubro/add-rubro.component';



@NgModule({
  declarations: [
    ListadoComponent,
    AddProductoComponent, 
    AddRubroComponent
  ],
  imports: [
    CommonModule,
    PrimeModule, 
    ProductosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ProductosModule { }
