import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoClientesComponent } from './components/listado/listadoClientes.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: ListadoClientesComponent },
      { path: '**', redirectTo: 'list' }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
