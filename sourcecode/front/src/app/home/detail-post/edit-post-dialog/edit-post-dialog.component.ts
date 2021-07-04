import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from "@angular/forms";

import { Post, PostToUpdate } from '../../../_models';
import { PostService } from '../../../_services';
import { title } from 'process';

@Component({
  selector: 'app-edit-post-dialog',
  templateUrl: './edit-post-dialog.component.html',
  styleUrls: ['./edit-post-dialog.component.less']
})
export class EditPostDialogComponent implements OnInit {

  @ViewChild('editPostForm') editPostForm: NgForm;

  public postId: number;

  title: string;
  destription: string;

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
    })
  }

  updatePost() {
    this.postToUpdate = {
      title: this.title,
      description: this.destription,
    }

    this.postService.update(this.postId, this.postToUpdate)
    .subscribe(res => {
      this.dialogRef.close();
      alert('Chỉnh sửa thành công!');
    }, error => {
      console.log(error);
    })
  }
}
