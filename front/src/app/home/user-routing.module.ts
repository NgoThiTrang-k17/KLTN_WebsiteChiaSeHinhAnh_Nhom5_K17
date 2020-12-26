import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home.component';
import { AddEditPostComponent } from './add-edit-post/add-edit-post.component';
import { DetailPostComponent } from './detail-post/detail-post.component';
import { DetailsComponent } from '../home/profile/details.component';

const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);
const accountModule = () => import('../account/account.module').then(x => x.AccountModule);

const routes: Routes = [
    
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'add-post', component: AddEditPostComponent},
            { path: 'detail-post/:id/:ownerId', component: DetailPostComponent},
            { path: 'edit/:id', component: AddEditPostComponent},
            { path: 'account', loadChildren: accountModule,},
            { path: 'profile', loadChildren: profileModule},
            { path: 'detail/:id', component: DetailsComponent},
        ]     
    },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }