import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { count } from 'rxjs-compat/operator/count';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Account, Notification, Message } from '../_models';
import { AccountService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl= environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<number[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  public notificationThreadSource = new BehaviorSubject<Notification[]>([]);
  notificationThread$ = this.notificationThreadSource.asObservable();

  private userMessageSource = new BehaviorSubject<Message[]>([]);
  userMessages$ = this.userMessageSource.asObservable();
  unreadMessage$ = this.userMessageSource.asObservable();

  countNewMess = 0;
  // maccount = this.accountService.accountValue;

  constructor(
    private router: Router,
    // private accountService: AccountService,
  ) { }

  createHubConnection(user: Account) {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl+'presence',{
      accessTokenFactory: () =>user.jwtToken
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

    this.hubConnection.on('ReceiveNotificationThread', notifications =>{
      this.notificationThreadSource.next(notifications);
    })

    this.hubConnection.on('NewNotification', notification=>{
      this.notificationThread$.pipe(take(1)).subscribe(notifications=>{
       this.notificationThreadSource.next([...notifications, notification])
      })
    })

    // Danh sanh nguoi dang nhan tin
    this.hubConnection.on('ReceiveUserMessages', messages =>{
      this.userMessageSource.next(messages);
    })

    this.hubConnection.on('NewMessageReceived', message=>{
      // Danh sanh nguoi dang nhan tin
      this.userMessages$.pipe(take(1)).subscribe(messages=>{
        this.userMessageSource.next([...messages.filter(m =>
          (m.recipientId + m.senderId ) !== (message.recipientId + message.senderId)), message]);
      })
      this.unreadMessage$.pipe(take(1)).subscribe(messages=>{
        this.userMessageSource.next([...messages.filter(m => m.read == null), message]);

      })
      this.countNewMessage();
      console.log(this.userMessageSource);

    })

    // this.hubConnection.on('NewMessageReceived', ({userId, name})=>{
    //   this.toastr.info(name+ 'has send you a message!')
    //   .onTap
    //   .pipe(take(1))
    //   .subscribe(() => this.router.navigateByUrl('/members/'+ userId +'?Tab=1'));
    // })
  }

  stopHubConnection(){
    this.hubConnection.stop().catch(error=> console.log(error));
  }

  updateNotificationStatus(id: number) {
    const menuItemsUpdated = this.notificationThreadSource.getValue().map((item) => {
      if(item.id === id) {
        return {...item, status: 2};
      }
      return item;
    });
    if(this.countNewMess != 0){
      return this.countNewMess--;
    }

    this.notificationThreadSource.next(menuItemsUpdated);
  }

  updateMessageStatus(id: number) {
    const menuItemsUpdated = this.userMessageSource.getValue().map((item) => {
      if(item.id === id) {
        return {...item, read: new Date(Date.now())};
      }
      return item;
    });
    this.userMessageSource.next(menuItemsUpdated);
  }

  resetCountNewMess() {
    this.countNewMess = 0;
  }

  public countNewMessage(){
    const newMess = this.userMessageSource.getValue().filter(m => m.read == null);
    this.countNewMess = newMess.length;
    console.log(newMess.length);

    return this.countNewMess;
  }
}
