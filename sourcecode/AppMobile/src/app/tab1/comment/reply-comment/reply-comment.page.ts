/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-shadow */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { first } from 'rxjs/operators';

import { Comment, ReactionCmtToCreate } from '../../../_models';
import { CommentService, ReactionService } from '../../../_services';

@Component({
  selector: 'app-reply-comment',
  templateUrl: './reply-comment.page.html',
  styleUrls: ['./reply-comment.page.scss'],
})
export class ReplyCommentPage implements OnInit {

  @Input() commentId: number;
  @Input() editCommentContent: string;
  @Output() editReplyCommentId = new EventEmitter<any>();

  public comments: Comment[] = [];

  onEditComment: boolean;
  editCommentId: number;

  reaction: ReactionCmtToCreate;

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public commentService: CommentService,
    public reactionService: ReactionService,
  ) { }

  ngOnInit() {

    this.onEditComment = false;
    this.commentService.getAllByCommentId(this.commentId)
    .pipe(first())
    .subscribe((res: any)=>{
      this.comments = res as Comment[];
      const comment = this.comments.find((x: Comment) => {
        if(x.id === this.editCommentId){
          x.content = this.editCommentContent;
        }
      });
      this.comments = this.comments;
    });

    if(this.onEditComment){

    }
  }

  onCreateReactionComment(id: number){
    this.reaction = {
      target: 1,
      targetId: id
    };
    this.reactionService.createReaction(this.reaction)
    .subscribe(res => {
      this.commentService.getAllByCommentId(this.commentId)
      .subscribe((res: any)=>{
        this.comments = res as Comment[];
      });
    });
  }

  unReactionComment(id: number){
    this.reactionService.deleteCmt(id)
    .subscribe(res => {
      this.commentService.getAllByCommentId(this.commentId)
      .subscribe((res: any)=>{
        this.comments = res as Comment[];
      });
    });
  }

  async openOptinalForCmt(commentId: number, content: string) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'optinal',
      buttons: [{
        text: 'Chỉnh sửa',
        icon: 'create-outline',
        handler: () => {
          console.log('Edit clicked');
          this.onEditComment = true;
          this.editCommentId = commentId;
          this.editReplyCommentId.emit(commentId);
          this.editReplyCommentId.emit(content);
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

}
