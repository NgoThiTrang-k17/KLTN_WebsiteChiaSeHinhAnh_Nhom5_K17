import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { GoogleLoginProvider, FacebookLoginProvider, SocialAuthService} from 'angularx-social-login';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { AccountRoutingModule } from './account-routing.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { VerifyEmailComponent } from './verify-email.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ResetPasswordComponent } from './reset-password.component';
import { NavComponent } from './nav.component';
import { from } from 'rxjs';

const fbLoginOptions = {
    scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages',
    // return_scopes: true,
    // enable_profile_selector: true
}; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11
  
const googleLoginOptions = {
    scope: 'profile email'
};
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule,
        CarouselModule.forRoot(), 
        SocialLoginModule
    ],
    declarations: [
        LayoutComponent,
        LoginComponent,
        RegisterComponent,
        VerifyEmailComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        NavComponent
    ],
    providers: [
        {
          provide: 'SocialAuthServiceConfig',
          useValue: {
            autoLogin: false,
            providers: [
              {
                id: GoogleLoginProvider.PROVIDER_ID,
                provider: new GoogleLoginProvider(
                  '436549259873-fvlvlseej8bo4d9ro7uism91nkol8vc0.apps.googleusercontent.com', googleLoginOptions
                )
              },
              {
                id: FacebookLoginProvider.PROVIDER_ID,
                provider: new FacebookLoginProvider('158138146280361')
              }
            ]
          } as SocialAuthServiceConfig,
        }
    ],
})
export class AccountModule { }