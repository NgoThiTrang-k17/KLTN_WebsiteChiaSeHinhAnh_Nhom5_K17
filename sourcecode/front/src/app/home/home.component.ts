﻿import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { ReactionService, PostService, AccountService } from '@app/_services';
import { Post, ReactionToCreate } from '../_models';
import { ReportComponent } from './report/report.component';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  reaction: ReactionToCreate;

  public posts: Post[] = [];

  public maccount = this.accountService.accountValue;

  constructor(
    private router: Router,
    public dialogReport: MatDialog,
    private postService: PostService,
    private reactionService: ReactionService,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    localStorage.removeItem('path');

    this.postService.getAllByPreference(this.maccount.id)
    .subscribe(res => {
      this.posts = res as Post[];
    });
  }

  onCreateReaction(postId: number) {
    this.reaction = {
      targetId: postId,
    }
    // console.log(this.reaction);
    this.reactionService.createReaction(this.reaction)
    .pipe(first())
    .subscribe(res => {
      const post = this.posts.find((x: Post) => {
        if(x.id === postId){
          x.isReactedByThisUser = true;
          x.reactionCount++;
        }
      })
      this.posts = this.posts;
    });
  }

  unReaction(postId: number) {
    this.reactionService.deletePost(postId)
    .pipe(first())
    .subscribe(() => {
      const post = this.posts.find((x: Post) => {
        if(x.id === postId){
          x.isReactedByThisUser = false;
          x.reactionCount--;
        }
      })
      this.posts = this.posts;
    });
  }

  deletePost(id: number) {
    var r = confirm("Bạn có chắc chắn muốn xoá bài viết này?");
    if(r)
    {
        try {
            this.postService.delete(id)
            .subscribe(() => {
              this.router.navigate(['user']);
            });
          } catch (e) {
            console.log(e);
        }
    }
  }

  openReportDialog(postId: number): void{
    let dialogRef1 = this.dialogReport.open(ReportComponent,{
      width: '500px',
      minHeight: '200px',
      maxHeight:'600px',
      data: {
        targetId: postId,
        targetType: 1,
      }
    });
  }
}
