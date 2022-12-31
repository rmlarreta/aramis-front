import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { CobroComponent } from './components/cobro/cobro.component';
import { PrimeModule } from '../shared/prime/prime.module';
import { FormsModule } from '@angular/forms';
import { PagosService } from '../service/pagos/pagos.service';


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
  ],
  providers:[PagosService]
})
export class PagosModule { }
