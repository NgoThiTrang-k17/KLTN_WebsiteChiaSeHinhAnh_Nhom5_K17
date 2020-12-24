import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AccountRoutingModule } from './account-routing.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { VerifyEmailComponent } from './verify-email.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ResetPasswordComponent } from './reset-password.component';
import { NavComponent } from './nav.component';
import { from } from 'rxjs';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule,
        CarouselModule.forRoot()
    ],
    declarations: [
        LayoutComponent,
        LoginComponent,
        RegisterComponent,
        VerifyEmailComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        NavComponent
    ]
})
export class AccountModule { }