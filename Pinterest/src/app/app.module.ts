import { AuthService } from './_services/_auth.service';
import { routes } from './../routes';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, RouterEvent  } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

import { ShowHidePasswordModule} from 'ngx-show-hide-password';
import { AppComponent } from './app.component';
import { NavComponent } from './share/nav/nav.component';
import { HomeComponent } from './home/home.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { IndexComponent } from './index/index.component';
import { ImageDetailComponent } from './image-detail/image-detail.component';
import { AccountSettingComponent } from './settings/account-setting/account-setting.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SettingDetailComponent } from './settings/setting-detail/setting-detail.component';
import { AccountSettingDetailComponent } from './settings/account-setting-detail/account-setting-detail.component';
import { NotificationSettingComponent } from './settings/notification-setting/notification-setting.component';
import { PrivacySettingComponent } from './settings/privacy-setting/privacy-setting.component';
import { CardColumnsImageComponent } from './card-columns-image/card-columns-image.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { NavHomeComponent } from './share/nav-home/nav-home.component';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    IndexComponent,
    ImageDetailComponent,
    AccountSettingComponent,
    SettingDetailComponent,
    AccountSettingDetailComponent,
    NotificationSettingComponent,
    PrivacySettingComponent,
    CardColumnsImageComponent,
    UserRegisterComponent,
    UserLoginComponent,
    NavHomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(routes),
    CarouselModule.forRoot(),
    TabsModule.forRoot(),
    MatTabsModule,
    ShowHidePasswordModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
