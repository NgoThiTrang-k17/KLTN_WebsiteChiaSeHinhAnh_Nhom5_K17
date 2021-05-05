import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_helpers';
import { Role } from './_models';

const userModule = () => import('./home/user.module').then(x => x.UserModule);
const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);

const routes: Routes = [
    { path: '', redirectTo: 'account', pathMatch: 'full'},
    { path: 'user', loadChildren: userModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule, },
    { path: 'admin', loadChildren: adminModule, },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
