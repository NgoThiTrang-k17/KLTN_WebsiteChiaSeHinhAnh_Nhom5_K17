/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-trailing-spaces */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { first } from 'rxjs/operators';

import { Account, Post, ReactionToCreate, FollowToCreate } from '../../_models';
import { AccountService, PresenceService, SearchService, FollowService, ReactionService, PostService } from '../../_services';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {

  public query: string;
  public searchAccount: boolean;

  public follow: FollowToCreate;
  public reaction: ReactionToCreate;
  public account: Account;
  public post: Post;

  public accounts: Account[] = [];
  public posts: Post[] = [];

  maccount = this.accountService.accountValue;

  constructor(
    public actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    public alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private searchService: SearchService,
    private followService: FollowService,
    private reactionService: ReactionService,
    public postService: PostService,
    public presence: PresenceService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.query = this.route.snapshot.params.query;
    if(this.query.substr(0,1)==='@')
    {
      this.searchAccount = true;
      this.searchService.getAllAccount(this.query)
      .subscribe(res => {
        this.accounts = res as Account[];
      });
    }
    else if(this.query.substr(0,1)!=='@'){
      this.searchService.getAllPost(this.query)
      .subscribe(res => {
        this.posts = res as Post[];
      });
    }
  }

  onCreateFollow(id) {
    this.follow = {
      subjectId: id,
    };
    console.log(this.follow);
    this.followService.createFollow(this.follow)
    .subscribe(res => {
      const account = this.accounts.find((x: Account) => {
        if(x.id === id){
          x.isFollowedByCurrentUser = 1;
        }
      });
      this.searchService.getAllAccount(this.query)
      .pipe(first())
      .subscribe(res => {
        this.accounts = this.accounts;
      });
    });
  }

  unFollow(id) {
    this.followService.delete(id)
    .subscribe(() => {
      const account = this.accounts.find((x: Account) => {
        if(x.id === id){
          x.isFollowedByCurrentUser = 0;
        }
      });
      this.searchService.getAllAccount(this.query)
      .pipe(first())
      .subscribe(res => {
        this.accounts = this.accounts;
      });
    });
  }

  onCreateReaction(id: number) {
    this.reaction = {
      targetId: id,
    };
    // console.log(this.reaction);
    this.reactionService.createReaction(this.reaction)
    .pipe(first())
    .subscribe(res => {
      const post = this.posts.find((x: Post) => {
        if(x.id === id){
          x.isReactedByThisUser = true;
        }
      });
      this.searchService.getAllPost(this.query)
      .pipe(first())
      .subscribe(res => {
        this.posts = this.posts;
      });
    });
  }

  unReaction(id: number){
    this.reactionService.deletePost(id)
    .subscribe(() => {
      const post = this.posts.find((x: Post) => {
        if(x.id === id){
          x.isReactedByThisUser = false;
        }
      });
      this.searchService.getAllPost(this.query)
      .pipe(first())
      .subscribe(res => {
        this.posts = this.posts;
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

}
