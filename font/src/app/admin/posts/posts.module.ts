import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { ListComponent } from './list.component';
import { AddComponent } from './add.component';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PostsRoutingModule
  ]
})
export class PostsModule { }
