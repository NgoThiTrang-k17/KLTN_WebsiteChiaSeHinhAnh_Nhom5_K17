import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, PostService } from '@app/_services';
import { Account, Post, PostToCreate } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    account = new Account;
    posts: any[];
    public post: Post;
    // public posts: Post[] = [];
    
    constructor(private accountService: AccountService, private postService: PostService) {}

    ngOnInit() {
        this.postService.getAll()
            .pipe(first())
            .subscribe(posts => this.posts = posts);
        
        // this.accountService.getById(this.post.ownerId)
        //     .subscribe((res:any)=>{
        //         this.account = res;
        //     })
    }

    public createImgPath = (serverPath: string) => {
        return `http://localhost:5000/${serverPath}`;
    }

    // deletePost(id: number) {
    //     var r = confirm("Are you sure you want to delete this account?");
    //     if(r)
    //     {
    //         try {
    //             const post = this.posts.find(x => x.id === id);
    //             post.isDeleting = true;
    //             this.postService.delete(id)
    //                 .pipe(first())
    //                 .subscribe(() => {
    //                     this.posts = this.posts.filter(x => x.id !== id) 
    //                 });
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }
        
    // }
}