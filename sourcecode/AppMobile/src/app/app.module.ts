/* eslint-disable @typescript-eslint/quotes */
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';

import { JwtInterceptor, ErrorInterceptor, appInitializer } from './_helpers';
import { AccountService } from './_services';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddEditPostComponent } from './components-share/add-edit-post/add-edit-post.component';
import { EditProfileComponent } from './components-share/edit-profile/edit-profile.component';
import { UpdateAvatarComponent } from './components-share/update-avatar/update-avatar.component';
import { ListFollowComponent } from './components-share/list-follow/list-follow.component';
import { ReportComponent } from './components-share/report/report.component';

@NgModule({
  declarations: [
    AppComponent,
    AddEditPostComponent,
    EditProfileComponent,
    UpdateAvatarComponent,
    ListFollowComponent,
    ReportComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyAD6FMqMf0DSIHhcg22zoihBCxmYHvC_Og",
      authDomain: "kltn-websitechiasehinhanh.firebaseapp.com",
      projectId: "kltn-websitechiasehinhanh",
      storageBucket: "kltn-websitechiasehinhanh.appspot.com",
      messagingSenderId: "505653862664",
      appId: "1:505653862664:web:258fb90458859a842b8cbd",
      measurementId: "G-4DJ7TDJKGG"
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
