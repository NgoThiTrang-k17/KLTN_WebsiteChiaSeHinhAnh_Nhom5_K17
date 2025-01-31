import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import {Observable} from 'rxjs/Rx';

import { AccountService, PostService, AlertService } from '@app/_services';
import { Post, PostToCreate } from '@app/_models';

@Component({
  selector: 'app-add-edit-post',
  templateUrl: './add-edit-post.component.html',
  styleUrls: ['./add-edit-post.component.less']
})
export class AddEditPostComponent implements OnInit {

  public title: string;
  public file: any;
  public imagePath: string;
  myForm: FormGroup;
  testForm: any;
  imageSrc: string;
  id: number;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  desctription: string;
  downloadURL: Observable<string>;
  pathImg: string;
  path: any;
  isPrivate: boolean;
  statusPost: number;

  post = new Post;

  maccount = this.accountService.accountValue;

  constructor(
    private accountService: AccountService,
    private postService: PostService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private af: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    this.isPrivate = false;

    this.myForm = this.formBuilder.group({
      title: [''],
      desctription: [''],
      file: ['', this.isAddMode ? Validators.required : Validators.nullValidator]
    });

    this.testForm = new FormData();
  }

  get f() { return this.myForm.controls; }

  onFileChange($event) {

    this.path = $event.target.files[0]

    const reader = new FileReader();
    if ($event.target.files && $event.target.files.length) {
      const [file] = $event.target.files;

      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
      };
    }
  }

  private(){
    this.isPrivate = true;
  }

  submit() {
    this.submitted = true;
    this.loading = true;

    if (this.myForm.invalid) {
      return;
    }

    console.log(this.isPrivate);

    if(this.isPrivate == true){
      this.statusPost = 7;
      this.testForm.set("status",this.statusPost);
    }

    this.imagePath = "/files"+Math.random()+this.path;
    const fileRef = this.af.ref(this.imagePath);
    this.af.upload(this.imagePath,this.path).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.pathImg = url.toString();
          console.log(this.pathImg);
          this.testForm.set("title", this.myForm.get("title").value);
          this.testForm.set("description", this.myForm.get("desctription").value);
          this.testForm.set("path",this.pathImg);

          console.log(this.testForm.value);

          this.postService.createPost(this.testForm)
          .subscribe(res => {
            this.loading = false;
            this.back();
          }, error => {
            this.loading = false;
            console.log(error);
          })
        })
      })
    ).subscribe();
  }

  back() {
    this.path = localStorage.getItem('path');
    if(this.path == null){
      if(this.maccount.role == 'User'){
        this.router.navigate([''], { relativeTo: this.route });
      } else if(this.maccount.role == 'Admin'){
        this.router.navigate(['admin/user']);
      }
    } else {
      this.router.navigate([this.path]);
    }
  }
}
