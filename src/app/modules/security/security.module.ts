import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeModule } from '../../shared/prime/prime.module';
import { LoginComponent } from './pages/login/login.component';
import { SecurityRoutingModule } from './security-routing.module';
import { ChangepasswordComponent } from './pages/changepassword/changepassword.component';



@NgModule({
  declarations: [
    LoginComponent,
    ChangepasswordComponent
  ],
  imports: [
    CommonModule ,
    ReactiveFormsModule ,
    SecurityRoutingModule ,
    PrimeModule
  ]
})
export class SecurityModule { }
