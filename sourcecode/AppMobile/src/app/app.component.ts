import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Account } from './_models';
import { AccountService, NotificationService, PresenceService, AuthService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  account: Account = this.accountService.accountValue;;
  users: any;

  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private presenceService: PresenceService,
    public notificationService: NotificationService,
  ) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  ngOnInit(){
    this.users = localStorage.getItem('account');
    this.presenceService.createHubConnection(this.accountService.accountValue);
  }

  logout() {
    this.accountService.logout();
  }

  auth = () => this.authService.loggedin();
}
