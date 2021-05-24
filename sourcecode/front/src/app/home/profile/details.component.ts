import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { PostToCreate, Post, Account, Follow, FollowToCreate } from '@app/_models';
import { AccountService, PostService, FollowService} from '@app/_services';
import { ListFollowerDialogComponent } from './listFollower-dialog.component';
import { ListFollowingDialogComponent } from './listFollowing-dialog.component';

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent {
    maccount = this.accountService.accountValue;
    public post: PostToCreate;
    public posts: Post[] = [];
    id: number;
    account: Account;
    public follow: FollowToCreate;
    public mfollow: Follow;
    followerId: number;
    subjectId: number;
    followerCount: number;
    followingCount: number;

    constructor(
        private accountService: AccountService,
        private postService: PostService,
        private followService: FollowService,
        private route: ActivatedRoute,
        private router: Router,
        public dialogFollower: MatDialog,
        public dialogFollowing: MatDialog,) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        this.router.routeReuseStrategy.shouldReuseRoute = () =>{
            return false;
        }
        
        this.postService.getAllByUserId(this.id)
            .subscribe(res => {
                this.posts = res as Post[];
                console.log(res);
            });
        
        this.accountService.getById(this.id)
            .subscribe((res:any)=>{
                this.account = res;
            })
        this.getFollow(this.id);

        // if(this.id==this.maccount.id)
        // {
        //     this.postService.getAllByUserId(this.maccount.id)
        //     .subscribe(res => {
        //         this.posts = res as Post[];
        //         console.log(res);
        //     });
        
        //     this.accountService.getById(this.maccount.id)
        //     .subscribe((res:any)=>{
        //         this.account = res;
        //     })
        // }
        // else if(this.id!=this.maccount.id)
        // {
            
        // }
    }

    openListFollowerDialog(followerCount:number): void{
        let dialogRef1 = this.dialogFollower.open(ListFollowerDialogComponent,{
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
            this.getFollow(this.id);
        });
    }

    openListFollowingDialog(followingCount:number): void{
        console.log(followingCount);
        let dialogRef2 = this.dialogFollowing.open(ListFollowingDialogComponent,{
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
            this.getFollow(this.id);
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
        .subscribe(res => {
          console.log(res);
          //alert('Follow thành công!');
          this.accountService.getById(this.id)
            .subscribe((res:any)=>{
                this.account = res;
            })
          this.getFollow(this.id);
        });
      }
    
      unFollow() {
        console.log(this.id);
        this.followService.delete(this.id)
        .subscribe(() => {
          //alert('Bỏ follow thành công!');
          this.accountService.getById(this.id)
            .subscribe((res:any)=>{
                this.account = res;
            })
          this.getFollow(this.id);
        });
      }

    public createImgPath = (serverPath: string) => {
        return `http://localhost:5000/${serverPath}`;
    }
}