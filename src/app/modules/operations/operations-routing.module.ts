import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationsComponent } from './components/operations/operations.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: OperationsComponent },
      { path: 'editPresupuesto/:id', component: PresupuestoComponent },
      { path: 'editPresupuesto', component: PresupuestoComponent }, // Ruta sin parámetro de ID opcional
      { path: '**', redirectTo: 'list' }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule { }
