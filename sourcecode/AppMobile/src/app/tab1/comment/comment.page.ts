import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

import { CommentToCreate, Comment, ReactionCmtToCreate } from '../../_models';
import { CommentService, AccountService, ReactionService } from '../../_services';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {

  @ViewChild('commentForm') commentForm: NgForm;

  @Input() postId: number;

  commentContent: string;

  public comments: Comment[] = [];

  public comment: CommentToCreate;
  public reaction: ReactionCmtToCreate;

  maccount = this.accountService.accountValue;

  constructor(
    public modalController: ModalController,
    public commentService: CommentService,
    public accountService: AccountService,
    public reactionService: ReactionService,
  ) { }

  ngOnInit() {
    this.commentService.getAllByPostId(this.postId)
      .subscribe((res:any)=>{
        this.comments = res as Comment[];
      })
  }

  onCreateReactionComment(id: number){
    this.reaction = {
      target: 1,
      targetId: id
    }
    this.reactionService.createReaction(this.reaction)
    .subscribe(res => {
      this.commentService.getAllByPostId(this.postId)
      .subscribe((res:any)=>{
        this.comments = res as Comment[];
      })
    })
  }

  unReactionComment(id: number){
    this.reactionService.deleteCmt(id)
    .subscribe(res => {
      this.commentService.getAllByPostId(this.postId)
      .subscribe((res:any)=>{
        this.comments = res as Comment[];
      })
    })
  }

  sendComment() {
    this.comment = {
      postId: this.postId,
      content: this.commentContent
    }
    console.log(this.comment);

    this.commentService.create(this.comment)
    .subscribe(res => {
      console.log(res);
      this.commentForm.reset();
      this.commentService.getAllByPostId(this.postId)
      .subscribe((res:any)=>{
        this.comments = res as Comment[];
      })
    }, error => {
          console.log(error);
    })
  }

  closeModalCmt() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
