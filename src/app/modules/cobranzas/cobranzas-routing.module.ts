import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { ReciboComponent } from './components/recibo/recibo.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'new', component: ReciboComponent }, 
      { path: '**', redirectTo: 'new' }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CobranzasRoutingModule { }
