import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationsComponent } from '../operations/components/operations/operations.component';
import { PresupuestoComponent } from '../operations/components/presupuesto/presupuesto.component';

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
export class ProductosRoutingModule { }
