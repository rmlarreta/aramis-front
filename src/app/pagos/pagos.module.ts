import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { CobroComponent } from './components/cobro/cobro.component';
import { PrimeModule } from '../shared/prime/prime.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ 
    CobroComponent
  ],
  imports: [
    CommonModule ,
    PrimeModule,
    FormsModule
  ],
  exports:[
    CobroComponent
  ]
})
export class PagosModule { }
