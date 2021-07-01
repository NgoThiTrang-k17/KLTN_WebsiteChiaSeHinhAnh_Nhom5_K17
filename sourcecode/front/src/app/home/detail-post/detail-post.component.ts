import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/filter';

import { AccountService, PostService, AlertService, CommentService, ReactionService, FollowService } from '@app/_services';
import { Post, Comment, CommentToCreate, commentToCreateForCmt, CommentToUpdate , Reaction, ReactionToCreate, Account, Follow, FollowToCreate, ReactionCmtToCreate } from '@app/_models';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html'
})
export class DetailPostComponent {

  path: string;
  myForm: FormGroup;
  testForm: any;
  cmtForm: FormGroup;
  cmtFormData: any;
  updateCmtForm: FormGroup;
  updateCmtFormData: any;
  id:number;
  editCmt: boolean;
  cmt:number;
  editCmtId: any;
  public comments: Comment[] = [];
  public cmtCreate: CommentToCreate;
  public cmtCreateForCmt: commentToCreateForCmt;
  public cmtId: any;
  public cmtUpdate: CommentToUpdate;
  public reaction: ReactionToCreate;
  public reactionCmt: ReactionCmtToCreate;
  mreaction = new Reaction;
  like = false;
  public follow: FollowToCreate;
  mfollow = new Follow;
  public reactionType: number;
  account: Account;

