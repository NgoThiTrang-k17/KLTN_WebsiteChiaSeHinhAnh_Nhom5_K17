import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from "@angular/forms";

import { Post, PostToUpdate } from '../../../_models';
import { PostService } from '../../../_services';

@Component({
  selector: 'app-edit-post-dialog',
  templateUrl: './edit-post-dialog.component.html',
  styleUrls: ['./edit-post-dialog.component.less']
})
export class EditPostDialogComponent implements OnInit {

  @ViewChild('editPostForm') editPostForm: NgForm;

  public postId: number;

  title: string;
  description: string;
  isPrivate: boolean;
  statusPost: number;

  public post = new Post;

  postToUpdate: PostToUpdate;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditPostDialogComponent>,
    private postService: PostService,
  ) { }

  ngOnInit(): void {
    this.postId = this.data.postId;

    this.postService.getPostById(this.postId)
    .subscribe(res => {
      this.post = res;
      if(this.post.status == 6){
        this.isPrivate = false;
      } else if(this.post.status == 7){
        this.isPrivate = true;
      }
    })
  }

  updatePost() {
    if(this.isPrivate == true){
      this.statusPost = 7
    } else if(this.isPrivate == false){
      this.statusPost = 6;
    }

    this.postToUpdate = {
      title: this.title,
      description: this.description,
      status: this.statusPost,
    }

    this.postService.update(this.postId, this.postToUpdate)
    .subscribe(res => {
      this.dialogRef.close();
      // alert('Chỉnh sửa thành công!');
    }, error => {
      console.log(error);
    })
  }
}
