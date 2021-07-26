/* eslint-disable no-trailing-spaces */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { ChatPage } from './chat/chat.page';
import { Account, Message } from '../_models';
import { PresenceService, AccountService, SearchService, MessageService } from '../_services';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  @ViewChild('inputSearch') inputSearch;

  public accounts: Account[] = [];
  public messages: Message[] = [];

  search = false;

  account = this.accountService.accountValue;

  constructor(
    public modalController: ModalController,
    public presenceService: PresenceService,
    public accountService: AccountService,
    private searchService: SearchService,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.search = false;

    console.log(this.account);

    this.presenceService.userMessages$
    .pipe()
    .subscribe(res => {
      console.log(res);
    });
  }

  updateStatus(id: number, read: Date){
    this.presenceService.updateMessageStatus(id,read);
  }

  async openModalChat(id: number) {
    console.log(id);


    const modal = await this.modalController.create({
      component: ChatPage,
      cssClass: 'my-custom-class',
      componentProps: {
        accountId: id
      }
    });

    modal.onDidDismiss().then(()=>{

    });

    return await modal.present();
  }

  startSearch(event) {
    const str = event.target.value;
    if(str==='') { return; }

    this.searchService.getAccountForMessage(str)
    .subscribe(res => {
      this.accounts = res as Account[];
    });
  }

  onSearch() {
    this.search = true;
    setTimeout(()=>{
      this.inputSearch.setFocus();
    },150);
  }

  unSearch() {
    this.search = false;
  }
}
