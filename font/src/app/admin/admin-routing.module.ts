import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubNavComponent } from './subnav.component';
import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';

const accountsModule = () => import('./accounts/accounts.module').then(x => x.AccountsModule);
const postsModule = () => import('./posts/posts.module').then(x => x.PostsModule);
const commentsModule = () => import('./comments/comments.module').then(x => x.CommentsModule);

const routes: Routes = [
    // { path: '', component: SubNavComponent, outlet: 'subnav' },
    {
        path: '', component: LayoutComponent,
        children: [
            //{ path: '', component: OverviewComponent },
            { path: '', redirectTo: 'accounts', pathMatch: 'full'},
            { path: 'accounts', loadChildren: accountsModule },
            { path: 'posts', loadChildren: postsModule },
            { path: 'comments', loadChildren: commentsModule },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }