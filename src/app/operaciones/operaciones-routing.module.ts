import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperacionComponent } from './pages/operacion/operacion.component';
import { OperacionesComponent } from './pages/operaciones/operaciones.component';
  ;

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'operaciones', component: OperacionesComponent },
      { path: 'operacion', component: OperacionComponent },
      { path: '**', redirectTo: 'operaciones' }
    ]
  }
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionesRoutingModule { }
