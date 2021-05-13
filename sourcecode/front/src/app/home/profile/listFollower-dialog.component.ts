import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

import { PostToCreate, Post, Account, Follow, FollowToCreate } from '@app/_models';
import { AccountService, PostService, FollowService} from '@app/_services';
import { first } from 'rxjs-compat/operator/first';
import { tap } from 'rxjs/operators';

@Component({ templateUrl: 'listFollower-dialog.component.html' })
export class ListFollowerDialogComponent implements OnInit {

    followerId: number;
    public follow: FollowToCreate;
    public mfollow: Follow;
    public follows: Follow[] = [];

    maccount = this.accountService.accountValue;

    constructor(
        public dialogRef: MatDialogRef<ListFollowerDialogComponent>,
        private followService: FollowService,
        private accountService: AccountService,
        @Inject(MAT_DIALOG_DATA) public data: any){}
    
    ngOnInit(){
      console.log(this.data.followerId);
      this.followerId = this.data.followerId;
      this.followService.getBySubjectId(this.followerId)
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
          //alert('Follow thành công!');
          this.followService.getBySubjectId(this.followerId)
            .subscribe(res =>{
                this.follows = res as Follow[];
            })
        });
      }
    
    unFollow(id:number) {
        // console.log(this.post.ownerId);
        this.followService.delete(id)
        .subscribe(() => {
          //alert('Bỏ follow thành công!');
          this.followService.getBySubjectId(this.followerId)
            .subscribe(res =>{
                this.follows = res as Follow[];
            })
        });
        
    }
}