/* eslint-disable @typescript-eslint/no-shadow */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { IonInfiniteScroll } from '@ionic/angular';

import { Post, Account, FollowToCreate, ReactionToCreate } from '../_models';
import { PostService, SearchService, FollowService, AccountService, ReactionService, PresenceService } from '../_services';

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
    private transfer: FileTransfer,
    public alertController: AlertController,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.search = false;

    this.postService.getAllByPreference(this.maccount.id)
    .subscribe(res => {
      this.posts = res as Post[];
    });
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
    .subscribe(res => {
      // console.log(res);
      //alert('Tim thành công!');
      this.postService.getAll()
      .subscribe(res => {
          this.posts = res as Post[];
      });
    });
  }

  unReaction(id: number){
    this.reactionService.deletePost(id)
    .subscribe(() => {
      //alert('Bỏ tim thành công!');
      this.postService.getAll()
      .subscribe(res => {
          this.posts = res as Post[];
      });
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

}
