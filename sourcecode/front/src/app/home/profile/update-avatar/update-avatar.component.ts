import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

import { Account, AccountUpdateAvatar, Post } from '../../../_models';
import { AccountService, PostService } from '../../../_services';

@Component({
  selector: 'app-update-avatar',
  templateUrl: './update-avatar.component.html',
  styleUrls: ['./update-avatar.component.less']
})
export class UpdateAvatarComponent implements OnInit {

  maccount = this.accountService.accountValue;

  public account = new Account;
  public posts: Post[] = [];

  isUpload: boolean;
  path: any;
  pathImage: string;
  imageSrc: string;
  imagePath: string;
  file: string;

  accountUpdateAvatar: AccountUpdateAvatar;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateAvatarComponent>,
    private af: AngularFireStorage,
    private accountService: AccountService,
    private postService: PostService,
  ) { }

  ngOnInit(): void {
    this.isUpload = false;
    this.pathImage = '';

    this.accountService.getById(this.maccount.id)
    .subscribe(res => {
      this.account = res;
    })

    this.postService.getAllByUserId(this.maccount.id)
    .subscribe(res => {
      this.posts = res as Post[];
    })
  }

  onFileChange($event) {
    this.isUpload = true;

    this.path = $event.target.files[0]

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
    this.imagePath = "/files"+Math.random()+this.path;
    const fileRef = this.af.ref(this.imagePath);
    this.af.upload(this.imagePath,this.path).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.pathImage = url.toString();
          console.log(this.pathImage);

          this.accountUpdateAvatar = {
            avatarPath: this.pathImage,
          }

          this.accountService.update(this.maccount.id, this.accountUpdateAvatar)
          .subscribe(res => {
            this.dialogRef.close();
          }, error => {
            this.dialogRef.close();
          })
        })
      })
    ).subscribe();
  }

  updateAvatarChoose(){
    this.accountUpdateAvatar = {
      avatarPath: this.pathImage.toString(),
    }

    this.accountService.update(this.maccount.id, this.accountUpdateAvatar)
    .subscribe(res => {
      this.dialogRef.close();
    }, error => {
      this.dialogRef.close();
    })
  }

}
