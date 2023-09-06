import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoDocumentsComponent } from './components/listado-documents/listado-documents.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: ListadoDocumentsComponent },
      { path: '**', redirectTo: 'list' }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvidersRoutingModule { }
