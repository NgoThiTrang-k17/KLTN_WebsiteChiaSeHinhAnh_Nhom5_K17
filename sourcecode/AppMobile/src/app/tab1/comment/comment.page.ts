/* eslint-disable @typescript-eslint/no-shadow */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

import { CommentToCreate, Comment, ReactionCmtToCreate, CommentToCreateForCmt } from '../../_models';
import { CommentService, AccountService, ReactionService } from '../../_services';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {

  @ViewChild('commentForm') commentForm: NgForm;
  @ViewChild('replyCommentForm') replyCommentForm: NgForm;

  @Input() postId: number;

  commentContent: string;
  onReplyComment: boolean;
  seenReplyComment: boolean;
  replyCommentContent: string;
  commentId: number;
  ownerName: string;
  input: any;

  public comments: Comment[] = [];

  public comment: CommentToCreate;
  public reaction: ReactionCmtToCreate;
  public replyComment: CommentToCreateForCmt;

  maccount = this.accountService.accountValue;

  constructor(
    public modalController: ModalController,
    public commentService: CommentService,
    public accountService: AccountService,
    public reactionService: ReactionService,
  ) { }

  ngOnInit() {
    this.onReplyComment = false;
    this.seenReplyComment = false;

    this.commentService.getAllByPostId(this.postId)
    .subscribe(res=>{
      this.comments = res as Comment[];
    });
  }

  onCreateReactionComment(id: number){
    this.reaction = {
      target: 1,
      targetId: id
    };
    this.reactionService.createReaction(this.reaction)
    .subscribe(res => {
      this.commentService.getAllByPostId(this.postId)
      .subscribe((res: any)=>{
        this.comments = res as Comment[];
      });
    });
  }

  unReactionComment(id: number){
    this.reactionService.deleteCmt(id)
    .subscribe(res => {
      this.commentService.getAllByPostId(this.postId)
      .subscribe((res: any)=>{
        this.comments = res as Comment[];
      });
    });
  }

  sendComment() {
    this.comment = {
      postId: this.postId,
      content: this.commentContent
    };

    this.commentService.create(this.comment)
    .subscribe(res => {
      this.commentForm.reset();
      this.commentService.getAllByPostId(this.postId)
      .subscribe((res: any)=>{
        this.comments = res as Comment[];
      });
    }, error => {
      console.log(error);
    });
  }

  sendReplyComment(){
    this.replyComment = {
      content: this.replyCommentContent,
      parrentId: this.commentId,
      postId: this.postId
    };
    console.log(this.replyComment);
    this.commentService.create(this.replyComment)
    .subscribe(res => {
      console.log(res);
      this.replyCommentForm.reset();
      this.commentService.getAllByPostId(this.postId)
      .subscribe((res: any)=>{
        this.comments = res as Comment[];
      });
    }, error => {
      console.log(error);
    });
  }

  focusInputReplyComment(commentId: number, ownerName: string, input) {
    this.onReplyComment = true;
    this.commentId = commentId;
    this.ownerName = ownerName;
    input.setFocus();
  }

  unReplyComment() {
    this.onReplyComment = false;
  }

  onSeenReplyComment() {
    this.seenReplyComment = true;
  }

  unSeenReplyComment() {
    this.seenReplyComment = false;
  }

  closeModalCmt() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
