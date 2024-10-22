import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatTabsModule } from '@angular/material/tabs';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
import { SearchResultComponent } from './search/search-result/search-result.component';
import { ChatComponent } from './message/chat/chat.component';
import { ReportComponent } from './report/report.component';
import { EditPostDialogComponent } from './detail-post/edit-post-dialog/edit-post-dialog.component';
import { CommentsPostComponent } from './detail-post/comments-post/comments-post.component';
import { ReplyCommentsPostComponent } from './detail-post/reply-comments-post/reply-comments-post.component';
import { DateAgoExaple } from '../_shareModule/dateAgoExample';

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
    MatRadioModule,
    MatSlideToggleModule
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
    SearchResultComponent,
    ChatComponent,
    ReportComponent,
    EditPostDialogComponent,
    CommentsPostComponent,
    ReplyCommentsPostComponent,
    DateAgoExaple
  ],
  providers: [
    // TimeagoIntl
  ]
})
export class UserModule { }
