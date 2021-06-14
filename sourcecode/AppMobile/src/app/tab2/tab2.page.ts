import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ChatPage } from './chat/chat.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    public modalController: ModalController,
  ) {}

  async openModalChat() {
    const modal = await this.modalController.create({
      component: ChatPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
}
