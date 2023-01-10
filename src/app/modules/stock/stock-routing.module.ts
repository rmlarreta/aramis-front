import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
  {
    path: '',
    children: [ 
      { path: 'stock', component: MainComponent },
      { path: '**', redirectTo: 'stock' } 
    ]
  } 
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
