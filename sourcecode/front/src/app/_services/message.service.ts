import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Message, Account, Group } from '../_models';

const baseUrl = `${environment.apiUrl}/messages`;

@Injectable({ providedIn: 'root' })
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http:HttpClient) { }

  createHubConnection(user :Account, otherUserId : number){
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl +'message?userId=' + otherUserId, {
      accessTokenFactory: () => user.jwtToken
    })
    .withAutomaticReconnect()
    .build()
    console.log('Token ' + user.jwtToken);
    this.hubConnection.start().catch(error=> console.log());

    //danh sach tin nhan cua tung nguoi
    this.hubConnection.on('ReceiveMessageThread', messages =>{
      this.messageThreadSource.next(messages);
    })

    this.hubConnection.on('NewMessage', message=>{
      //danh sach tin nhan cua tung nguoi
      this.messageThread$.pipe(take(1)).subscribe(messages=>{
        this.messageThreadSource.next([...messages, message])
      })
    })
    this.hubConnection.on('UpdatedGroup',(group:Group) =>{
      if(group.connections.some(x=> x.userId === otherUserId)){
        this.messageThread$.pipe(take(1)).subscribe(messages=>{
          messages.forEach(message =>{
            if(!message.read){
              message.read= new Date(Date.now())
            }
          })
          this.messageThreadSource.next([...messages]);
        })
      }
    })
  }

  stopHubConnection(){
    if(this.hubConnection){
      this.hubConnection.stop();
      console.log('Hub Closed');

    }
  }

  getMessages() {
    return this.http.get<Message[]>(baseUrl);
  }

  getMessageThread(userId: number):Observable<Message[]> {
    return this.http.get<Message[]>(`${baseUrl}/thread/${userId}`);
  }

  async sendMessage(userId: number, content: string){
    return this.hubConnection.invoke('SendMessage', {recipientId: userId,content})
    .catch(error=> console.log(error));
  }

  deleteMessage(id:number){
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
