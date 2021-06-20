import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  container = 'Outbox';
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  currentUser : User;

  constructor(private messageService: MessageService,private accountService: AccountService) 
  { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.currentUser = user)
  }

  ngOnInit(): void {
    this.loadMessage();
  }

  loadMessage(){
    this.loading =true;
    this.messageService.getMessages().subscribe(messages=>{
      console.log(messages);
      
      this.messages = messages;
      this.loading = false;
    })
  }

  deleteMessage(id:number){
    this.messageService.deleteMessage(id).subscribe(()=> {
      this.messages.splice(this.messages.findIndex(m=> m.id === id), 1);
    })
  }

  pageChanged(event: any){
    this.pageNumber = event.page;
    this.loadMessage();
  }
}
