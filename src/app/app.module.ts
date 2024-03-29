import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientesModule } from './modules/clientes/clientes.module';
import { CobranzasModule } from './modules/cobranzas/cobranzas.module';
import { OperationsModule } from './modules/operations/operations.module';
import { ProductosModule } from './modules/productos/productos.module';
import { SecurityModule } from './modules/security/security.module';
import { ErrorInterceptor } from './modules/security/service/error-interceptor.service';
import { JwtInterceptor } from './modules/security/service/jwt-interceptor.service';
import { UsersModule } from './modules/users/users.module';
import { MaterialModule } from './shared/material/material.module';
import { PrimeModule } from './shared/prime/prime.module';
import { ProvidersModule } from './modules/providers/providers.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    PrimeModule,
    SecurityModule,
    HttpClientModule,
    ClientesModule,
    UsersModule,
    ProductosModule,
    CobranzasModule,
    OperationsModule,
    ProvidersModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MessageService },
    { provide: ConfirmationService},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
