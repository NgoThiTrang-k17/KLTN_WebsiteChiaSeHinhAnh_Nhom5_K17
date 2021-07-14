/* eslint-disable no-trailing-spaces */
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { Post } from '../_models';
import { AccountService, PostService } from '../_services';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  @ViewChild('inputSearch') inputSearch;
  @Input() searchCategori: boolean;

  public search: boolean;
  str: string;
  path: string;
  data: string;
  query: string;

  public posts: Post[] = [];
  public postsPopular: Post[] = [];

  maccount = this.accountService.accountValue;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private postService: PostService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.search = false;

    // Đề xuất cho người dùng
    this.postService.getSuggestionById(this.maccount.id)
    .subscribe(res => {
      this.posts = res as Post[];
    });

    // Chủ đề phổ biến trong hệ thống
    this.postService.getSuggestion()
    .subscribe(res => {
      this.postsPopular = res as Post[];
    });

    localStorage.removeItem('path');
    localStorage.removeItem('pathPost');
  }

  onSearch() {
    this.search = true;
    this.router.navigate(['history'], { relativeTo: this.route });
    setTimeout(()=>{
      this.inputSearch.setFocus();
    },150);
  };

  unSearch() {
    this.search = false;
    this.router.navigate(['tab/tabs/search']);
    localStorage.removeItem('search');
  };

  starSearch(event) {
    if(this.str==='') { return; }
    this.str = event.target.value;
    this.router.navigate(['result/'+ this.str], { relativeTo: this.route });
    localStorage.removeItem('path');
    this.path = 'tab/tabs/search/result/'+ this.str;
    localStorage.setItem('path', this.path);
  }

  starSearchCate(query: string) {
    this.search = true;
    this.router.navigate(['tab/tabs/search/result/'+ query]);
    localStorage.removeItem('path');
    this.path = 'tab/tabs/search/result/'+ query;
    localStorage.setItem('path', this.path);
  }
}
