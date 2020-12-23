import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AccountService } from '../_services';
import { Account, Role } from '../_models';

@Component({ templateUrl: 'subnav.component.html' })
export class SubNavComponent { 
    account: Account;
    temp: any;
    login: boolean;

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute) {
        this.accountService.account.subscribe(x => this.account = x);
    }

    logout() {
        this.accountService.logout();
    }
}