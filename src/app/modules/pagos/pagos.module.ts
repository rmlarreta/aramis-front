import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PagosService } from '../../service/pagos/pagos.service';
import { PrimeModule } from '../../shared/prime/prime.module';
import { CobroComponent } from './components/cobro/cobro.component';


@NgModule({
  declarations: [
    CobroComponent
  ],
  imports: [
    CommonModule,
    PrimeModule,
    FormsModule
  ],
  exports: [
    CobroComponent
  ],
  providers: [PagosService]
})
export class PagosModule { }