  // mreaction = this.reactionService.reactionValue;
  // mfollow = this.followService.followValue;
  maccount = this.accountService.accountValue;
  comment = this.commentService.commentValue;
  commentReply = this.commentService.commentValue;
  post = new Post;
  commentEdit = new Comment;
  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private commentService: CommentService,
    private reactionService: ReactionService,
    private followService: FollowService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.editCmtId = this.route.snapshot.params['commentId'];
    this.cmt = this.route.snapshot.params['onCmt'];
    console.log(this.editCmtId);
    console.log(this.cmt);
    if(this.editCmtId != null && this.cmt==0){
      this.editCmt = true;
      this.router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
      }
      this.commentService.getById(this.editCmtId)
        .subscribe((res:any)=>{
          this.commentEdit = res;
        })
    }
    else {
      this.editCmt = false;
    }
    this.getRoute(this.route.snapshot.params['id']);
    this.getComment(this.route.snapshot.params['id']);
    this.getReaction(this.route.snapshot.params['id']);
    if(this.mreaction.type == 0){
      this.like = true;
    }
    this.getFollow(this.route.snapshot.params['ownerId']);
    this.accountService.getById(this.route.snapshot.params['ownerId'])
        .subscribe((res:any)=>{
            this.account = res;
        })
    this.accountService.getById(this.maccount.id)
        .subscribe((res:any)=>{
            this.maccount = res;
        })
    this.myForm = this.formBuilder.group({
      contentCreate: ['', Validators.required],
    });
    this.updateCmtForm = this.formBuilder.group({
      content: [this.comment.content, Validators.required],
    });

    this.testForm = new FormData();
    this.updateCmtFormData = new FormData();

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

  getReaction(id:any){
    this.reactionService.getReaction(id)
        .subscribe((res:any)=>{
            this.mreaction = res;
        })
  }

  getFollow(id:any){
    this.followService.getFollow(id)
        .subscribe((res:any)=>{
            this.mfollow = res;
        })
  }

  createCmt(event) {
    var str = event.target.value;
    if(str=='') { return; }
    this.cmtCreate = {
      content: str,
      postId: this.post.id,
    }
    this.commentService.create(this.cmtCreate)
      .subscribe(res => {
        console.log(res);
        // alert('Bình luận thành công.');
        this.myForm.reset();
        this.commentService.getAllByPostId(this.post.id)
          .subscribe((res:any)=>{
            this.comments = res as Comment[];
          })
          this.getRoute(this.route.snapshot.params['id']);
      }, error => {
          console.log(error);
      })
  }

  updateCmt(event) {
    var str = event.target.value;
    if(str=='') { return; }
    this.cmtUpdate = {
      content: str,
    }
    // this.updateCmtFormData.set('content', this.updateCmtForm.get('content').value);
    this.commentService.update(this.editCmtId ,this.cmtUpdate)
        .subscribe(res => {
            // console.log(res);
            alert('Chỉnh sửa bình luận thành công.');
            this.router.navigate(['../../'], { relativeTo: this.route });
        }, error => {
            console.log(error);
        })
  }

  createCmtForCmt(event){
    this.cmtId = this.editCmtId;
    var str = event.target.value;
    if(str=='') { return; }
    console.log(this.cmtId);
    this.cmtCreateForCmt = {
      content: str,
      parrentId: parseInt(this.editCmtId),
      postId: this.post.id,
    }

    // this.testForm.set('content',str);
    // this.testForm.set('parrentId',this.editCmtId);
    // this.testForm.set('postId',this.post.id);

    this.commentService.create(this.cmtCreateForCmt)
      .subscribe(res => {
        console.log(res);
        // alert('Bình luận thành công.');
        this.myForm.reset();
        this.commentService.getAllByPostId(this.post.id)
          .subscribe((res:any)=>{
            this.comments = res as Comment[];
          })
          this.getRoute(this.route.snapshot.params['id']);
      }, error => {
          console.log(error);
      })
  }

  editComment(){
    this.editCmt = true;
  }

  onCmt() {
    this.cmt = 1;
  }

  onCreateReaction() {
    this.reaction = {
      targetId: this.post.id,
    }
    // console.log(this.reaction);
    this.reactionService.createReaction(this.reaction)
    .subscribe(res => {
      // console.log(res);
      //alert('Tim thành công!');
      this.getRoute(this.post.id);
    });
  }

  unReaction() {
    this.reactionService.deletePost(this.post.id)
    .subscribe(() => {
      //alert('Bỏ tim thành công!');
      this.getRoute(this.post.id);
    });
  }

  onCreateReactionCmt(cmtId: number) {
    this.reactionCmt = {
      target: 1,
      targetId: cmtId,
    }
    // console.log(this.reaction);
    this.reactionService.createReaction(this.reactionCmt)
    .subscribe(res => {
      // console.log(res);
      // alert('Tim thành công!');
      this.getRoute(this.post.id);
      this.getComment(this.post.id);
    });

  }

  unCreateReactionCmt(cmtId: number) {
    this.reactionService.deleteCmt(cmtId)
    .subscribe(() => {
      //alert('Bỏ tim thành công!');
      this.getRoute(this.post.id);
      this.getComment(this.post.id);
    });
  }

  onCreateFollow() {
    this.follow = {
      subjectId: this.post.ownerId,
    }
    // console.log(this.follow);
    this.followService.createFollow(this.follow)
    .subscribe(res => {
      // console.log(res);
      //alert('Follow thành công!');
      this.getRoute(this.post.id);
      this.getFollow(this.post.ownerId);
    });
  }

  unFollow() {
    // console.log(this.post.ownerId);
    this.followService.delete(this.post.ownerId)
    .subscribe(() => {
      //alert('Bỏ follow thành công!');
      this.getRoute(this.post.id);
      this.getFollow(this.post.ownerId);
    });
  }

  deletePost(id: number) {
    var r = confirm("Bạn có chắc chắn muốn xoá bài viết này?");
    if(r)
    {
        try {
            this.postService.delete(id)
            .subscribe(() => {
              this.router.navigate(['../../../'], { relativeTo: this.route });
            });
          } catch (e) {
            console.log(e);
        }
    }
  }

  deleteComment(id: number) {
    var r = confirm("Bạn có chắc chắn muốn xoá bình luận này?");
    if(r)
    {
        try {
            this.commentService.delete(id)
                .subscribe(() => {
                  this.commentService.getAllByPostId(this.post.id)
                  .subscribe((res:any)=>{
                    this.comments = res as Comment[];
                  })
                  this.getRoute(this.route.snapshot.params['id']);
                });
        } catch (e) {
            console.log(e);
        }
    }
  }

  clearForm(){
    this.myForm.reset();
  }

  closeEdit(){
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  back() {
    this.path = localStorage.getItem('path');
    if(this.path == null){
      this.router.navigate([''], { relativeTo: this.route });
    } else {
      this.router.navigate([this.path]);
    }
  }

  // public createImgPath = (serverPath: string) => {
  //   return `http://localhost:5000/${serverPath}`;
  // }
}
