import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AccountService, SearchService, PostService } from '../../_services';
import { Account, Notification, Post } from '../../_models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']})
export class SearchComponent implements OnInit{

  searchAccount = false;
  query:any;
  path: string;

  public accounts: Account[] = [];
  public posts: Post[] = [];
  public postsPopular: Post[] = [];

  public historySearchs: string[];

  maccount = this.accountService.accountValue;

  constructor(
    private accountService: AccountService,
    private searchService: SearchService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    // Lịch sử
    this.searchService.getHistorySearch(this.maccount.id)
    .subscribe(res => {
      console.log(res);
      this.historySearchs = res;
    })

    // Đề xuất cho người dùng
    this.postService.getSuggestionById(this.maccount.id)
    .subscribe(res => {
      this.posts = res as Post[];
    })

    // Chủ đề phổ biến trong hệ thống
    this.postService.getSuggestion()
    .subscribe(res => {
      this.postsPopular = res as Post[];
    })
  }

  search(query: string) {
    console.log(query);

    this.activeModal.close();

    if(this.maccount.role == 'User'){
      this.router.navigate(['user/search/'+ query]);
      localStorage.removeItem('path');
      this.path = 'user/search/'+ query;
      localStorage.setItem('path', this.path);
    } else if(this.maccount.role == 'Admin'){
      this.router.navigate(['admin/user/search/'+ query]);
      localStorage.removeItem('path');
      this.path = 'admin/user/search/'+ query;
      localStorage.setItem('path', this.path);
    }
  }

}
