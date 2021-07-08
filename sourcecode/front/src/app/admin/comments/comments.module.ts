import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';

import { CommentsRoutingModule } from './comments-routing.module';
import { ListComponent } from './list.component';

@NgModule({
  declarations: [
    ListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommentsRoutingModule,
    DataTablesModule,
    FormsModule,
    MatDialogModule
  ]
})
export class CommentsModule { }
