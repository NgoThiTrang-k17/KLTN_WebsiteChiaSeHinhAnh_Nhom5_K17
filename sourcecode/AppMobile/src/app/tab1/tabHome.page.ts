import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Post, Account, FollowToCreate, ReactionToCreate } from '../_models';
import { PostService, SearchService, FollowService, AccountService, ReactionService } from '../_services';

@Component({
  selector: 'app-tabHome',
  templateUrl: 'tabHome.page.html',
  styleUrls: ['tabHome.page.scss']
})
export class TabHomePage implements OnInit {

  public posts: Post[] = [];
  public accounts: Account[] = [];
  public follow: FollowToCreate;
  public reaction: ReactionToCreate;
  public account: Account;
  public post: Post;

  search = false;
  searchAccount = false;

  constructor(
    private postService: PostService,
    private searchService: SearchService,
    private followService: FollowService,
    private accountService: AccountService,
    private reactionService: ReactionService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.search = false;

    this.postService.getAll()
        .subscribe(res => {
            this.posts = res as Post[];
        });
  }

  onSearch(event) {
    var str = event.target.value;
    if(str=='') { return; }
    this.search = true;
    console.log(event.target.value);
    console.log(str);
    if(str.substr(0,1)=='@')
    {
        this.searchAccount = true;
        this.searchService.getAllAccount(str)
        .subscribe(res => {
            this.accounts = res as Account[];
        });
    }
    else if(str.substr(0,1)!='@'){
        this.searchService.getAllPost(str)
        .subscribe(res => {
            this.posts = res as Post[];
        });
    }
    // this.returnURL = this.route.snapshot.queryParams['/search/']+this.search;
    // this.router.navigateByUrl(this.returnURL, { skipLocationChange: true });
  }

  unSearch() {
    this.search = false;
  }

  onCreateFollow(id:any) {
    this.follow = {
      subjectId: id,
    }
    console.log(this.follow);
    this.followService.createFollow(this.follow)
    .subscribe(res => {
      console.log(res);
      //alert('Follow thành công!');
      this.accountService.getById(id)
        .subscribe((res:any)=>{
            this.account = res;
            console.log(this.account.isFollowedByCurrentUser);
            this.router.routeReuseStrategy.shouldReuseRoute = () =>{
                return false;
            }
        })
    });
  }

  unFollow(id:any) {
    this.followService.delete(id)
    .subscribe(() => {
      //alert('Bỏ follow thành công!');
      this.accountService.getById(id)
        .subscribe((res:any)=>{
            this.account = res;
            console.log(this.account.isFollowedByCurrentUser);
            this.router.routeReuseStrategy.shouldReuseRoute = () =>{
                return false;
            }
        })
    });
  }

  onCreateReaction(id:number) {
    this.reaction = {
      targetId: id,
    }
    // console.log(this.reaction);
    this.reactionService.createReaction(this.reaction)
    .subscribe(res => {
      // console.log(res);
      //alert('Tim thành công!');
      this.postService.getAll()
      .subscribe(res => {
          this.posts = res as Post[];
      });
    });
  }

  unReaction(id:number){
    this.reactionService.deletePost(id)
    .subscribe(() => {
      //alert('Bỏ tim thành công!');
      this.postService.getAll()
      .subscribe(res => {
          this.posts = res as Post[];
      });
    });
  }

}
