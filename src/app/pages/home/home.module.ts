import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module'; 
import { HomeComponent } from './home.component';
import { PrimeModule } from 'src/app/shared/prime/prime.module';
import { TipodropdownComponent } from './shared/tipodropdown/tipodropdown.component'; 
import { OperacionComponent } from './shared/operacion/operacion.component'; 
import { GridoperacionesComponent } from './shared/gridoperaciones/gridoperaciones.component';


@NgModule({
  declarations: [HomeComponent, TipodropdownComponent, OperacionComponent,GridoperacionesComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PrimeModule 
  ]
})
export class HomeModule {    
}
