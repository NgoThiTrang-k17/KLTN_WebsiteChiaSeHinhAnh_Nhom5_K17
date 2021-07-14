/* eslint-disable no-trailing-spaces */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Post } from '../../_models';
import { AccountService, PostService, DataService } from '../../_services';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  @Output() searchCategori = new EventEmitter<boolean>();

  path: string;

  public posts: Post[] = [];
  public postsPopular: Post[] = [];

  maccount = this.accountService.accountValue;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private postService: PostService,
    private dataService: DataService,
  ) {};

  ngOnInit(){
    this.searchCategori.emit(false);
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
  };

  starSearch(query: string) {
    this.router.navigate(['tab/tabs/search/result/'+ query]);
    localStorage.removeItem('path');
    this.path = 'tab/tabs/search/result/'+ query;
    localStorage.setItem('path', this.path);
    this.dataService.setData('true');
    this.searchCategori.emit(true);
  }
}
