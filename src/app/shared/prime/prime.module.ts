import { NgModule } from '@angular/core';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar'; 
import { DividerModule } from 'primeng/divider';
import {PanelModule} from 'primeng/panel';

@NgModule({
  declarations: [],
  exports: [ButtonModule, DialogModule, MenubarModule, DividerModule,PanelModule,ProgressSpinnerModule]
})
export class PrimeModule { }
