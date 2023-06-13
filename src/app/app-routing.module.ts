import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'operations',
  },
  {
    path: 'security',
    loadChildren: () => import('./modules/security/security.module').then(m => m.SecurityModule)
  },
  {
    path: 'stock',
    loadChildren: () => import('./modules/stock/stock.module').then(m => m.StockModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./modules/customers/customers.module').then(m => m.CustomersModule)
  },
  {
    path: 'reportes',
    loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule)
  },
  {
    path: 'suppliers',
    loadChildren: () => import('./modules/suppliers/suppliers.module').then(m => m.SuppliersModule)
  }, {
    path: 'users',
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'operations',
    loadChildren: () => import('./modules/operations/operations.module').then(m => m.OperationsModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./modules/productos/productos.module').then(m => m.ProductosModule)
  },
  {
    path: '**',
    loadChildren: () => import('./modules/operations/operations.module').then(m => m.OperationsModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }