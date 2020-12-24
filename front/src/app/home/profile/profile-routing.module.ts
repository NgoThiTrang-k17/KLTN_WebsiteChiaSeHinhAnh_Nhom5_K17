import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsComponent } from './details.component';
import { UpdateComponent } from './update.component';
import { AddEditPostComponent } from '../add-edit-post/add-edit-post.component';
import { DetailPostComponent } from '../detail-post/detail-post.component';

const routes: Routes = [
    { path: '', component: DetailsComponent },
    { path: 'update', component: UpdateComponent },
    { path: 'add-post', component: AddEditPostComponent},
    { path: 'detail-post/:id', component: DetailPostComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }