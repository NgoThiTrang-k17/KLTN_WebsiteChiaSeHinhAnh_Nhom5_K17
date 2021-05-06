import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, NotificationService, SearchService, FollowService } from '../_services';
import { Account, Notification, NotificationToUpdate, Post, Follow, FollowToCreate } from '../_models';

@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent implements OnInit { 

    maccount = this.accountService.accountValue;
    temp: any;
    login: boolean;
    search: boolean;
    searchAccount = false;
    null = false;
    returnURL: any;
    public follow: FollowToCreate;
    public mfollow: Follow;
    public account: Account;
    public accounts: Account[] = [];
    public posts: Post[] = [];
    public notification: NotificationToUpdate;
    public notifications: Notification[] = [];

    constructor(private accountService: AccountService, 
                private notificationService: NotificationService,
                private searchService: SearchService,
                private followService: FollowService, 
                private route: ActivatedRoute,
                private router: Router,) {
        this.accountService.account.subscribe(x => this.account = x);
    }

    ngOnInit() {
        this.search = false;
        this.router.routeReuseStrategy.shouldReuseRoute = () =>{
            return false;
        }

        this.accountService.getById(this.maccount.id)
        .subscribe((res:any)=>{
            this.maccount = res;
        })

        
    }

    getNotification(id:any){
        this.notificationService.getAllByUserId(id)
            .subscribe(res => {
                this.notifications = res as Notification[];
        });
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

    updateNotification(id:any){
        this.notification = {
            status: 2,
        }

        this.notificationService.update(id ,this.notification)
        .subscribe(res => {
            console.log(res);
            // alert('Xem thông báo thành công.');
        }, error => {
            console.log(error);               
        })
    }

    logout() {
        this.accountService.logout();
    }

    save(event) {
        this.search = true;
        console.log(event.target.value);

        var str = event.target.value;
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

    public createImgPath = (serverPath: string) => {
        return `http://localhost:5000/${serverPath}`;
    }
}