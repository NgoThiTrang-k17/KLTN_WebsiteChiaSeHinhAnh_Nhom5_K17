/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { Post, Account, Follow, FollowToCreate, ReactionToCreate } from '../../_models';
import { PresenceService, AccountService, PostService, FollowService, ReactionService } from '../../_services';

import { CommentPage } from '../comment/comment.page';
import { AddEditPostComponent } from '../../components-share/add-edit-post/add-edit-post.component';
import { ReportComponent } from '../../components-share/report/report.component';

@Component({
  selector: 'app-detailPost',
  templateUrl: './detailPost.page.html',
  styleUrls: ['./detailPost.page.scss'],
})
export class DetailPostPage implements OnInit {

  postId: number;
  owner: number;
  path: string;

  post = new Post();
  account = new Account();
  mfollow = new Follow();

  public posts: Post[] = [];

  public follow: FollowToCreate;
  public reaction: ReactionToCreate;

  maccount = this.accountService.accountValue;

  constructor(
    // private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    public modalController: ModalController,
    public presenceService: PresenceService,
    private accountService: AccountService,
    private postService: PostService,
    private followService: FollowService,
    private reactionService: ReactionService,
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
  ) { }

  ngOnInit() {
    this.postId = this.route.snapshot.params.postId;
    this.owner = this.route.snapshot.params.ownerId;

    this.postService.getPostById(this.postId)
    .subscribe((res: any)=>{
      this.post = res;
    });

    this.accountService.getById(this.owner)
    .subscribe((res: any)=>{
      this.account = res;
    });

    this.followService.getFollow(this.owner)
    .subscribe((res: any)=>{
        this.mfollow = res;
    });
  }

  onCreateFollow(id: any) {
    this.follow = {
      subjectId: id,
    };

    this.followService.createFollow(this.follow)
    .subscribe(res => {
      this.account.isFollowedByCurrentUser = 1;
      this.account.followerCount++;
    });
  }

  unFollow(id: any) {
    this.followService.delete(id)
    .subscribe(() => {
      this.account.isFollowedByCurrentUser = 0;
      this.account.followerCount--;
    });
  }

  onCreateReaction() {
    this.reaction = {
      targetId: this.post.id,
    };
    // console.log(this.reaction);
    this.reactionService.createReaction(this.reaction)
    .subscribe(res => {
      // console.log(res);
      //alert('Tim thành công!');
      this.postService.getPostById(this.postId)
      .subscribe((res: any)=>{
        this.post = res;
      });
    });
  }

  unReaction() {
    this.reactionService.deletePost(this.post.id)
    .subscribe(() => {
      //alert('Bỏ tim thành công!');
      this.postService.getPostById(this.postId)
      .subscribe((res: any)=>{
        this.post = res;
      });
    });
  }

  async openOptinalMyPost(postId: number) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'optinal',
      buttons: [{
        text: 'Chỉnh sửa',
        icon: 'create-outline',
        handler: () => {
          console.log('Edit clicked');
          this.openEditPost(postId);
        }
      },{
        text: 'Xoá',
        icon: 'trash-outline',
        handler: () => {
          console.log('Delete clicked');
          this.deletePost(postId);
        }
      }]
    });
    await actionSheet.present();
  }

  download(path){
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(path, path).then((entry) => {
      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      console.log(error);
    });
  }

  async deletePost(id: number) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      // header: 'Confirm!',
      message: '<strong>Bạn có chắc chắn muốn xoá bài viết này?</strong>!!!',
      buttons: [
        {
          text: 'Huỷ',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Xoá',
          handler: () => {
            this.postService.delete(id)
            .subscribe(() => {
              this.router.navigate(['../../../../../../']);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async openComment() {
    const modal = await this.modalController.create({
      component: CommentPage,
      cssClass: 'my-custom-class',
      componentProps: {
        postId: this.post.id,
      }
    });
    return await modal.present();
  }

  async openEditPost(id: number) {
    const modal = await this.modalController.create({
      component: AddEditPostComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        postId: id,
      }
    });

    modal.onDidDismiss().then(data => {
      this.postService.getPostById(this.postId)
      .subscribe((res: any)=>{
        this.post = res;
      });
    });
    return await modal.present();
  }

  back() {
    this.path = localStorage.getItem('path');
    const pathAccount = localStorage.getItem('pathPost');

    if( pathAccount == null ){
      if(this.path == null){
        this.router.navigate([''], { relativeTo: this.route });
      } else if(this.path != null){
        this.router.navigate([this.path]);
      }
    } else if( pathAccount != null ) {
      this.router.navigate([pathAccount], { relativeTo: this.route });
    }
  }

  async openReport(postId) {
    const modal = await this.modalController.create({
      component: ReportComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        targetId: postId,
        targetType: 1,
      }
    });
    return await modal.present();
  }
}
