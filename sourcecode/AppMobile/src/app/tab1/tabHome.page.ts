/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/no-shadow */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { IonInfiniteScroll } from '@ionic/angular';
import { first } from 'rxjs/operators';

import { Post, Account, FollowToCreate, ReactionToCreate } from '../_models';
import { PostService, SearchService, FollowService, AccountService, ReactionService, PresenceService } from '../_services';
import { ReportComponent } from '../components-share/report/report.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-tabHome',
  templateUrl: 'tabHome.page.html',
  styleUrls: ['tabHome.page.scss']
})
export class TabHomePage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public posts: Post[] = [];
  public accounts: Account[] = [];

  public follow: FollowToCreate;
  public reaction: ReactionToCreate;
  public account: Account;
  public post: Post;

  search = false;
  searchAccount = false;
  str: string;

  maccount = this.accountService.accountValue;

  constructor(
    public postService: PostService,
    private searchService: SearchService,
    private followService: FollowService,
    private accountService: AccountService,
    private reactionService: ReactionService,
    public presence: PresenceService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private file: File,
    private transfer: FileTransfer,
    public alertController: AlertController,
    public modalController: ModalController,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.search = false;

    this.postService.getAllByPreference(this.maccount.id)
    .subscribe(res => {
      this.posts = res as Post[];
    });

    localStorage.removeItem('path');
    localStorage.removeItem('pathPost');
  }

  onSearch(event) {
    this.str = event.target.value;
    if(this.str==='') { return; }
    this.search = true;
    console.log(event.target.value);
    console.log(this.str);
    if(this.str.substr(0,1)==='@')
    {
        this.searchAccount = true;
        this.searchService.getAllAccount(this.str)
        .subscribe(res => {
            this.accounts = res as Account[];
        });
    }
    else if(this.str.substr(0,1)!=='@'){
        this.searchService.getAllPost(this.str)
        .subscribe(res => {
            this.posts = res as Post[];
        });
    }
    // this.returnURL = this.route.snapshot.queryParams['/search/']+this.search;
    // this.router.navigateByUrl(this.returnURL, { skipLocationChange: true });
  }

  unSearch() {
    this.search = false;
  }

  onCreateReaction(id: number) {
    this.reaction = {
      targetId: id,
    };
    // console.log(this.reaction);
    this.reactionService.createReaction(this.reaction)
    .pipe(first())
    .subscribe({
      next: () => {
        const post = this.posts.find((x: Post) => {
          if(x.id === id){
            x.isReactedByThisUser = true;
            x.reactionCount++;
          }
        });
        this.posts = this.posts;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  unReaction(id: number){
    this.reactionService.deletePost(id)
    .pipe(first())
    .subscribe({
      next: () => {
        const post = this.posts.find((x: Post) => {
          if(x.id === id){
            x.isReactedByThisUser = false;
            x.reactionCount--;
          }
        });
        this.posts = this.posts;
      },
      error: error => {
        console.log(error);
      }
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
      },{
        text: 'Báo cáo',
        icon: 'alert-outline',
        handler: () => {
          console.log('Report clicked');
          this.openReport(postId);
        }
      }
    ]
    });
    await actionSheet.present();
  }

  download(path){
    const pathh = this.file.dataDirectory;

    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(path, this.file.dataDirectory+'hinh.jpg').then((entry) => {
      const url = entry.toURL();
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
            .pipe(first())
            .subscribe(() => {
              this.posts = this.posts.filter(x => x.id !== id);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.posts.length === 1000) {
        event.target.disabled = true;
      }
    }, 500);
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
