import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';

import { PostToCreate, Post, Account, Follow, FollowToCreate, ReactionToCreate } from '@app/_models';
import { AccountService, PresenceService, PostService, FollowService, ReactionService } from '@app/_services';
import { ListFollowerDialogComponent } from './listFollower-dialog.component';
import { ListFollowingDialogComponent } from './listFollowing-dialog.component';
import { ReportComponent } from '../report/report.component';
import { EditPostDialogComponent } from '../detail-post/edit-post-dialog/edit-post-dialog.component';
import { ChatComponent } from '../message/chat/chat.component';
import { UpdateAvatarComponent } from './update-avatar/update-avatar.component';

@Component({
  templateUrl: 'details.component.html',
  styleUrls: ['./details.component.less']
})

export class DetailsComponent implements OnInit{
  maccount = this.accountService.accountValue;
  public post: PostToCreate;
  public posts: Post[] = [];
  public privatePosts: Post[] = [];
  public likePosts: Post[] = [];

  id: number;
  account: Account;
  public follow: FollowToCreate;
  public mfollow: Follow;
  public reaction: ReactionToCreate;
  followerId: number;
  subjectId: number;
  followerCount: number;
  followingCount: number;
  path: string;
  modalChatRef :any;

  constructor(
    private accountService: AccountService,
    private postService: PostService,
    public presenceService: PresenceService,
    private followService: FollowService,
    private reactionService: ReactionService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
    }

    this.postService.getAllByUserId(this.id)
    .subscribe(res => {
      this.posts = res as Post[];
    });

    this.postService.getAllPrivatePost()
    .subscribe(res => {
      this.privatePosts = res as Post[];
    });

    this.postService.getAllLikePost()
    .subscribe(res => {
      this.likePosts = res as Post[];
    });

    this.accountService.getById(this.id)
    .subscribe((res:any)=>{
      console.log(res);
      this.account = res;
    })

    this.getFollow(this.id);
    localStorage.removeItem('path');

    if(this.maccount.role == 'User'){
      this.path = 'user/detail/' + this.id;
      localStorage.setItem('path',this.path);
    } else if(this.maccount.role == 'Admin'){
      this.path = 'admin/user/detail/' + this.id;
      localStorage.setItem('path',this.path);
    }
  }

  openListFollowerDialog(followerCount:number): void{
    let dialogRef1 = this.dialog.open(ListFollowerDialogComponent,{
      width: '500px',
      minHeight: '200px',
      maxHeight:'600px',
      data: {
        followerId: this.id,
        followerCount: followerCount,
      }
    });
    dialogRef1.afterClosed().subscribe(() => {
        this.router.routeReuseStrategy.shouldReuseRoute = () =>{
            return false;
          }
        this.accountService.getById(this.id)
        .subscribe((res:any)=>{
            this.account = res;
        })
    });
    }

  openListFollowingDialog(followingCount:number): void{
      console.log(followingCount);
      let dialogRef2 = this.dialog.open(ListFollowingDialogComponent,{
          width: '500px',
          minHeight: '200px',
          maxHeight:'600px',
          data: {
              subjectId: this.id,
              followingCount: followingCount,
          }
      });
      dialogRef2.afterClosed().subscribe(() => {
          this.router.routeReuseStrategy.shouldReuseRoute = () =>{
              return false;
          }
          this.accountService.getById(this.id)
          .subscribe((res:any)=>{
              this.account = res;
          })
      });
  }

  getFollow(id:any){
      this.followService.getFollow(id)
          .subscribe((res:any)=>{
              this.mfollow = res;
          })
  }

  onCreateFollow() {
    this.follow = {
      subjectId: this.account.id,
    }
    console.log(this.follow);
    this.followService.createFollow(this.follow)
    .pipe(first())
    .subscribe(() => {
      this.account.isFollowedByCurrentUser = 1;
      this.account.followerCount++;
    });
  }

  unFollow() {
    console.log(this.id);
    this.followService.delete(this.id)
    .pipe(first())
    .subscribe(() => {
      this.account.isFollowedByCurrentUser = 0;
      this.account.followerCount--;
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
        if(x.id == postId){
          x.isReactedByThisUser = true;
          x.reactionCount++;
        }
      });
      this.posts = this.posts;
      const privatePost = this.privatePosts.find((x: Post) => {
        if(x.id == postId){
          x.isReactedByThisUser = true;
          x.reactionCount++;
        }
      });
      this.privatePosts = this.privatePosts;
      const likePost = this.likePosts.find((x: Post) => {
        if(x.id == postId){
          x.isReactedByThisUser = true;
          x.reactionCount++;
        }
      });
      this.likePosts = this.likePosts;
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
      });
      this.posts = this.posts;
      const privatePost = this.privatePosts.find((x: Post) => {
        if(x.id == postId){
          x.isReactedByThisUser = false;
          x.reactionCount--;
        }
      });
      this.privatePosts = this.privatePosts;
      const likePost = this.likePosts.find((x: Post) => {
        if(x.id == postId){
          x.isReactedByThisUser = false;
          x.reactionCount--;
        }
      });
      this.likePosts = this.likePosts;
    });
  }

  openReportDialog(accountId: number): void{
    let dialogRef1 = this.dialog.open(ReportComponent,{
      width: '500px',
      minHeight: '200px',
      maxHeight:'600px',
      data: {
        targetId: accountId,
        targetType: 0,
      }
    });
  }

  openReportPostDialog(postId: number): void{
    let dialogRef2 = this.dialog.open(ReportComponent,{
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
      this.postService.getAllByUserId(this.id)
      .subscribe(res => {
        this.posts = res as Post[];
      });
      this.postService.getAllPrivatePost()
      .subscribe(res => {
        this.privatePosts = res as Post[];
      });
    });
  }

  openSetAvatarDialog():void {
    let dialogRef4 = this.dialog.open(UpdateAvatarComponent,{
      maxWidth: '900px',
      minWidth: '400px',
      minHeight: '200px',
      maxHeight:'600px',
      data: {
      }
    });
    dialogRef4.afterClosed().subscribe(() => {
      this.router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
      }
      this.accountService.getById(this.id)
      .subscribe((res:any)=>{
        this.account = res;
      })
    });
  }

  openModalMessage(userId: number) {
    this.modalChatRef = this.modalService.open(ChatComponent, { windowClass: 'modalMess', backdropClass: 'backdropModalMess'});
    this.modalChatRef.componentInstance.userId = userId;
  }

  goDetail(postId: number, ownerId: number){
    this.router.navigate(['admin/user/detail-post/' + postId + '/' + ownerId]);
  }
}
