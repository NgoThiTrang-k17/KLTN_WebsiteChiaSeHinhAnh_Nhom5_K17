import { Component } from '@angular/core';
import { AuthService } from './_services/_auth.service';
import { ActivatedRoute } from '@angular/router';

import { AccountService } from './_services';
import { Account, Role } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    Role = Role;
    account: Account;
    temp: any;
    login: boolean;

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute, private authService: AuthService) {
        this.accountService.account.subscribe(x => this.account = x);
    }

    logout() {
        this.accountService.logout();
    }

    auth = () => {
        return this.authService.loggedin();
    }
}