/* eslint-disable radix */
/* eslint-disable object-shorthand */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-shadow */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { first } from 'rxjs/operators';

import { CommentToCreate, Comment, ReactionCmtToCreate, CommentToCreateForCmt, CommentToUpdate, Account } from '../../_models';
import { CommentService, AccountService, ReactionService } from '../../_services';
import { ReportComponent } from '../../components-share/report/report.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {

  @ViewChild('commentForm') commentForm: NgForm;
  @ViewChild('replyCommentForm') replyCommentForm: NgForm;
  @ViewChild('inputCommentReply') inputCommentReply;
  @ViewChild('inputEditComment') inputEditComment;

  @Input() postId: number;

  commentContent: string;
  onReplyComment: boolean;
  seenReplyComment: boolean;
  replyCommentContent: string;
  commentId: number;
  ownerName: string;
  input: any;
  editCommentId: number;
  editComment: boolean;
  public editCommentContent: string;
  finishUpdate: boolean;

  public editReplyComment = new Comment();
  public account = new Account();
  public comments: Comment[] = [];

  public comment: CommentToCreate;
  public reaction: ReactionCmtToCreate;
  public replyComment: CommentToCreateForCmt;
  public updateComment: CommentToUpdate;

  maccount = this.accountService.accountValue;

  constructor(
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private commentService: CommentService,
    private accountService: AccountService,
    private reactionService: ReactionService,
  ) { }

  ngOnInit() {
    this.onReplyComment = false;
    this.seenReplyComment = false;
    this.editComment = false;
    this.finishUpdate = false;

    this.commentService.getAllByPostId(this.postId)
    .subscribe(res=>{
      this.comments = res as Comment[];
    });

    this.accountService.getById(this.maccount.id)
    .subscribe(res=>{
      console.log(res);

      this.account = res;
    });
  }

  onCreateReactionComment(id: number){
    this.reaction = {
      target: 1,
      targetId: id
    };
    this.reactionService.createReaction(this.reaction)
    .pipe(first())
    .subscribe({
      next: () => {
        const comment = this.comments.find((x: Comment) => {
          if(x.id === id){
            x.isReactedByThisUser = true;
            x.reactionCount++;
          }
        });
        this.comments = this.comments;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  unReactionComment(id: number){
    this.reactionService.deleteCmt(id)
    .pipe(first())
    .subscribe({
      next: () => {
        const comment = this.comments.find((x: Comment) => {
          if(x.id === id){
            x.isReactedByThisUser = false;
            x.reactionCount--;
          }
        });
        this.comments = this.comments;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  sendComment() {
    this.comment = {
      postId: this.postId,
      content: this.commentContent
    };

    this.commentService.create(this.comment)
    .subscribe(_res => {
      this.commentForm.reset();
      this.commentService.getAllByPostId(this.postId)
      .subscribe((res: any)=>{
        this.comments = res as Comment[];
      });
    }, error => {
      console.log(error);
    });
  }

  sendUpdateComment(){
    this.updateComment = {
      content: this.commentContent,
    };

    this.commentService.update(this.editCommentId, this.updateComment)
    .pipe(first())
    .subscribe({
      next: () => {
        this.editComment = false;
        const comment = this.comments.find((x: Comment) => {
          if(x.id === this.editCommentId){
            x.content = this.commentContent;
          }
        });
        this.comments = this.comments;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  unUpdateComment(){
    this.editComment = false;
    this.onReplyComment = false;
    this.editCommentId = null;
    this.commentContent = '';
    this.replyCommentContent = '';
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

  onEditReplyComment(commentId: number, content: string){
    console.log(commentId);
    this.onReplyComment = true;
    this.editComment = true;
    this.editCommentId = commentId;
    console.log(this.editCommentId);
    this.replyCommentContent = content.toString();
    setTimeout(()=>{
      this.inputCommentReply.setFocus();
    },150);
  }

  sendUpdateReplyComment(){
    this.updateComment = {
      content: this.replyCommentContent,
    };
    this.commentService.update(49, this.updateComment)
    .subscribe(res =>{
      this.unUpdateComment();
      this.finishUpdate = true;
      this.editCommentContent = this.commentContent;
    });
  }

  focusInputReplyComment(commentId: number, ownerName: string) {
    this.onReplyComment = true;
    this.editComment = false;
    this.editCommentId = null;
    this.commentContent = '';
    this.replyCommentContent = '';
    this.commentId = commentId;
    this.ownerName = ownerName;
    setTimeout(()=>{
      this.inputCommentReply.setFocus();
    },150);
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

  async openOptinalForCmt(commentId: number, commentContent: string) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'optinal',
      buttons: [{
        text: 'Chỉnh sửa',
        icon: 'create-outline',
        handler: () => {
          console.log('Edit clicked');
          this.editCommentId = commentId;
          this.editComment = true;
          this.commentContent = commentContent.toString();
          setTimeout(()=>{
            this.inputEditComment.setFocus();
          },150);
        }
      },{
        text: 'Xoá',
        icon: 'trash-outline',
        handler: () => {
          console.log('Delete clicked');
          this.deleteComment(commentId);
        }
      }]
    });
    await actionSheet.present();
  }

  async deleteComment(id: number) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      // header: 'Confirm!',
      message: '<strong>Bạn có chắc chắn muốn xoá bình luận này?</strong>!!!',
      buttons: [
        {
          text: 'Huỷ',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Xoá',
          handler: () => {
            this.commentService.delete(id)
            .pipe(first())
            .subscribe(() => {
              this.comments = this.comments.filter(x => x.id !== id);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async openOptinalForCmtId(commentId: number) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'optinal',
      buttons: [{
        text: 'Báo cáo',
        icon: 'alert-outline',
        handler: () => {
          console.log('Report clicked');
          this.openReport(commentId);
        }
      }]
    });
    await actionSheet.present();
  }

  async openReport(commentId) {
    const modal = await this.modalController.create({
      component: ReportComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        targetId: commentId,
        targetType: 2,
      }
    });
    return await modal.present();
  }

}
