import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, finalize } from 'rxjs/operators';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

import { environment } from '@environments/environment';
import { Notification, Account } from '@app/_models';

const baseUrl = `${environment.apiUrl}/notification`;

@Injectable({ providedIn: 'root' })
export class NotificationService {

  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private notificationThreadSource = new BehaviorSubject<Notification[]>([]);
  notificationThread$ = this.notificationThreadSource.asObservable();

  constructor(
      private router: Router,
      private http: HttpClient
  ) {}

  createHubConnention(user: Account){
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl +'notification', {
      accessTokenFactory: () => user.jwtToken
    })
    .withAutomaticReconnect()
    .build()

    this.hubConnection
    .start()
    .catch(error=> console.log(error));

    this.hubConnection.on('ReceiveNotificationThread', notifications =>{
      console.log("1"+notifications);

      this.notificationThreadSource.next(notifications);
    })

    this.hubConnection.on('NewNotification', notification=>{
      console.log("2"+notification);

      this.notificationThread$.pipe(take(1)).subscribe(notifications=>{
        this.notificationThreadSource.next([...notifications, notification])
      })
    })
  }

  stopHubConnection(){
    if(this.hubConnection){
      this.hubConnection.stop();
      console.log('Hub Closed');
    }
  }

  getAll():Observable<Notification[]> {
      return this.http.get<Notification[]>(baseUrl);
  }

  getPostById(id):Observable<Notification[]> {
      return this.http.get<Notification[]>(`${baseUrl}/GetPostById/${id}`);
  }

  getAllByUserId(id:number):Observable<Notification[]> {
      return this.http.get<Notification[]>(`${baseUrl}/GetAllByUserId/${id}`);
  }

  getNotificationCount(id:number):Observable<Notification> {
      return this.http.get<Notification>(`${baseUrl}/NewNotificationCount/${id}`);
  }

  delete(id: number) {
      return this.http.delete(`${baseUrl}/${id}`)
  }

  update(id, params) {
      return this.http.put(`${baseUrl}/${id}`, params)
  }

  // createPost(posts) {
  //     const formData: FormData = new FormData();
  //     formData.append('postTitle', posts.postTitle)
  //     if (posts.imagePath)
  //     {
  //         formData.append('dbPath', posts.imagePath)
  //     }
  //     return this.http.post(baseUrl, formData);
  // }

}
