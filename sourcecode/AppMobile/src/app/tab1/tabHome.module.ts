import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabHomePage } from './tabHome.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabHomePageRoutingModule } from './tabHome-routing.module';
import { DetailPostPage } from './detailPost/detailPost.page';
import { CommentPage } from './comment/comment.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TabHomePageRoutingModule,
  ],
  declarations: [
    TabHomePage,
    DetailPostPage,
    CommentPage
  ]
})
export class TabHomePageModule {}
