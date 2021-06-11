import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl= environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<number[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(user: User) {
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
    this.hubConnection.on('NewMessageReceived', ({userId, name})=>{
      this.toastr.info(name+ 'has send you a message!')
      .onTap
      .pipe(take(1))
      .subscribe(() => this.router.navigateByUrl('/members/'+ userId +'?Tab=1'));
    })
  }

  stopHubConnection(){
    this.hubConnection.stop().catch(error=> console.log(error));
  }
}
