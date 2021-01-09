import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatTabsModule } from '@angular/material/tabs';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { NavHomeComponent } from './navhome.component';
import { UserRoutingModule } from './user-routing.module';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home.component';
import { AddEditPostComponent } from './add-edit-post/add-edit-post.component';
import { DetailPostComponent } from './detail-post/detail-post.component';
import { ProfileModule } from './profile/profile.module';
import { SearchComponent } from './search/search.component';

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
    ],
    declarations: [
        HomeComponent,
        NavHomeComponent,
        LayoutComponent,
        AddEditPostComponent,
        DetailPostComponent,
        SearchComponent
    ]
})
export class UserModule { }