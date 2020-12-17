import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list.component';
import { AddComponent } from './add.component'

const routes: Routes = [
    { path: '', component: ListComponent },
    { path: 'add', component: AddComponent },
    // { path: 'edit/:id', component: AddEditComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostsRoutingModule { }