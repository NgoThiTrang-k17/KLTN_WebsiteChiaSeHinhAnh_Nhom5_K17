import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AccountService, NotificationService, SearchService, FollowService } from '../_services';
import { Account, Notification, NotificationToUpdate, Post, Follow, FollowToCreate } from '../_models';

@Component({
    templateUrl: 'layout.component.html',
    styleUrls: ['layout.component.css']
})
export class LayoutComponent implements OnInit {
  account: Account;
  temp: any;
  login: boolean;

  maccount = this.accountService.accountValue;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute
  ) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  ngOnInit() {
    console.log(this.maccount.avatarPath);
    this.accountService.getById(this.maccount.id)
    .subscribe((res:any)=>{
      this.account = res;
      console.log(this.account.avatarPath);
    })
  }

  logout() {
    this.accountService.logout();
  }

  goUser(){
    this.router.navigate(['user'], { relativeTo: this.route });
  }
}
