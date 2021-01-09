import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PostToCreate, Post, Account, Follow, FollowToCreate } from '@app/_models';
import { AccountService, PostService, FollowService} from '@app/_services';

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent {
    maccount = this.accountService.accountValue;
    public post: PostToCreate;
    public posts: Post[] = [];
    id: number;
    account: Account;
    public follow: FollowToCreate;
    public mfollow: Follow;

    constructor(
        private accountService: AccountService,
        private postService: PostService,
        private followService: FollowService,
        private route: ActivatedRoute,
        private router: Router,) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        
        
        if(this.id==null)
        {
            this.postService.getAllByUserId(this.maccount.id)
            .subscribe(res => {
                this.posts = res as Post[];
                console.log(res);
            });
        
            this.accountService.getById(this.maccount.id)
            .subscribe((res:any)=>{
                this.account = res;
            })
        }
        else if(this.id)
        {
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
        }
    }

    getFollow(id:any){
        this.followService.getFollow(id)
            .subscribe((res:any)=>{
                this.mfollow = res;
            })
    }

    onCreateFollow() {
        this.follow = {
          accountId: this.account.id,
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