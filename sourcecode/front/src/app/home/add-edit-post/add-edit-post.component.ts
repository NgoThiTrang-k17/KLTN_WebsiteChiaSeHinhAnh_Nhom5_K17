import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage'

import { AccountService, PostService, AlertService } from '@app/_services';
import { Post, PostToCreate } from '@app/_models';

@Component({
  selector: 'app-add-edit-post',
  templateUrl: './add-edit-post.component.html'
})
export class AddEditPostComponent implements OnInit {

  public postTitle: string;
  public imagePath: string;
  myForm: FormGroup;
  testForm: any;
  imageSrc: string;
  id: number;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  path: string;
  downloadURL: any;

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
    this.downloadURL = this.af.ref('/files0.7934253494382291[object File]').getDownloadURL();

    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.myForm = this.formBuilder.group({
      postTitle: ['', Validators.required],
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
        this.testForm.append("file",file);
        //this.testForm.append("postTitle", this.myForm.get("postTitle").value);     
        
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.imageSrc = reader.result as string;
            console.log(this.myForm.value); 
        };
        console.log(this.myForm.get('postTitle').value);
    }
  }

  submit() {
    this.submitted = true;
    if (this.myForm.invalid) {
      return;
    }

    console.log(this.path);
    this.imagePath = "/files"+Math.random()+this.path;
    this.af.upload(this.imagePath,this.path);
    console.log(this.imagePath);

    console.log(this.testForm);
    console.log(this.myForm.get('postTitle').value);   
    if (this.isAddMode) { 
      this.testForm.set("postTitle", this.myForm.get("postTitle").value);
      this.testForm.append("imagePath",this.imagePath);
      this.postService.createPost(this.testForm)
      .subscribe(res => {
          console.log(res);
          // this.alertService.success('Image created successfully', { keepAfterRouteChange: true });
          // this.getPosts();
          alert('Tạo bài viết thành công!');
          this.router.navigate(['../'], { relativeTo: this.route });
      }, error => {
          console.log(error);               
      })
    } else if (!this.isAddMode) {
      this.testForm.set("title", this.myForm.get("postTitle").value); 
      this.postService.update(this.id, this.testForm)
        .subscribe(res => {
          console.log(res);
          // this.alertService.success('Image created successfully', { keepAfterRouteChange: true });
          // this.getPosts();
          alert('Chỉnh sửa thành công!');
          this.router.navigate(['../../'], { relativeTo: this.route });
      }, error => {
          console.log(error);               
      })
    }   
  }

  public createImgPath = (serverPath: string) => {
    return `storage.googleapis.com/storage/v1/b/kltn-websitechiasehinhanh.appspot.com/o/${serverPath}`;
    // return `http://localhost:5000/${serverPath}`;
  }
}
