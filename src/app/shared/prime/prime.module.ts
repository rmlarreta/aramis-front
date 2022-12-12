import { NgModule } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import {ToolbarModule} from 'primeng/toolbar';
import {CardModule} from 'primeng/card';
import {ToastModule} from 'primeng/toast';
import {MenuModule} from 'primeng/menu';
import {RatingModule} from 'primeng/rating';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputNumberModule} from 'primeng/inputnumber';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {SidebarModule} from 'primeng/sidebar';
import {InputTextModule} from 'primeng/inputtext';

@NgModule({
  declarations: [],
  exports: [
    ButtonModule,
    DialogModule,
    MenubarModule,
    DividerModule,
    PanelModule,
    ProgressSpinnerModule,
    NgxSkeletonLoaderModule,
    TableModule,
    MultiSelectModule,
    DropdownModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    MenuModule,
    RatingModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    SidebarModule,
    InputTextModule
  ]
})
export class PrimeModule { }
