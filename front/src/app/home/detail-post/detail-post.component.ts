import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { AccountService, PostService, AlertService, CommentService, ReactionService } from '@app/_services';
import { Post, Comment, Reaction, ReactionToCreate, Account } from '@app/_models';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html'
})
export class DetailPostComponent {

  myForm: FormGroup;
  testForm: any;
  id:number;
  public comments: Comment[] = [];
  public reaction: ReactionToCreate;
  public reactionType: number;
  account: Account;

  maccount = this.accountService.accountValue;
  comment = this.commentService.commentValue;
  post = new Post;
  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private commentService: CommentService,
    private reactionService: ReactionService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.getRoute(this.route.snapshot.params['id']);
    this.getComment(this.route.snapshot.params['id']);
    this.accountService.getById(this.route.snapshot.params['ownerId'])
        .subscribe((res:any)=>{
            this.account = res;
        })
    this.accountService.getById(this.maccount.id)
        .subscribe((res:any)=>{
            this.maccount = res;
        })
    this.myForm = this.formBuilder.group({
      content: ['', Validators.required],
    });
    this.testForm = new FormData();  
    this.testForm.set('postId', this.post.id);
    this.testForm.set('content', this.myForm.get('content').value);
       
  }

  getComment(id:any){
    this.commentService.getAllByPostId(id)
    .subscribe((res:any)=>{
      this.comments = res as Comment[];
    })
  }

  getRoute(id:any){
    this.postService.getPostById(id)
    .subscribe((res:any)=>{
      this.post = res;
    })
  }

  submit() {
    if (this.myForm.invalid) {
      return;
    }
    this.testForm.set('postId', this.post.id);
    this.testForm.set('content', this.myForm.get('content').value);
    // this.testForm.append("postId", this.post.id);
    
    console.log(this.myForm.get('content').value);
    console.log(this.post.id);
    console.log(this.testForm);
    this.commentService.create(this.testForm)
        .subscribe(res => {
            console.log(res);
            alert('Comment Successfully.');
            this.commentService.getAllByPostId(this.post.id)
              .subscribe((res:any)=>{
                this.comments = res as Comment[];
              })
            // this.router.navigate(['../'], { relativeTo: this.route });
        }, error => {
            console.log(error);               
        }) 
  }


  public createImgPath = (serverPath: string) => {
    return `http://localhost:5000/${serverPath}`;
  }

  onCreateReaction() {
        this.reaction = {
          reactionType: 0,
          postId: this.post.id,
        }
        console.log(this.reaction);
        this.reactionService.createReaction(this.reaction)
        .subscribe(res => {
          console.log(res);
          alert('Tim thành công!');
          // this.isCreate = false;
        });
  }

  deletePost(id: number) {
    var r = confirm("Bạn có chắc chắn muốn xoá bài viết này?");
    if(r)
    {
        try {
            this.postService.delete(id)
                .subscribe(() => {
                  this.router.navigate(['../'], { relativeTo: this.route });
                });
        } catch (e) {
            console.log(e);
        }
    }   
  }
}
