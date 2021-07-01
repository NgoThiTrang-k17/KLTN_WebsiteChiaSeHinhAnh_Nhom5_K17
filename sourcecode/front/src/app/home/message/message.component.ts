import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { Account, Message } from '../../_models';
import { SearchService, PresenceService, AccountService, MessageService } from '../../_services';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.less']
})
export class MessageComponent implements OnInit {

  @ViewChild('searchInput') searchElement: ElementRef;

  modalChatRef :any;

  public searchMess: boolean;

  public accounts: Account[] = [];
  public messages: Message[] = [];

  public maccount = this.accountService.accountValue;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private router: Router,
    private searchService: SearchService,
    private accountService: AccountService,
    private messageService: MessageService,
    public presenceService: PresenceService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.searchMess = false;

    this.presenceService.userMessages$
    .pipe()
    .subscribe(res => {
      console.log(res);

    })
    // this.messageService.getMessages()
    // .subscribe(res => {
    //   console.log(res);

    //   this.messages = res as Message[];
    // })
  }

  onSearchForMessage() {
    this.searchMess = true;
    setTimeout(()=>{
      this.searchElement.nativeElement.focus();
    },0);
  }

  closeSearch() {
    this.searchMess = false;
  }

  searchForMessage(event) {
    var str = event.target.value;
    if(str=='') { return; }
    this.searchService.getAccountForMessage(str)
    .subscribe(res => {
      this.accounts = res as Account[];
    })
  }

  updateStatus(id: number){
    this.presenceService.updateMessageStatus(id);
  }

  openChat(userId: number) {
    this.modalChatRef = this.modalService.open(ChatComponent, { windowClass: 'modalMess', backdropClass: 'backdropModalMess'});
    this.modalChatRef.componentInstance.userId = userId;
  }
}
