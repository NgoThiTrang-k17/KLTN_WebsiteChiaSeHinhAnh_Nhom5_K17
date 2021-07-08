/* eslint-disable @typescript-eslint/quotes */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";

import { Account, Message } from '../../_models';
import { AccountService, PresenceService, MessageService } from '../../_services';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild('messageForm') messageForm: NgForm;

  accountId: number;
  messageContent: string;

  account = new Account();

  public messages: Message[] = [];

  maccount = this.accountService.accountValue;

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public accountService: AccountService,
    public presence: PresenceService,
    public messageService: MessageService,
    private router: Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    console.log(this.navParams);
    this.accountId = this.navParams.data.accountId;

    this.accountService.getById(this.accountId)
    .subscribe((res: any)=>{
      this.account = res;
    });

    // this.loadMessages(this.accountId);
    this.messageService.messageThread$
    .pipe()
    .subscribe( messages=>{
      console.log(messages);
    });

    console.log(this.messages.length);

    if(this.messages.length === 0) {
      this.messageService.createHubConnection(this.maccount, this.accountId);
    }else{
      this.messageService.stopHubConnection();
    }
  }

  loadMessages(id){
    this.messageService.getMessageThread(id).
    subscribe(res=>{
      this.messages = res;
    });
  }

  closeModalChat() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  sendMessage(){
    this.messageService.sendMessage(this.accountId, this.messageContent)
    .then(() =>{
      this.messageForm.reset();
    });
  }

}
