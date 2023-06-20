import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeModule } from 'src/app/shared/prime/prime.module';
import { ProductosRoutingModule } from './productos-routing.module';
import { AddProductoComponent } from './components/add-producto/add-producto.component'; 
import { AddRubroComponent } from './components/add-rubro/add-rubro.component';
import { ListadoProductosComponent } from './components/listado/listadoProductos.component';



@NgModule({
  declarations: [
    ListadoProductosComponent,
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
