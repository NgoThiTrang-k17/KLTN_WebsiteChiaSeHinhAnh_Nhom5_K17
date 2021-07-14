/* eslint-disable no-trailing-spaces */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { Account, Post, FollowToCreate, ReactionToCreate } from '../_models';
import { AccountService, PresenceService, PostService, FollowService, ReactionService } from '../_services';
import { AddEditPostComponent } from '../add-edit-post/add-edit-post.component';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  accountId: number;
  id: number;
  postId: number;

  follow: FollowToCreate;
  reaction: ReactionToCreate;

  public account = new Account();
  public posts: Post[] = [];

  maccount = this.accountService.accountValue;

  constructor(
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public modalController: ModalController,
    private transfer: FileTransfer,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private presenceService: PresenceService,
    private postService: PostService,
    private followService: FollowService,
    private reactionService: ReactionService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.postId = this.route.snapshot.params.postId;

    localStorage.removeItem('pathPost');

    if(this.id !== undefined){
      this.accountId = this.id;

      localStorage.setItem('pathPost', '../../../account/'+ this.id + '/' + this.postId);
    } else if(this.id === undefined){
      this.accountId = this.maccount.id;

      localStorage.setItem('path', 'tab/tabs/account');
    }

    this.accountService.getById(this.accountId)
    .subscribe(res => {
      console.log(res);

      this.account = res;
    });

    this.postService.getAllByUserId(this.accountId)
    .subscribe(res => {
      this.posts = res as Post[];
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
    });
  }

  unFollow(id: number) {
    this.followService.delete(id)
    .pipe(first())
    .subscribe(() => {
      this.account.isFollowedByCurrentUser = 0;
    });
  }

  onCreateReaction(id: number) {
    this.reaction = {
      targetId: id,
    };
    this.reactionService.createReaction(this.reaction)
    .pipe(first())
    .subscribe(res => {
      const post = this.posts.find((x: Post) => {
        if(x.id === id){
          x.isReactedByThisUser = true;
          x.reactionCount++;
        }
      });
      this.posts = this.posts;
    });
  }

  unReaction(id: number){
    this.reactionService.deletePost(id)
    .subscribe(() => {
      const post = this.posts.find((x: Post) => {
        if(x.id === id){
          x.isReactedByThisUser = false;
          x.reactionCount--;
        }
      });
      this.posts = this.posts;
    });
  }

  async openOptinalMyPost(path: string, postId: number) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'optinal',
      buttons: [{
        text: 'Tải ảnh xuống',
        icon: 'cloud-download-outline',
        handler: () => {
          console.log('Download!');
          this.download(path);
        }
      },
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
      buttons: [{
        text: 'Tải ảnh xuống',
        icon: 'cloud-download-outline',
        handler: () => {
          console.log('Download!');
          this.download(path);
        }
      },
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
      this.postService.getAllByUserId(this.accountId)
      .subscribe(res => {
        this.posts = res as Post[];
      });
    });
    return await modal.present();
  }

}
