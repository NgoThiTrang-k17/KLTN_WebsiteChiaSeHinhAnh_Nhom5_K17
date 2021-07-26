import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab4Page } from './tab4.page';
import { DetailPostPage } from '../tab1/detailPost/detailPost.page';

const routes: Routes = [
  { path: '', component: Tab4Page },
  { path: 'detail/:postId/:ownerId', component: DetailPostPage},
  { path: 'detail/:postId/:ownerId/:commentId', component: DetailPostPage},
  { path: 'account/:id', loadChildren: () => import('../tab5/tab5.module').then(m => m.Tab5PageModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab4PageRoutingModule {}
