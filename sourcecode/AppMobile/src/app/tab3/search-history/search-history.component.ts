/* eslint-disable no-trailing-spaces */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {  } from '../../_models';
import { AccountService, SearchService } from '../../_services';

@Component({
  selector: 'app-search-history',
  templateUrl: './search-history.component.html',
  styleUrls: ['./search-history.component.scss'],
})
export class SearchHistoryComponent implements OnInit {

  path: string;

  public historySearchs: string[];

  maccount = this.accountService.accountValue;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private searchService: SearchService,
  ) { }

  ngOnInit() {
    // Lịch sử
    this.searchService.getHistorySearch(this.maccount.id)
    .subscribe(res => {
      console.log(res);
      this.historySearchs = res;
    });
  };

  startSearch(query: string) {
    this.router.navigate(['tab/tabs/search/result/'+ query]);
    localStorage.removeItem('path');
    this.path = 'tab/tabs/search/result/'+ query;
    localStorage.setItem('path', this.path);
  }

}
