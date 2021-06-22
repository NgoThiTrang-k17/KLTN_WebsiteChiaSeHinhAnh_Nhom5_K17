import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Account, Notification } from '../_models';

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

  constructor(private router: Router) { }

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
      console.log('hub receive noti'+notifications);
      this.notificationThreadSource.next(notifications);
    })

    this.hubConnection.on('NewNotification', notification=>{
      console.log('hub new noti'+notification);
      this.notificationThread$.pipe(take(1)).subscribe(notifications=>{
       this.notificationThreadSource.next([...notifications, notification])
       console.log(this.notificationThreadSource.value);
      })
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
}
