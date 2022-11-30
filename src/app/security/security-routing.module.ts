import { NgModule } from '@angular/core'; 
import { RouterModule, Routes } from '@angular/router';
import { ChangepasswordComponent } from './pages/changepassword/changepassword.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent }, 
      { path: 'change', component: ChangepasswordComponent }, 
      { path: '**', redirectTo: 'login' }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
