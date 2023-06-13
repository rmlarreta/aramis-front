import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoComponent } from './components/listado/listado.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: ListadoComponent },
      { path: '**', redirectTo: 'list' }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
