import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Account, Post, FollowToCreate, ReactionToCreate } from '../../../_models';
import { AccountService, SearchService, FollowService, ReactionService, PostService } from '../../../_services';
import { ReportComponent } from '../../report/report.component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.less']
})
export class SearchResultComponent implements OnInit {

  public query: string;
  public searchAccount: boolean;

  public follow: FollowToCreate;
  public account: Account;
  public reaction: ReactionToCreate;

  public accounts: Account[] = [];
  public posts: Post[] = [];

  maccount = this.accountService.accountValue;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialogReport: MatDialog,
    private accountService: AccountService,
    private searchService: SearchService,
    private followService: FollowService,
    private reactionService: ReactionService,
    private postService: PostService,
  ) {
    this.accountService.account.subscribe(x => this.account = x);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.query = this.route.snapshot.params['query'];
    if(this.query.substr(0,1)=='@')
    {
        this.searchAccount = true;
        this.searchService.getAllAccount(this.query)
        .subscribe(res => {
            this.accounts = res as Account[];
        });
    }
    else if(this.query.substr(0,1)!='@'){
        this.searchService.getAllPost(this.query)
        .subscribe(res => {
          this.posts = res as Post[];
        });
    }
  }

  onCreateFollow(id:any) {
    this.follow = {
      subjectId: id,
    }
    console.log(this.follow);
    this.followService.createFollow(this.follow)
    .pipe(first())
    .subscribe(res => {
      const account = this.accounts.find((x: Account) => {
        if(x.id == id){
          x.isFollowedByCurrentUser = 1;
          x.followerCount++;
        }
      })
      this.accounts = this.accounts;
    });
  }

  unFollow(id:any) {
    this.followService.delete(id)
    .pipe(first())
    .subscribe(res => {
      const account = this.accounts.find((x: Account) => {
        if(x.id == id){
          x.isFollowedByCurrentUser = 0;
          x.followerCount--;
        }
      })
      this.accounts = this.accounts;
    });
  }

  onCreateReaction(postId: number) {
    this.reaction = {
      targetId: postId,
    }
    this.reactionService.createReaction(this.reaction)
    .pipe(first())
    .subscribe(res => {
      const post = this.posts.find((x: Post) => {
        if(x.id == postId){
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
        if(x.id == postId){
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
