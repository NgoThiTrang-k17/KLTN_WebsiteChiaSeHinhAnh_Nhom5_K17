import { Component, Input, OnInit } from '@angular/core';

import { Comment, ReactionCmtToCreate } from '../../../_models';
import { CommentService, ReactionService } from '../../../_services';

@Component({
  selector: 'app-reply-comment',
  templateUrl: './reply-comment.page.html',
  styleUrls: ['./reply-comment.page.scss'],
})
export class ReplyCommentPage implements OnInit {

  @Input() commentId: number;

  public comments: Comment[] = [];

  reaction: ReactionCmtToCreate;

  constructor(
    public commentService: CommentService,
    public reactionService: ReactionService,
  ) { }

  ngOnInit() {
    this.commentService.getAllByCommentId(this.commentId)
      .subscribe((res:any)=>{
        console.log(res);

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
      this.commentService.getAllByCommentId(this.commentId)
      .subscribe((res:any)=>{
        this.comments = res as Comment[];
      })
    })
  }

  unReactionComment(id: number){
    this.reactionService.deleteCmt(id)
    .subscribe(res => {
      this.commentService.getAllByCommentId(this.commentId)
      .subscribe((res:any)=>{
        this.comments = res as Comment[];
      })
    })
  }

}
