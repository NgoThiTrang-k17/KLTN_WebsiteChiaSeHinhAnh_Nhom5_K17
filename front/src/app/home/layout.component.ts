import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AccountService } from '../_services';
import { Account, Role } from '../_models';

@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent implements OnInit { 

    account: Account;
    temp: any;
    login: boolean;

    constructor(private accountService: AccountService, private activatedRoute: ActivatedRoute) {
        this.accountService.account.subscribe(x => this.account = x);
    }

    ngOnInit() {
        this.accountService.getById(this.account.id)
        .subscribe((res:any)=>{
            this.account = res;
        })
    }

    logout() {
        this.accountService.logout();
    }

    public createImgPath = (serverPath: string) => {
        return `http://localhost:5000/${serverPath}`;
    }
}