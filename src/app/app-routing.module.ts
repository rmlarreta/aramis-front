import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';  

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'operaciones',
  },
  {
    path: 'security',
    loadChildren: () => import('./security/security.module').then(m => m.SecurityModule)
  },
  {
    path: 'operaciones',
    loadChildren: () => import('./operaciones/operaciones.module').then(m => m.OperacionesModule)
  },
  {
    path: '**',
    loadChildren: () => import('./operaciones/operaciones.module').then(m => m.OperacionesModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }