/* eslint-disable @typescript-eslint/quotes */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
// import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';

import { Tab5PageRoutingModule } from './tab5-routing.module';
import { Tab5Page } from './tab5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab5PageRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyAD6FMqMf0DSIHhcg22zoihBCxmYHvC_Og",
      authDomain: "kltn-websitechiasehinhanh.firebaseapp.com",
      projectId: "kltn-websitechiasehinhanh",
      storageBucket: "kltn-websitechiasehinhanh.appspot.com",
      messagingSenderId: "505653862664",
      appId: "1:505653862664:web:258fb90458859a842b8cbd",
      measurementId: "G-4DJ7TDJKGG"
    }),
    // AngularFireStorageModule,
  ],
  declarations: [
    Tab5Page,
  ],
  providers: [
    FileTransfer
  ]
})
export class Tab5PageModule {}
