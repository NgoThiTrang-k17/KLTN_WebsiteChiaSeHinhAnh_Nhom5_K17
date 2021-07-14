import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { IonicModule } from '@ionic/angular';

import { Tab4PageRoutingModule } from './tab4-routing.module';

import { Tab4Page } from './tab4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab4PageRoutingModule,
    TimeagoModule.forRoot(),
  ],
  declarations: [Tab4Page],
  providers: [
    FileTransfer
  ]
})
export class Tab4PageModule {}
