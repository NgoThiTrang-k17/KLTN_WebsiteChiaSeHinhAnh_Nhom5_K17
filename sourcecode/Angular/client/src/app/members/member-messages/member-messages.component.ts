import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
   @ViewChild('messageForm') messageForm: NgForm;
  @Input() messages: Message[];
  @Input() userId: number;
  messageContent: string;
  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.messageThread$.pipe().subscribe( messages=>{
      //console.log(messages);
    })
  }
  sendMessage(){
    this.messageService.sendMessage(this.userId, this.messageContent).then(() =>{
      
      this.messageForm.reset();
    })
  }
}
