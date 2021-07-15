import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { ChatPage } from './chat/chat.page';
import { DateAgoExaple } from './dateAgoExample';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    TimeagoModule.forRoot(),
  ],
  exports: [
    TimeagoModule
  ],
  declarations: [
    Tab2Page,
    ChatPage,
    DateAgoExaple
  ]
})
export class Tab2PageModule {}
