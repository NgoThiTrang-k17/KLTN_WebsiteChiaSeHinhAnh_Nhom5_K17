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

  post = new Post;

  constructor(
    private postService: PostService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private af: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    //this.downloadURL = this.af.ref('/files0.7934253494382291[object File]').getDownloadURL();

    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.myForm = this.formBuilder.group({
      title: ['', Validators.required],
      desctription: [''],
      file: ['', this.isAddMode ? Validators.required : Validators.nullValidator]
    });

    if (!this.isAddMode) {
      this.postService.getPostById(this.id)
        .subscribe((res:any)=>{
          this.post = res;
        })
    }
    this.testForm = new FormData();
  }

  get f() { return this.myForm.controls; }

  onFileChange($event) {

    this.path = $event.target.files[0]

    const reader = new FileReader();
    if ($event.target.files && $event.target.files.length) {
        const [file] = $event.target.files;
        console.log('1');
        //this.testForm.append("file",file);
        //this.testForm.append("postTitle", this.myForm.get("postTitle").value);

        reader.readAsDataURL(file);
        reader.onload = () => {
            this.imageSrc = reader.result as string;
            //console.log(this.myForm.value);
        };
        //console.log(this.myForm.get('title').value);
    }
  }

  submit() {
    this.submitted = true;
    if (this.myForm.invalid) {
      return;
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

          this.postService.createPost(this.testForm)
          .subscribe(res => {
              this.router.navigate(['../'], { relativeTo: this.route });
          }, error => {
              console.log(error);
          })
        })
      })
    ).subscribe();
  }

  back() {
    this.path = localStorage.getItem('path');
    if(this.path == null){
      this.router.navigate([''], { relativeTo: this.route });
    } else {
      this.router.navigate([this.path]);
    }
  }
}
