/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-trailing-spaces */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, LoadingController  } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';

import { Post, PostToUpdate} from '../../_models';
import { PostService } from '../../_services';

@Component({
  selector: 'app-add-edit-post',
  templateUrl: './add-edit-post.component.html',
  styleUrls: ['./add-edit-post.component.scss'],
})
export class AddEditPostComponent implements OnInit {

  @ViewChild('createForm') createForm: NgForm;
  @Input() postId: number;

  testForm: any;
  public title: string;
  public desctription: string;
  public file: any;
  public imagePath: string;
  public isPrivate: boolean;

  statusPost: number;
  imageSrc: string;
  pathImg: string;
  path: any;
  onEdit: boolean;
  loading = false;

  postToUpdate: PostToUpdate;
  public post = new Post();

  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    private af: AngularFireStorage,
    private postService: PostService,
  ) { }

  ngOnInit() {
    this.imageSrc = null;

    if(this.postId==null){
      this.onEdit = false;
      this.isPrivate = false;
    } else if(this.postId!=null){
      this.onEdit = true;
      this.postService.getPostById(this.postId)
      .subscribe(res => {
        this.post = res;
        this.title = res.title;
        this.desctription = res.description;
        if(res.status===6){
          this.isPrivate = false;
        } else if(res.status===7){
          this.isPrivate = true;
        }
      });
    }

    this.testForm = new FormData();
  }

  closeModalCmt() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  onFileChange($event) {

    this.path = $event.target.files[0];

    const reader = new FileReader();
    if ($event.target.files && $event.target.files.length) {
      const [file] = $event.target.files;

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }
  }

  submit() {
    this.loading = true;
    this.presentLoading();

    this.imagePath = "/files"+Math.random()+this.path;
    const fileRef = this.af.ref(this.imagePath);
    this.af.upload(this.imagePath,this.path).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.pathImg = url.toString();
          console.log(this.pathImg);
          if(this.title !== undefined){
            this.testForm.set("title", this.title);
          };
          if(this.desctription !== undefined){
            this.testForm.set("description", this.desctription);
          }
          if(this.isPrivate === true){
            this.testForm.set("status", 7);
          }
          this.testForm.set("path",this.pathImg);
          console.log(this.testForm);

          this.postService.createPost(this.testForm)
          .subscribe(res => {
            this.loading = false;
            this.loadingController.dismiss({
              dismissed: true
            });
            this.closeModalCmt();
          }, error => {
            this.loading = false;
            console.log(error);
          });
        });
      })
    ).subscribe();
  }

  updatePost() {

    if(this.title === undefined){
      this.title = '';
    };
    if(this.desctription === undefined){
      this.desctription = '';
    }
    if(this.isPrivate===true){
      this.statusPost = 7;
    } else if(this.isPrivate===false){
      this.statusPost = 6;
    }

    this.postToUpdate = {
      title: this.title,
      description: this.desctription,
      status: this.statusPost,
    };

    this.postService.update(this.postId, this.postToUpdate)
    .subscribe(res => {
      this.closeModalCmt();
    }, error => {
      console.log(error);
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
