import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { DetailPostComponent } from '../home/detail-post/detail-post.component';

const accountsModule = () => import('./accounts/accounts.module').then(x => x.AccountsModule);
const postsModule = () => import('./posts/posts.module').then(x => x.PostsModule);
const commentsModule = () => import('./comments/comments.module').then(x => x.CommentsModule);
const reportsModule = () => import('./reports/reports.module').then(x => x.ReportsModule);
const userModule = () => import('../home/user.module').then(x=>x.UserModule);

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      //{ path: '', component: OverviewComponent },
      { path: '', redirectTo: 'accounts', pathMatch: 'full'},
      { path: 'accounts', loadChildren: accountsModule },
      { path: 'posts', loadChildren: postsModule },
      { path: 'comments', loadChildren: commentsModule },
      { path: 'reports', loadChildren: reportsModule},
    ]
  },
  { path: 'user', loadChildren: userModule},
  { path: 'user/detail-post/:id/:ownerId', component: DetailPostComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
