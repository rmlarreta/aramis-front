import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomersModule } from './modules/customers/customers.module';
import { OperacionesModule } from './modules/operaciones/operaciones.module';
import { SecurityModule } from './modules/security/security.module';
import { ErrorInterceptor } from './service/security/error-interceptor.service';
import { JwtInterceptor } from './service/security/jwt-interceptor.service';
import { MaterialModule } from './shared/material/material.module';
import { PrimeModule } from './shared/prime/prime.module';
import { StockModule } from './modules/stock/stock.module';

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
    CustomersModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {
}
