import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

import { AccountService, PostService } from '@app/_services';
import { Post, PostToCreate } from '@app/_models';

@Component({
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less'],
})
export class AddComponent implements OnInit {

  public postTitle: string;
  public imagePath: string;
  myForm: FormGroup;
  testForm: any;
  imageSrc: string;
  loading = false;
  pathImg: string;
  path: any;

  constructor(
    private postService: PostService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private af: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      title: [''],
      desctription: [''],
      file: ['', Validators.required]
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

  submit() {

    this.loading = true;

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
            this.loading = false;
            this.imageSrc = null;
            this.myForm.reset();
            alert('Create post successful');
          }, error => {
            this.loading = false;
            console.log(error);
          })
        })
      })
    ).subscribe();
  }

}
