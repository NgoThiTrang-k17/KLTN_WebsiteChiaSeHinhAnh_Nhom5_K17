import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

import { Account } from '../../../_models';
import { AccountService, PresenceService, MessageService } from '../../../_services';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit {

  @ViewChild('messageForm') messageForm: NgForm;

  @Input() public userId: number;

  messageContent: string;

  public account = new Account;

  public messages: Message[] = [];

  public maccount = this.accountService.accountValue;

  constructor(
    private router : Router,
    public activeModal: NgbActiveModal,
    private accountService: AccountService,
    public presenceService: PresenceService,
    public messageService: MessageService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.accountService.getById(this.userId)
    .subscribe(res => {
      this.account = res;
    })

    this.messageService.messageThread$
    .pipe()
    .subscribe( messages=>{
    })

    if(this.messages.length == 0) {
      this.messageService.createHubConnection(this.maccount, this.userId);
    }else{
      this.messageService.stopHubConnection();
    }

  }

  closeChat() {
    this.activeModal.close();
  }

  sendMessage(){
    if(this.messageForm.invalid) return;

    this.messageService.sendMessage(this.userId, this.messageContent)
    .then(() =>{
      this.messageForm.reset();
    })
  }

}
