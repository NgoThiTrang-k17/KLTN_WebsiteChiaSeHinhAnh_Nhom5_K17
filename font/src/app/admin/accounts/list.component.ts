import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { AccountService } from '@app/_services';
import { Account } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    accounts: any[];
    
    constructor(private accountService: AccountService) {}

    ngOnInit() {

        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => this.accounts = accounts);
    }

    deleteAccount(id: number) {
        var r = confirm("Are you sure you want to delete this account?");
        if(r)
        {
            try {
                const account = this.accounts.find(x => x.id === id);
                account.isDeleting = true;
                this.accountService.delete(id)
                    .pipe(first())
                    .subscribe(() => {
                        this.accounts = this.accounts.filter(x => x.id !== id) 
                    });
            } catch (e) {
                console.log(e);
            }
        }
        
    }
}