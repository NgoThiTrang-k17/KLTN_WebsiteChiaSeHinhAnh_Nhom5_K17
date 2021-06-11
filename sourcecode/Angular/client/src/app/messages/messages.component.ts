import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
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

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessage();
  }

  loadMessage(){
    this.loading =true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response=>{
      this.messages = response.result;
      this.pagination = response.pagination;
      console.log(this.messages);
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
