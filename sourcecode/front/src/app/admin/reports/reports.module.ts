import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    ReportsRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    DataTablesModule,
    FormsModule,
    MatDialogModule
  ],
  exports: [
    DataTablesModule
  ]
})
export class ReportsModule { }
