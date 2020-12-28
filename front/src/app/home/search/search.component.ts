import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService, NotificationService, SearchService } from '../../_services';
import { Account, Notification, Post } from '../../_models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',})
export class SearchComponent implements OnInit {

  searchAccount = false;
  query:any;

  public accounts: Account[] = [];
  public posts: Post[] = [];

  constructor(private accountService: AccountService,
              private searchService: SearchService, 
              private route: ActivatedRoute,
              private router: Router,) { }

  ngOnInit() {
    this.query = this.route.snapshot.params['query'];

    var str = this.query;
    console.log(str);
    if(str.substr(0,1)=='@')
    {
        this.searchAccount = true;
        this.searchService.getAllAccount(str)
        .subscribe(res => {
            this.accounts = res as Account[];
        });
    }
    else if(str.substr(0,1)!='@'){
        this.searchService.getAllPost(str)
        .subscribe(res => {
            this.posts = res as Post[];
        });
    }
    
  }

}
