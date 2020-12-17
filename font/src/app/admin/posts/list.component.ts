import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, PostService } from '@app/_services';
import { Account, Post, PostToCreate } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    account = new Account;
    posts: any[];
    public post: Post;
    
    constructor(private accountService: AccountService, private postService: PostService) {}

    ngOnInit() {
        this.postService.getAll()
            .pipe(first())
            .subscribe((res:any)=>{
                this.posts = res; 
                // this.getEmail(this.post.ownerId);
            })
        
        //this.getEmail(this.post.ownerId);
    }

    getEmail(id:any){
        this.accountService.getById(id)
        .subscribe((res:any)=>{
          this.account = res;
        })
      
    }

    public createImgPath = (serverPath: string) => {
        return `http://localhost:5000/${serverPath}`;
    }

    deletePost(id: number) {
        var r = confirm("Are you sure you want to delete this account?");
        if(r)
        {
            try {
                const post = this.posts.find(x => x.id === id);
                post.isDeleting = true;
                this.postService.delete(id)
                    .pipe(first())
                    .subscribe(() => {
                        this.posts = this.posts.filter(x => x.id !== id) 
                    });
            } catch (e) {
                console.log(e);
            }
        }
        
    }
}