import { NgModule } from '@angular/core'; 
import { RouterModule, Routes } from '@angular/router'; 
import { MainComponent } from '../reports/main/main.component';
import { CuentasComponent } from './components/cuentas/cuentas.component';

const routes: Routes = [
  {
    path: '',
    children: [ 
      { path: 'reportes', component: MainComponent },
      { path: 'cuentas', component: CuentasComponent },
      { path: '**', redirectTo: 'reportes' }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
