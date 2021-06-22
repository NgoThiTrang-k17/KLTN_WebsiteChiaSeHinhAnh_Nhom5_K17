import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabHomePage } from './tabHome.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { TabHomePageRoutingModule } from './tabHome-routing.module';
import { DetailPostPage } from './detailPost/detailPost.page';
import { CommentPage } from './comment/comment.page';
import { ReplyCommentPage } from './comment/reply-comment/reply-comment.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TabHomePageRoutingModule,
  ],
  exports: [
    ReplyCommentPage
  ],
  declarations: [
    TabHomePage,
    DetailPostPage,
    CommentPage,
    ReplyCommentPage
  ],
  providers: [
    FileTransfer
  ]
})
export class TabHomePageModule {}
