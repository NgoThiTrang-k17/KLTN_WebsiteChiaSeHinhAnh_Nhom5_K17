import { HttpClient } from '@angular/common/http';
import { Message } from '../_models/message';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, getPaginationHeader as getPaginationHeaders } from './paginationHelper';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Group } from '../_models/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  private messageSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();
  messages$ = this.messageSource.asObservable();

  constructor(private http:HttpClient) { }

  createHubConnection(user :User, otherUserId : number){
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl +'message?userId=' + otherUserId, {
      accessTokenFactory: () => user.jwtToken
    })
    .withAutomaticReconnect()
    .build()
    console.log('Token ' + user.jwtToken);
    this.hubConnection.start().catch(error=> console.log());
    
    this.hubConnection.on('ReceiveMessageThread', messages =>{
      this.messageThreadSource.next(messages);
    })

    this.hubConnection.on('NewMessage', message=>{
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

  getMessages( ){
    //let params = getPaginationHeaders(pageNumber,pageSize);
    // params = params.append('Container', container);
    //console.log(params);
    return this.http.get<Message[]>(this.baseUrl + 'Messages');
  }

  getMessageThread(userId: number){
    return this.http.get<Message[]>(this.baseUrl+'Messages/thread/'+userId)
  }
  async sendMessage(userId: number, content: string){
    return this.hubConnection.invoke('SendMessage', {recipientId: userId,content})
    .catch(error=> console.log(error));
    
  }

  deleteMessage(id:number){
    return this.http.delete(this.baseUrl+'Messages/'+ id)
  }
}
