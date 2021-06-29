import { HttpClient } from '@angular/common/http';
import { Message } from '../_models/message';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
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
  //danh sach tin nhan cua tung nguoi
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();
  // Danh sanh nguoi dang nhan tin 
  private userMessageSource = new BehaviorSubject<Message[]>([]);
  userMessages$ = this.userMessageSource.asObservable();

  constructor(private http:HttpClient) { }

  createHubConnection(user :User, otherUserId : number){
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl +'message?userId=' + otherUserId, {
      accessTokenFactory: () => user.jwtToken
    })
    .withAutomaticReconnect()
    .build()
    this.hubConnection.start().catch(error=> console.log());
    //danh sach tin nhan cua tung nguoi
    this.hubConnection.on('ReceiveMessageThread', messages =>{
      this.messageThreadSource.next(messages);
    })

    // Danh sanh nguoi dang nhan tin 
    this.hubConnection.on('ReceiveUserMessages', messages =>{
      this.userMessageSource.next(messages);
      console.log(this.userMessageSource.value);
    })

    this.hubConnection.on('NewMessage', message =>{
      //danh sach tin nhan cua tung nguoi
      this.messageThread$.pipe(take(1)).subscribe(messages=>{
        this.messageThreadSource.next([...messages, message])

       
            
      })
      // Danh sanh nguoi dang nhan tin 
      this.userMessages$.pipe(take(1)).subscribe(messages=>{
        this.userMessageSource.next([...messages.filter(m =>
          (m.recipientId + m.senderId ) !== (message.recipientId + message.senderId)), message]);
          console.log(message);
          
          console.log(this.userMessageSource.value);
      })
      //
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
