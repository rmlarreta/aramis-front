import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeModule } from '../../shared/prime/prime.module';
import { CustomersRoutingModule } from './customers-routing.module';
import { MainComponent } from './pages/main/main.component';
import { ConciliacionComponent } from './pages/components/conciliacion/conciliacion.component';
import { PagosModule } from "../pagos/pagos.module";
 
@NgModule({
    declarations: [
        MainComponent,
        ConciliacionComponent
    ],
    providers: [MessageService, ConfirmationService],
    imports: [
        CommonModule,
        PrimeModule,
        FormsModule,
        CustomersRoutingModule,
        PagosModule
    ]
})
export class CustomersModule { }
