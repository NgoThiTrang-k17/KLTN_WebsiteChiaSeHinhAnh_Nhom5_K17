import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

import { Post, Account, Follow, FollowToCreate, ReactionToCreate } from '../../_models'
import { AccountService, PostService, FollowService, ReactionService } from '../../_services';
import { CommentPage } from '../comment/comment.page';

@Component({
  selector: 'app-detailPost',
  templateUrl: './detailPost.page.html',
  styleUrls: ['./detailPost.page.scss'],
})
export class DetailPostPage implements OnInit {

  postId: number;
  owner: number;

  post = new Post;
  account = new Account;
  mfollow = new Follow;

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
    private accountService: AccountService,
    private postService: PostService,
    private followService: FollowService,
    private reactionService: ReactionService,
  ) { }

  ngOnInit() {
    this.postId = this.route.snapshot.params['postId'];
    this.owner = this.route.snapshot.params['ownerId'];

    this.postService.getPostById(this.postId)
    .subscribe((res:any)=>{
      this.post = res;
    })

    this.accountService.getById(this.owner)
    .subscribe((res:any)=>{
      this.account = res;
    })

    this.followService.getFollow(this.owner)
    .subscribe((res:any)=>{
        this.mfollow = res;
    })
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
      this.postService.getPostById(this.postId)
      .subscribe((res:any)=>{
        this.post = res;
      })
      this.followService.getFollow(this.owner)
      .subscribe((res:any)=>{
          this.mfollow = res;
      })
    });
  }

  unFollow(id:any) {
    this.followService.delete(id)
    .subscribe(() => {
      //alert('Bỏ follow thành công!');
      this.postService.getPostById(this.postId)
      .subscribe((res:any)=>{
        this.post = res;
      })
      this.followService.getFollow(this.owner)
      .subscribe((res:any)=>{
          this.mfollow = res;
      })
    });
  }

  onCreateReaction() {
    this.reaction = {
      targetId: this.post.id,
    }
    // console.log(this.reaction);
    this.reactionService.createReaction(this.reaction)
    .subscribe(res => {
      // console.log(res);
      //alert('Tim thành công!');
      this.postService.getPostById(this.postId)
      .subscribe((res:any)=>{
        this.post = res;
      })
    });
  }

  unReaction() {
    this.reactionService.deletePost(this.post.id)
    .subscribe(() => {
      //alert('Bỏ tim thành công!');
      this.postService.getPostById(this.postId)
      .subscribe((res:any)=>{
        this.post = res;
      })
    });
  }

  async deletePost(id: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
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
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
}
