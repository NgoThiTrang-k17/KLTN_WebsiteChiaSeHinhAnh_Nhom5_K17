import { AccountSettingComponent } from './app/settings/account-setting/account-setting.component';
import { ImageDetailComponent } from './app/image-detail/image-detail.component';
import { IndexComponent } from './app/index/index.component';
import { HomeComponent } from './app/home/home.component';
import { UserRegisterComponent } from './app/user/user-register/user-register.component';
import { UserLoginComponent } from './app/user/user-login/user-login.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'home',
        component: IndexComponent
    },
    {
        path: 'image',
        component: ImageDetailComponent
    },
    {
        path: 'account-setting',
        component: AccountSettingComponent
    },
    {
        path: 'user-login',
        component: UserLoginComponent
    },
    {
        path: 'user-register',
        component: UserRegisterComponent
    }
];

