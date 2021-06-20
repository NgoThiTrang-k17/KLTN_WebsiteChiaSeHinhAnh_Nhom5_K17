import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from "@angular/router";

import { ChatPage } from './chat/chat.page';
import { Account, Message } from '../_models';
import { PresenceService, AccountService, SearchService, MessageService } from '../_services';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  public accounts: Account[] = [];
  public messages: Message[] = [];

  search = false;

  account = this.accountService.accountValue;;

  constructor(
    public modalController: ModalController,
    public presence: PresenceService,
    public accountService: AccountService,
    private searchService: SearchService,
    private messageService: MessageService,
    private router : Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.search = false;

    this.messageService.getMessages()
    .subscribe(res => {
      this.messages = res as Message[];
    });
  }

  async openModalChat(id: number) {
    console.log(id);


    const modal = await this.modalController.create({
      component: ChatPage,
      cssClass: 'my-custom-class',
      componentProps: {
        "accountId": id
      }
    });

    modal.onDidDismiss().then(()=>{
      this.messageService.getMessages()
      .subscribe(res => {
        this.messages = res as Message[];
      });
    });

    return await modal.present();
  }

  onSearch(event) {
    var str = event.target.value;
    if(str=='') { return; }
    this.search = true;
    this.searchService.getAccountForMessage(str)
    .subscribe(res => {
        this.accounts = res as Account[];
    });
  }

  unSearch() {
    this.search = false;
  }
}
