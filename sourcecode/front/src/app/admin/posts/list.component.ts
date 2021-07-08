import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { AccountService, PostService } from '@app/_services';
import { Account, Post } from '@app/_models';
import { EditPostDialogComponent } from './edit-post-dialog/edit-post-dialog.component';

@Component({
  templateUrl: 'list.component.html',
  styleUrls: ['./list.component.less'],
})
export class ListComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  account = new Account;
  posts: any[];
  public post: Post;

  maccount = this.accountService.accountValue;

  constructor(
    public dialog: MatDialog,
    private accountService: AccountService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      lengthMenu : [5, 10, 25, 50, 75, 100],
      processing: true
    };

    this.postService.getAll()
    .pipe(first())
    .subscribe((res:any)=>{
      this.posts = res as Post[];
      this.dtTrigger.next();
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  openEditPostDialog(postId: number){
    let dialogRef3 = this.dialog.open(EditPostDialogComponent,{
      width: '700px',
      minHeight: '200px',
      maxHeight:'600px',
      data: {
        postId: postId,
      }
    });
    dialogRef3.afterClosed().subscribe(data => {
      console.log(data);

      const post = this.posts.find((x: Post) => {
        if(x.id === postId){
          x.title = data.title;
          x.description = data.description;
        }
      });
      this.postService.getAll()
      .pipe(first())
      .subscribe(()=>{
        this.posts = this.posts;
      })
    });
  }

  deletePost(id: number) {
    var r = confirm("Are you sure you want to delete this post?");
    if(r)
    {
      try {
        const post = this.posts.find(x => x.id === id);
        post.isDeleting = true;
        this.postService.delete(id)
        .pipe(first())
        .subscribe(() => {
          this.posts = this.posts.filter(x => x.id !== id)
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
}
