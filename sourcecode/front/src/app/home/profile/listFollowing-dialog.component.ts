import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

import { PostToCreate, Post, Account, Follow, FollowToCreate } from '@app/_models';
import { AccountService, PostService, FollowService} from '@app/_services';
import { first } from 'rxjs-compat/operator/first';
import { tap } from 'rxjs/operators';

@Component({ templateUrl: 'listFollowing-dialog.component.html' })
export class ListFollowingDialogComponent implements OnInit {

    followingId: number;
    public follow: FollowToCreate;
    public mfollow: Follow;
    public follows: Follow[] = [];

    maccount = this.accountService.accountValue;

    constructor(
      public dialogRef: MatDialogRef<ListFollowingDialogComponent>,
      private followService: FollowService,
      private accountService: AccountService,
      @Inject(MAT_DIALOG_DATA) public data: any
    ){}

    ngOnInit(){
      console.log(this.data.subjectId)
      this.followingId = this.data.subjectId;
      this.followService.getByFollowerId(this.followingId)
      .subscribe(res =>{
        this.follows = res as Follow[];
      })
    }

    onCreateFollow(id:number) {
        this.follow = {
          subjectId: id,
        }
        // console.log(this.follow);
        this.followService.createFollow(this.follow)
        .subscribe(res => {
          const follow = this.follows.find( (x: Follow) => {
            if(x.subjectId == id){
              x.isSubject_FollowedByCurrentUser = true;
            }
          });
          this.follows = this.follows;
        });
      }

    unFollow(id:number) {
        // console.log(this.post.ownerId);
        this.followService.delete(id)
        .subscribe(() => {
          if(this.followingId == this.maccount.id){
            this.follows = this.follows.filter( x => x.subjectId != id);
            return;
          }
          const follow = this.follows.find( (x: Follow) => {
            if(x.subjectId == id){
              x.isSubject_FollowedByCurrentUser = false;
            }
          });
          this.follows = this.follows;
        });
    }
}
