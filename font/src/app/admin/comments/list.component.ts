import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, PostService, CommentService } from '@app/_services';
import { Account, Post, Comment } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    account = new Account;
    comments: any[];
    public post: Post;
    
    constructor(private accountService: AccountService, private postService: PostService, private commentService: CommentService) {}

    ngOnInit() {
        this.commentService.getAll()
            .pipe(first())
            .subscribe(comments => this.comments = comments);
        
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