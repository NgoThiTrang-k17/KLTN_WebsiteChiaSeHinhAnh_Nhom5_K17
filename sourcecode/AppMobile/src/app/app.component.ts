import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Account } from './_models';
import { AccountService, PresenceService, AuthService } from './_services';

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
    private presenceService:PresenceService
  ) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  ngOnInit(): void {
    this.presenceService.createHubConnection(this.account);
  }

  auth = () => {
    return this.authService.loggedin();
  }
}
