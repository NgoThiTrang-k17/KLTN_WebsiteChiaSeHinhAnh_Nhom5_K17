/* eslint-disable no-cond-assign */
/* eslint-disable no-trailing-spaces */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { Account, Post, FollowToCreate, ReactionToCreate } from '../_models';
import { AccountService, PresenceService, PostService, FollowService, ReactionService } from '../_services';
import { AddEditPostComponent } from '../components-share/add-edit-post/add-edit-post.component';
import { EditProfileComponent } from '../components-share/edit-profile/edit-profile.component';
import { UpdateAvatarComponent } from '../components-share/update-avatar/update-avatar.component';
import { ListFollowComponent } from '../components-share/list-follow/list-follow.component';
import { ReportComponent } from '../components-share/report/report.component';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  accountId: number;
  id: number;
  postId: number;

  public isPrivate: boolean;
  public isLike: boolean;

  follow: FollowToCreate;
  reaction: ReactionToCreate;

  public account = new Account();
  public posts: Post[] = [];
  public privatePosts: Post[] = [];
  public likePosts: Post[] = [];

  maccount = this.accountService.accountValue;

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public modalController: ModalController,
    private transfer: FileTransfer,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    public presenceService: PresenceService,
    private postService: PostService,
    private followService: FollowService,
    private reactionService: ReactionService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.postId = this.route.snapshot.params.postId;
    this.isPrivate = false;
    this.isLike = false;

    localStorage.removeItem('pathPost');
    localStorage.setItem('path', 'tab/tabs/account');

    if(this.id !== undefined){
      this.accountId = this.id;

      localStorage.removeItem('path');
      localStorage.setItem('pathPost', '../../../account/'+ this.id + '/' + this.postId);
    } else if(this.id === undefined){
      this.accountId = this.maccount.id;
    }

    this.accountService.getById(this.accountId)
    .subscribe(res => {
      this.account = res;
    });

    this.postService.getAllByUserId(this.accountId)
    .subscribe(res => {
      this.posts = res as Post[];
    });
  }

  openPublic(){
    this.isPrivate = false;
    this.isLike = false;
  }

  openPrivate(){
    this.isPrivate = true;
    this.isLike = false;

    this.postService.getAllPrivatePost()
    .subscribe(res => {
      this.privatePosts = res as Post[];
    });
  }

  openLike(){
    this.isPrivate = false;
    this.isLike = true;

    this.postService.getAllLikePost()
    .subscribe(res => {
      this.likePosts = res as Post[];
    });
  }

  back(){
    if(this.postId == null){
      this.router.navigate(['../../'], { relativeTo: this.route });
    } else if(this.postId != null){
      this.router.navigate(['../../../detail/' + this.postId + '/' + this.id], { relativeTo: this.route });
    }
    localStorage.removeItem('pathPost');
  }

  onCreateFollow(id: number) {
    this.follow = {
      subjectId: id,
    };
    console.log(this.follow);
    this.followService.createFollow(this.follow)
    .pipe(first())
    .subscribe(() => {
      this.account.isFollowedByCurrentUser = 1;
      this.account.followerCount++;
    });
  }

  unFollow(id: number) {
    this.followService.delete(id)
    .pipe(first())
    .subscribe(() => {
      this.account.isFollowedByCurrentUser = 0;
      this.account.followerCount--;
    });
  }

  onCreateReaction(id: number) {
    this.reaction = {
      targetId: id,
    };
    this.reactionService.createReaction(this.reaction)
    .pipe(first())
    .subscribe(res => {
      if(this.isPrivate === false && this.isLike === false){
        const post = this.posts.find((x: Post) => {
          if(x.id === id){
            x.isReactedByThisUser = true;
            x.reactionCount++;
          }
        });
        this.posts = this.posts;
      } else if(this.isPrivate === true){
        const post = this.privatePosts.find((x: Post) => {
          if(x.id === id){
            x.isReactedByThisUser = true;
            x.reactionCount++;
          }
        });
        this.privatePosts = this.privatePosts;
      } else if(this.isLike === true){
        const post = this.likePosts.find((x: Post) => {
          if(x.id === id){
            x.isReactedByThisUser = true;
            x.reactionCount++;
          }
        });
        this.likePosts = this.likePosts;
      }
    });
  }

  unReaction(id: number){
    this.reactionService.deletePost(id)
    .pipe(first())
    .subscribe(() => {
      if(this.isPrivate === false && this.isLike === false){
        const post = this.posts.find((x: Post) => {
          if(x.id === id){
            x.isReactedByThisUser = false;
            x.reactionCount--;
          }
        });
        this.posts = this.posts;
      } else if(this.isPrivate === true){
        const post = this.privatePosts.find((x: Post) => {
          if(x.id === id){
            x.isReactedByThisUser = false;
            x.reactionCount--;
          }
        });
        this.privatePosts = this.privatePosts;
      } else if(this.isLike === true){
        const post = this.likePosts.find((x: Post) => {
          if(x.id === id){
            x.isReactedByThisUser = false;
            x.reactionCount--;
          }
        });
        this.likePosts = this.likePosts;
      }
    });
  }

  async openOptinalMyPost(path: string, postId: number) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'optinal',
      buttons: [
      //   {
      //   text: 'Tải ảnh xuống',
      //   icon: 'cloud-download-outline',
      //   handler: () => {
      //     console.log('Download!');
      //     this.download(path);
      //   }
      // },
      // {
      //   text: 'Chia sẻ',
      //   icon: 'share-social-outline',
      //   handler: () => {
      //     console.log('Share clicked');
      //   }
      // },
      {
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

  async openOptinal(path: string, postId: number) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'optinal',
      buttons: [
        {
          text: 'Báo cáo',
          icon: 'alert-outline',
          handler: () => {
            console.log('Report clicked');
            this.openReportPost(postId);
          }
        }
      //   {
      //   text: 'Tải ảnh xuống',
      //   icon: 'cloud-download-outline',
      //   handler: () => {
      //     console.log('Download!');
      //     this.download(path);
      //   }
      // },
      // {
      //   text: 'Chia sẻ',
      //   icon: 'share-social-outline',
      //   handler: () => {
      //     console.log('Share clicked');
      //   }
      // }
    ]
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
        }, {
          text: 'Xoá',
          handler: () => {
            this.postService.delete(id)
            .subscribe(() => {
              this.postService.getAll()
              .subscribe(res => {
                this.posts = res as Post[];
              });
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async openAddPost() {
    const modal = await this.modalController.create({
      component: AddEditPostComponent,
      cssClass: 'my-custom-class',
      componentProps: {
      }
    });

    modal.onDidDismiss().then(data => {
      this.postService.getAllByUserId(this.accountId)
      .subscribe(res => {
        this.posts = res as Post[];
      });
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
      if(this.isPrivate === false && this.isLike === false){
        this.postService.getAllByUserId(this.accountId)
        .subscribe(res => {
          this.posts = res as Post[];
        });
      } else if(this.isPrivate === true){
        this.postService.getAllPrivatePost()
        .subscribe(res => {
          this.privatePosts = res as Post[];
        });
      }
    });
    return await modal.present();
  }

  async openEditProfile(id: number) {
    const modal = await this.modalController.create({
      component: EditProfileComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        accountId: id,
      }
    });

    modal.onDidDismiss().then(data => {
      this.accountService.getById(this.accountId)
      .subscribe(res => {
        this.account = res;
      });
    });
    return await modal.present();
  }

  async openUpdateAvatar() {
    const modal = await this.modalController.create({
      component: UpdateAvatarComponent,
      cssClass: 'my-custom-class',
      componentProps: {
      }
    });

    modal.onDidDismiss().then(data => {
      this.accountService.getById(this.accountId)
      .subscribe(res => {
        this.account = res;
      });
    });
    return await modal.present();
  }

  async openFollowerList() {
    const modal = await this.modalController.create({
      component: ListFollowComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        accountId: this.accountId,
        count: this.account.followerCount,
        isFollower: true,
      }
    });

    modal.onDidDismiss().then(data => {
      this.accountService.getById(this.accountId)
      .subscribe(res => {
        this.account = res;
      });
    });
    return await modal.present();
  }

  async openFollowingList() {
    const modal = await this.modalController.create({
      component: ListFollowComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        accountId: this.accountId,
        count: this.account.followingCount,
        isFollower: false,
      }
    });

    modal.onDidDismiss().then(data => {
      this.accountService.getById(this.accountId)
      .subscribe(res => {
        this.account = res;
      });
    });
    return await modal.present();
  }

  async openReportPost(postId) {
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

  async openReportUser() {
    const modal = await this.modalController.create({
      component: ReportComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        targetId: this.accountId,
        targetType: 0,
      }
    });
    return await modal.present();
  }

}
