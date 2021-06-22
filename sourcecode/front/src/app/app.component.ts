import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/_auth.service';
import { ActivatedRoute } from '@angular/router';

import { AccountService, PresenceService, NotificationService } from './_services';
import { Account, Role } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
    Role = Role;
    account: Account;
    temp: any;
    login: boolean;

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
      this.presenceService.createHubConnection(this.accountService.accountValue);
    }

    logout() {
        this.accountService.logout();
    }

    auth = () => {
        return this.authService.loggedin();
    }
}
