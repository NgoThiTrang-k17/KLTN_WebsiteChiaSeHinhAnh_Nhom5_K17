import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DataTablesModule } from 'angular-datatables';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';

import { AdminRoutingModule } from './admin-routing.module';
import { SubNavComponent } from './subnav.component';
import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    BsDropdownModule,
    DataTablesModule,
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
  ],
  exports:[
    DataTablesModule,
  ],
  declarations: [
    SubNavComponent,
    LayoutComponent,
    OverviewComponent
  ]
})
export class AdminModule { }
