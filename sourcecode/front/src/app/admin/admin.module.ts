import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DataTablesModule } from 'angular-datatables';

import { AdminRoutingModule } from './admin-routing.module';
import { SubNavComponent } from './subnav.component';
import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';
import { CommentsModule } from './comments/comments.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    CommentsModule,
    BsDropdownModule,
    DataTablesModule,
  ],
  exports:[
    DataTablesModule,
  ],
  declarations: [
      SubNavComponent,
      LayoutComponent,
      OverviewComponent
  ]
})
export class AdminModule { }
