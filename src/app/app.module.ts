import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomersModule } from './modules/customers/customers.module';
import { OperacionesModule } from './modules/operaciones/operaciones.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SecurityModule } from './modules/security/security.module';
import { ErrorInterceptor } from './modules/security/service/error-interceptor.service';
import { JwtInterceptor } from './modules/security/service/jwt-interceptor.service';
import { StockModule } from './modules/stock/stock.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { UsersModule } from './modules/users/users.module'; 
import { MaterialModule } from './shared/material/material.module';
import { PrimeModule } from './shared/prime/prime.module';
import { ResponseInterceptor } from './shared/responseInterceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    PrimeModule,
    SecurityModule,
    OperacionesModule,
    HttpClientModule,
    StockModule,
    CustomersModule,
    ReportsModule,
    SuppliersModule,
    UsersModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {
}
