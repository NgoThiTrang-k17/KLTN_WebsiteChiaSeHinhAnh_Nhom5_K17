import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { from } from 'rxjs';

import { Account, Post, Follow, FollowToCreate } from '../../../_models';
import { AccountService, SearchService, FollowService } from '../../../_services';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.less']
})
export class SearchResultComponent implements OnInit {

  public query: string;
  public searchAccount: boolean;

  public follow: FollowToCreate;
  public account: Account;

  public accounts: Account[] = [];
  public posts: Post[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private searchService: SearchService,
    private followService: FollowService,
  ) {
    this.accountService.account.subscribe(x => this.account = x);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.query = this.route.snapshot.params['query'];
    if(this.query.substr(0,1)=='@')
    {
        this.searchAccount = true;
        this.searchService.getAllAccount(this.query)
        .subscribe(res => {
            this.accounts = res as Account[];
        });
    }
    else if(this.query.substr(0,1)!='@'){
        this.searchService.getAllPost(this.query)
        .subscribe(res => {
            this.posts = res as Post[];
        });
    }
  }

  onCreateFollow(id:any) {
    this.follow = {
      subjectId: id,
    }
    console.log(this.follow);
    this.followService.createFollow(this.follow)
    .subscribe(res => {
      //alert('Follow thành công!');
      this.searchService.getAllAccount(this.query)
        .subscribe(res => {
            this.accounts = res as Account[];
        });
    });
  }

  unFollow(id:any) {
    this.followService.delete(id)
    .subscribe(() => {
      //alert('Bỏ follow thành công!');
      this.searchService.getAllAccount(this.query)
        .subscribe(res => {
            this.accounts = res as Account[];
        });
    });
  }

}
