import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';

import { TabHomePage } from './tabHome.page';
import { TabHomePageRoutingModule } from './tabHome-routing.module';
import { DetailPostPage } from './detailPost/detailPost.page';
import { CommentPage } from './comment/comment.page';
import { ReplyCommentPage } from './comment/reply-comment/reply-comment.page';
import { DateAgoExaple } from './dateAgoExample';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabHomePageRoutingModule,
  ],
  exports: [
    ReplyCommentPage,
  ],
  declarations: [
    TabHomePage,
    DetailPostPage,
    CommentPage,
    ReplyCommentPage,
    DateAgoExaple
  ],
  providers: [
    File,
    FileTransfer
  ]
})
export class TabHomePageModule {}
