import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AccountService, PresenceService, PostService, CommentService, ReactionService, FollowService } from '@app/_services';
import { Post, Reaction, ReactionToCreate, Account, Follow, FollowToCreate } from '@app/_models';
import { ReportComponent } from '../report/report.component';
import { EditPostDialogComponent } from '../detail-post/edit-post-dialog/edit-post-dialog.component';
@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html'
})
export class DetailPostComponent implements OnInit {

  path: string;
  id:number;
  onFocusComment = false;

  mreaction = new Reaction;
  like = false;
  public follow: FollowToCreate;
  mfollow = new Follow;
  public reactionType: number;
  reaction: ReactionToCreate;
  account: Account;

  maccount = this.accountService.accountValue;
  post = new Post;

  constructor(
    public dialog: MatDialog,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private commentService: CommentService,
    private reactionService: ReactionService,
    private followService: FollowService,
    public presenceService: PresenceService,
  ) { }

  ngOnInit(): void {
    this.getRoute(this.route.snapshot.params['id']);
    this.getReaction(this.route.snapshot.params['id']);
    if(this.mreaction.type == 0){
      this.like = true;
    }

    this.getFollow(this.route.snapshot.params['ownerId']);
    this.accountService.getById(this.route.snapshot.params['ownerId'])
    .subscribe((res:any)=>{
        this.account = res;
    })
    this.accountService.getById(this.maccount.id)
    .subscribe((res:any)=>{
        this.maccount = res;
    })
  }

  getRoute(id:any){
    this.postService.getPostById(id)
    .subscribe((res:any)=>{
      this.post = res;
    })
  }

  getReaction(id:any){
    this.reactionService.getReaction(id)
    .subscribe((res:any)=>{
        this.mreaction = res;
    })
  }

  getFollow(id:any){
    this.followService.getFollow(id)
    .subscribe((res:any)=>{
        this.mfollow = res;
    })
  }

  onCreateReaction() {
    this.reaction = {
      targetId: this.post.id,
    }
    // console.log(this.reaction);
    this.reactionService.createReaction(this.reaction)
    .subscribe(res => {
      // console.log(res);
      //alert('Tim thành công!');
      this.getRoute(this.post.id);
    });
  }

  unReaction() {
    this.reactionService.deletePost(this.post.id)
    .subscribe(() => {
      //alert('Bỏ tim thành công!');
      this.getRoute(this.post.id);
    });
  }

  onCreateFollow() {
    this.follow = {
      subjectId: this.post.ownerId,
    }

    this.followService.createFollow(this.follow)
    .subscribe(res => {
      this.getRoute(this.post.id);
      this.getFollow(this.post.ownerId);
    });
  }

  unFollow() {
    this.followService.delete(this.post.ownerId)
    .subscribe(() => {
      this.getRoute(this.post.id);
      this.getFollow(this.post.ownerId);
    });
  }

  deletePost(id: number) {
    var r = confirm("Bạn có chắc chắn muốn xoá bài viết này?");
    if(r)
    {
        try {
            this.postService.delete(id)
            .subscribe(() => {
              this.router.navigate(['../../../'], { relativeTo: this.route });
            });
          } catch (e) {
            console.log(e);
        }
    }
  }

  back() {
    this.path = localStorage.getItem('path');
    if(this.path == null){
      this.router.navigate([''], { relativeTo: this.route });
    } else {
      this.router.navigate([this.path]);
    }
  }

  openReportDialog(postId: number) {
    let dialogRef1 = this.dialog.open(ReportComponent,{
      width: '500px',
      minHeight: '200px',
      maxHeight:'600px',
      data: {
        targetId: postId,
        targetType: 1,
      }
    });
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
    dialogRef3.afterClosed().subscribe(() => {
      this.router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
      }
      this.getRoute(this.route.snapshot.params['id']);
    });
  }

  focusComment() {
    this.onFocusComment = true;
  }
}
