import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SecurityRoutingModule } from './security-routing.module'; 



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule ,
    ReactiveFormsModule ,
    SecurityRoutingModule 
  ]
})
export class SecurityModule { }
