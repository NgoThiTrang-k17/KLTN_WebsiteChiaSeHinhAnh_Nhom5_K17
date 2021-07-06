import { Component, OnInit, OnDestroy } from '@angular/core';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AccountService } from '@app/_services';
import { Account } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  accounts: Account[] = [];

  maccount = this.accountService.accountValue;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu : [5, 10, 25],
      processing: true
    };

    this.accountService.getAll()
    .subscribe(res =>{
      this.accounts = res as Account[];
      this.dtTrigger.next();
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  deleteAccount(id: number) {
    var r = confirm("Are you sure you want to delete this account?");
    if(r)
    {
      try {
        const account = this.accounts.find(x => x.id === id);
        // account.isDeleting = true;
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
