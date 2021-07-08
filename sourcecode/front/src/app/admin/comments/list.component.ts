import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { AccountService, PostService, CommentService } from '@app/_services';
import { Account, Post, Comment } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  account = new Account;
  comments: Comment[] = [];
  public post: Post;

  constructor(
    private accountService: AccountService,
    private postService: PostService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      lengthMenu : [5, 10, 25, 50, 75, 100],
      processing: true
    };

    this.commentService.getAll()
    .pipe(first())
    .subscribe(res => {
      this.comments = res as Comment[];
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  deleteComment(id: number) {
    var r = confirm("Are you sure you want to delete this comment?");
    if(r)
    {
      try {
        const comment = this.comments.find(x => x.id === id);
        // comment.isDeleting = true;
        this.commentService.delete(id)
        .pipe(first())
        .subscribe(() => {
          this.comments = this.comments.filter(x => x.id !== id)
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
}
