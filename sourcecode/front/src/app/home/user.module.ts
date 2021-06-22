import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatTabsModule } from '@angular/material/tabs';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { NavHomeComponent } from './navhome.component';
import { UserRoutingModule } from './user-routing.module';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home.component';
import { AddEditPostComponent } from './add-edit-post/add-edit-post.component';
import { DetailPostComponent } from './detail-post/detail-post.component';
import { TabsOverviewComponent } from './detail-post/tabs-overview.component';
import { ProfileModule } from './profile/profile.module';
import { SearchComponent } from './search/search.component';
import { MessageComponent } from './message/message.component';

@NgModule({
    imports: [
        CommonModule,
        UserRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule.forRoot(),
        MatTabsModule,
        TabsModule.forRoot(),
        ProfileModule,
        AngularFireModule.initializeApp({
            apiKey: "AIzaSyAD6FMqMf0DSIHhcg22zoihBCxmYHvC_Og",
            authDomain: "kltn-websitechiasehinhanh.firebaseapp.com",
            projectId: "kltn-websitechiasehinhanh",
            storageBucket: "kltn-websitechiasehinhanh.appspot.com",
            messagingSenderId: "505653862664",
            appId: "1:505653862664:web:258fb90458859a842b8cbd",
            measurementId: "G-4DJ7TDJKGG"
        }),
        AngularFireStorageModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
    declarations: [
        HomeComponent,
        NavHomeComponent,
        LayoutComponent,
        AddEditPostComponent,
        DetailPostComponent,
        TabsOverviewComponent,
        SearchComponent,
        MessageComponent,
    ]
})
export class UserModule { }