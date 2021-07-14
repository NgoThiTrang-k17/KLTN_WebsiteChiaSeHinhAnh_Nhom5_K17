import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab5Page } from './tab5.page';
import { DetailPostPage } from '../tab1/detailPost/detailPost.page';

const routes: Routes = [
  { path: '', component: Tab5Page },
  { path: 'detail/:postId/:ownerId', component: DetailPostPage}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab5PageRoutingModule {}
