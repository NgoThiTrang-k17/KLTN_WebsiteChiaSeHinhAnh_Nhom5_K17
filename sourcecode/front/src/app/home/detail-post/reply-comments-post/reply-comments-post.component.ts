import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';

import { Account, Comment, commentToCreateForCmt, CommentToUpdate, ReactionCmtToCreate } from '../../../_models';
import { AccountService, PresenceService, CommentService, ReactionService } from '../../../_services';
import { ReportComponent } from '../../report/report.component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-reply-comments-post',
  templateUrl: './reply-comments-post.component.html',
  styleUrls: ['./reply-comments-post.component.less']
})
export class ReplyCommentsPostComponent implements OnInit {

  @Input() commentId: number;
  @Input() postId: number;
  @ViewChild('commentForm') commentForm: NgForm;
  @ViewChild('inputEditCmt') inputEditCmtElement: ElementRef;
  @ViewChild('inputComment') inputCommentElement: ElementRef;

  public comments: Comment[] = [];

  public account = new Account;

  cmtCreate: commentToCreateForCmt;
  cmtUpdate: CommentToUpdate;
  reactionCmt: ReactionCmtToCreate;

  editComment: boolean;
  editCommentId: number;
  contentCommentEdit: string;
  contentComment: string;

  maccount = this.accountService.accountValue;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private accountService: AccountService,
    private commentService: CommentService,
    private reactionService: ReactionService,
    public presenceService: PresenceService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.editComment = false;

    this.commentService.getAllByCommentId(this.commentId)
    .subscribe(res => {
      this.comments = res as Comment[];
    })

    this.accountService.getById(this.maccount.id)
    .subscribe(res => {
      this.account = res;
    })

    setTimeout(()=>{
      this.inputCommentElement.nativeElement.focus();
    },0);
  }

  createCmt(event) {
    var str = event.target.value;
    if(str=='') { return; }
    this.cmtCreate = {
      content: str,
      parrentId: this.commentId,
      postId: this.postId,
    }
    this.commentService.create(this.cmtCreate)
    .subscribe(res => {
      this.contentComment = '';
      this.commentService.getAllByCommentId(this.commentId)
      .subscribe(res => {
        this.comments = res as Comment[];
      })
    }, error => {
      alert('Có một số lỗi ở đây! Bạn thực hiện thao tác này sau nhé! Xin lỗi vì sự bất tiện này!');
      console.log(error);
    })
  }

  deleteComment(id: number) {
    var r = confirm("Bạn có chắc chắn muốn xoá bình luận này?");
    if(r)
    {
      try {
        this.commentService.delete(id)
        .subscribe(() => {
          this.commentService.getAllByCommentId(this.commentId)
          .subscribe(res => {
            this.comments = res as Comment[];
          })
        });
      } catch (e) {
        alert('Có một số lỗi ở đây! Bạn thực hiện thao tác này sau nhé! Xin lỗi vì sự bất tiện này!');
        console.log(e);
      }
    }
  }

  onEditComment(id: number, content: string) {
    this.editComment = true;
    this.editCommentId = id;
    this.contentCommentEdit = content;
    setTimeout(()=>{
      this.inputEditCmtElement.nativeElement.focus();
    },0);
  }

  cancelEdit() {
    this.editComment = false;
  }

  updateCmt(event) {
    var str = event.target.value;
    if(str=='') { return; }
    this.cmtUpdate = {
      content: str,
    }

    this.commentService.update(this.editCommentId ,this.cmtUpdate)
    .subscribe(res => {
      this.editComment = false;
      this.commentService.getAllByCommentId(this.commentId)
      .subscribe(res => {
        this.comments = res as Comment[];
      })
    }, error => {
        console.log(error);
    })
  }

  onCreateReactionCmt(cmtId: number) {
    this.reactionCmt = {
      target: 1,
      targetId: cmtId,
    }
    this.reactionService.createReaction(this.reactionCmt)
    .pipe(first())
    .subscribe({
      next: () => {
        const comment = this.comments.find((x: Comment) => {
          if(x.id == cmtId){
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

  unCreateReactionCmt(cmtId: number) {
    this.reactionService.deleteCmt(cmtId)
    .pipe(first())
    .subscribe({
      next: () => {
        const comment = this.comments.find((x: Comment) => {
          if(x.id == cmtId){
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

  openReportDialog(commentId: number){
    let dialogRef1 = this.dialog.open(ReportComponent,{
      width: '500px',
      minHeight: '200px',
      maxHeight:'600px',
      data: {
        targetId: commentId,
        targetType: 2,
      }
    });
  }

}
