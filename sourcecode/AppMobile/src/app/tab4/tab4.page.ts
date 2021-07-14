/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-trailing-spaces */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationToUpdate } from '../_models';
import { AccountService, PresenceService, NotificationService } from '../_services';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  notificationCount: number;

  notification = new NotificationToUpdate();

  maccount = this.accountService.accountValue;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    public presenceService: PresenceService,
    public notificationService: NotificationService,
  ){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    localStorage.removeItem('path');
    localStorage.removeItem('pathPost');

    this.presenceService.notificationThread$
    .subscribe(res =>{
      console.log(res);
    });
  }

  updateNotification(id: number, notificationType: number, postId: number, actionOwnerId: number){

    this.presenceService.updateNotificationStatus(id);

    this.notification = {
      status: 2,
    };

    this.notificationService.update(id ,this.notification)
    .subscribe(res => {
      // console.log(res);
      // alert('Xem thông báo thành công.');
      this.notificationService.getNotificationCount(this.maccount.id)
      .subscribe((res: any)=>{
        this.notificationCount = res;
      });
    }, error => {
      console.log(error);
    });

    const path = 'tab/tabs/notification';
    localStorage.setItem('path', path);

    if(notificationType === 0 || notificationType === 1){
      this.router.navigate(['detail/' + postId + '/' + actionOwnerId], { relativeTo: this.route });
    } else if(notificationType === 3){
      this.router.navigate(['account/' + this.maccount.id], { relativeTo: this.route });
    }
  }

}
