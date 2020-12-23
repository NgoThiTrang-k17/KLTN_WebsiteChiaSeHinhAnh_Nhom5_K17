import { Component } from '@angular/core';
import { PostToCreate, Post, Account } from '@app/_models';

import { AccountService, PostService } from '@app/_services';

@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent {
    account = this.accountService.accountValue;
    public post: PostToCreate;
    public posts: Post[] = [];

    constructor(
        private accountService: AccountService,
        private postService: PostService,) { }

    ngOnInit() {
        
        this.postService.getAllByUserId(this.account.id)
            .subscribe(res => {
                this.posts = res as Post[];
                console.log(res);
            });
        
    }

    public createImgPath = (serverPath: string) => {
        return `http://localhost:5000/${serverPath}`;
    }
}