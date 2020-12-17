import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CommentsRoutingModule } from './comments-routing.module';
import { ListComponent } from './list.component';

@NgModule({
  declarations: [
    ListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommentsRoutingModule
  ]
})
export class CommentsModule { }
