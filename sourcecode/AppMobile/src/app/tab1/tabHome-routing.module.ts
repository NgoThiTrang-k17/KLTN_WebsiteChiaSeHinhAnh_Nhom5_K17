import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabHomePage } from './tabHome.page';
import { DetailPostPage } from './detailPost/detailPost.page';
import { CommentPage } from './comment/comment.page';

const routes: Routes = [
  {
    path: '',
    component: TabHomePage,
  },
  {
    path: 'detail/:postId/:ownerId',
    component: DetailPostPage,
  },
  {
    path: 'comment',
    component: CommentPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabHomePageRoutingModule {}
