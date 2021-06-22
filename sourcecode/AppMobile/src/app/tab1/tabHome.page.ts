import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { Post, Account, FollowToCreate, ReactionToCreate } from '../_models';
import { PostService, SearchService, FollowService, AccountService, ReactionService, PresenceService } from '../_services';

@Component({
  selector: 'app-tabHome',
  templateUrl: 'tabHome.page.html',
  styleUrls: ['tabHome.page.scss']
})
export class TabHomePage implements OnInit {

  public posts: Post[] = [];
  public accounts: Account[] = [];

  public follow: FollowToCreate;
  public reaction: ReactionToCreate;
  public account: Account;
  public post: Post;

  search = false;
  searchAccount = false;

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

    this.postService.getAll()
    .subscribe(res => {
      this.posts = res as Post[];
    });
  }

  onSearch(event) {
    var str = event.target.value;
    if(str=='') { return; }
    this.search = true;
    console.log(event.target.value);
    console.log(str);
    if(str.substr(0,1)=='@')
    {
        this.searchAccount = true;
        this.searchService.getAllAccount(str)
        .subscribe(res => {
            this.accounts = res as Account[];
        });
    }
    else if(str.substr(0,1)!='@'){
        this.searchService.getAllPost(str)
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

  onCreateFollow(id:any) {
    this.follow = {
      subjectId: id,
    }
    console.log(this.follow);
    this.followService.createFollow(this.follow)
    .subscribe(res => {
      console.log(res);
      //alert('Follow thành công!');
      this.accountService.getById(id)
        .subscribe((res:any)=>{
            this.account = res;
            console.log(this.account.isFollowedByCurrentUser);
            this.router.routeReuseStrategy.shouldReuseRoute = () =>{
                return false;
            }
        })
    });
  }

  unFollow(id:any) {
    this.followService.delete(id)
    .subscribe(() => {
      //alert('Bỏ follow thành công!');
      this.accountService.getById(id)
        .subscribe((res:any)=>{
            this.account = res;
            console.log(this.account.isFollowedByCurrentUser);
            this.router.routeReuseStrategy.shouldReuseRoute = () =>{
                return false;
            }
        })
    });
  }

  onCreateReaction(id:number) {
    this.reaction = {
      targetId: id,
    }
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

  unReaction(id:number){
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
      },{
        text: 'Chia sẻ',
        icon: 'share-social-outline',
        handler: () => {
          console.log('Share clicked');
        }
      },{
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
        text: 'Chia sẻ',
        icon: 'share-social-outline',
        handler: () => {
          console.log('Share clicked');
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
