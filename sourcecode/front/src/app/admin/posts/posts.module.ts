import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';

import { PostsRoutingModule } from './posts-routing.module';
import { ListComponent } from './list.component';
import { AddComponent } from './add.component';
import { EditPostDialogComponent } from './edit-post-dialog/edit-post-dialog.component';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditPostDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PostsRoutingModule,
    DataTablesModule,
    FormsModule,
    MatDialogModule
  ],
  exports: [
    DataTablesModule
  ]
})
export class PostsModule { }
