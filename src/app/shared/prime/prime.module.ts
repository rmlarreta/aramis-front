import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {MenubarModule} from 'primeng/menubar';

@NgModule({
  declarations: [],
  exports: [ButtonModule, DialogModule,MenubarModule]
})
export class PrimeModule { }
