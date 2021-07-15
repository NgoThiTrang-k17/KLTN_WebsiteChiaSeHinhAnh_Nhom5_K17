/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-trailing-spaces */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, LoadingController  } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';

import { Account, AccountUpdateAvatar, Post } from '../../_models';
import { AccountService, PostService } from '../../_services';

@Component({
  selector: 'app-update-avatar',
  templateUrl: './update-avatar.component.html',
  styleUrls: ['./update-avatar.component.scss'],
})
export class UpdateAvatarComponent implements OnInit {

  @ViewChild('updateAvatarForm') updateAvatarForm: NgForm;

  isUpload: boolean;
  path: any;
  pathImage: string;
  imageSrc: string;
  imagePath: string;
  file: string;
  accountUpdateAvatar: AccountUpdateAvatar;

  public account = new Account();
  public posts: Post[] = [];

  maccount = this.accountService.accountValue;

  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    private af: AngularFireStorage,
    private accountService: AccountService,
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.isUpload = false;
    this.pathImage = '';
    this.imageSrc = '';

    this.accountService.getById(this.maccount.id)
    .subscribe(res => {
      this.account = res;
    });

    this.postService.getAllByUserId(this.maccount.id)
    .subscribe(res =>{
      console.log(res);

      this.posts = res as Post[];
    });
  }

  onFileChange($event) {
    this.isUpload = true;

    this.path = $event.target.files[0];

    const reader = new FileReader();
    if ($event.target.files && $event.target.files.length) {
        const [file] = $event.target.files;
        console.log('1');
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageSrc = reader.result as string;
        };
    }
  }

  clickChoseImage(path: string){
    this.isUpload = false;
    this.pathImage = path;
    this.imageSrc = path;
  }

  updateAvatar(){
    this.presentLoading();

    this.imagePath = "/files"+Math.random()+this.path;
    const fileRef = this.af.ref(this.imagePath);
    this.af.upload(this.imagePath,this.path).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.pathImage = url.toString();
          console.log(this.pathImage);

          this.accountUpdateAvatar = {
            avatarPath: this.pathImage,
          };

          this.accountService.update(this.maccount.id, this.accountUpdateAvatar)
          .subscribe(res => {
            this.loadingController.dismiss({
              dismissed: true
            });
            this.closeModalCmt();
          }, error => {
            this.closeModalCmt();
          });
        });
      })
    ).subscribe();
  }

  updateAvatarChoose(){
    this.presentLoading();

    this.accountUpdateAvatar = {
      avatarPath: this.pathImage.toString(),
    };

    this.accountService.update(this.maccount.id, this.accountUpdateAvatar)
    .subscribe(res => {
      this.loadingController.dismiss({
        dismissed: true
      });
      this.closeModalCmt();
    }, error => {
      this.closeModalCmt();
    });
  }

  closeModalCmt() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Chờ xíu nhé...',
    });
    await loading.present();
  }
}
