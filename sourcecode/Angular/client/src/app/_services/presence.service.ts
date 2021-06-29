import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Notification } from '../_models/notification';
import { Message } from '../_models/message';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl= environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<number[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();
  private notiThreadSource = new BehaviorSubject<Notification[]>([]);
  notiThread$ = this.notiThreadSource.asObservable();
    // Danh sanh nguoi dang nhan tin 
    private userMessageSource = new BehaviorSubject<Message[]>([]);
    userMessages$ = this.userMessageSource.asObservable();

  

  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl+'presence',{
      accessTokenFactory: () => user.jwtToken
    })
    .withAutomaticReconnect()
    .build()

    this.hubConnection
    .start()
    .catch(error=> console.log(error));
    
    this.hubConnection.on('UserIsOnline', userId=>{
       this.onlineUsers$.pipe(take(1)).subscribe(userIds=>{
         this.onlineUsersSource.next([...userIds, userId])
       })
    })
    this.hubConnection.on('UserIsOffline', userId =>{
      this.onlineUsers$.pipe(take(1)).subscribe(userIds=>{
        this.onlineUsersSource.next([...userIds.filter(x=> x!= userId)])
      })
    })

    this.hubConnection.on('GetOnlineUsers', (userIds: number[])=>{
      this.onlineUsersSource.next(userIds);
    })

    // Danh sanh nguoi dang nhan tin 
    this.hubConnection.on('ReceiveUserMessages', messages =>{
      this.userMessageSource.next(messages);
      console.log(this.userMessageSource.value);
    })
    this.hubConnection.on('NewMessageReceived', message =>{
       // Danh sanh nguoi dang nhan tin 
      this.userMessages$.pipe(take(1)).subscribe(messages=>{
        this.userMessageSource.next([...messages.filter(m =>
          (m.recipientId + m.senderId ) !== (message.recipientId + message.senderId)), message]);
          console.log(message);
          
          console.log(this.userMessageSource.value);
      })
    })

    this.hubConnection.on('ReceiveNotificationThread', notifications =>{
      
      var array = [notifications].reverse();
      this.notiThreadSource.next(array);
    })
    this.hubConnection.on('NewNotification', notification=>{
      console.log(notification);
      this.notiThread$.pipe(take(1)).subscribe(notifications=>{
       
       this.notiThreadSource.next([...notifications, notification])
       console.log(this.notiThreadSource.value);
      }) 
     })
  }

  stopHubConnection(){
    this.hubConnection.stop().catch(error=> console.log(error));
  }
}
