import { Component, OnInit } from '@angular/core';

import { Post } from '../_models/post';
import { PostService } from '../_services/post.service';

@Component({
  selector: 'app-tabHome',
  templateUrl: 'tabHome.page.html',
  styleUrls: ['tabHome.page.scss']
})
export class TabHomePage implements OnInit {

  public posts: Post[] = [];

  constructor(
    private postService: PostService,
  ) {}

  ngOnInit() {
    this.postService.getAll()
        .subscribe(res => {
            this.posts = res as Post[];
        });
  }

}
