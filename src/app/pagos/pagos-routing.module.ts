import { NgModule } from '@angular/core'; 
import { CobroComponent } from './components/cobro/cobro.component';
import { RouterModule, Routes } from '@angular/router';
 

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'cobro', component: CobroComponent }, 
      { path: '**', redirectTo: 'cobro' }
    ]
  }
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagosRoutingModule { }
