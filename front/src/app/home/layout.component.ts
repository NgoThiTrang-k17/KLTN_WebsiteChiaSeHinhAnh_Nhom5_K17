import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AccountService, NotificationService } from '../_services';
import { Account, Notification } from '../_models';

@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent implements OnInit { 

    account: Account;
    temp: any;
    login: boolean;

    public notifications: Notification[] = [];

    constructor(private accountService: AccountService, private notificationService: NotificationService ,private activatedRoute: ActivatedRoute) {
        this.accountService.account.subscribe(x => this.account = x);
    }

    ngOnInit() {
        this.accountService.getById(this.account.id)
        .subscribe((res:any)=>{
            this.account = res;
        })

        this.notificationService.getAll()
            .subscribe(res => {
                this.notifications = res as Notification[];
        });
    }

    logout() {
        this.accountService.logout();
    }

    public createImgPath = (serverPath: string) => {
        return `http://localhost:5000/${serverPath}`;
    }
}