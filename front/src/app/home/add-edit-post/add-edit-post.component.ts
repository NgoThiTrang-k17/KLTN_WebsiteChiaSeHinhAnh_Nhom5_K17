import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AccountService, PostService, AlertService } from '@app/_services';
import { Post, PostToCreate } from '@app/_models';

@Component({
  selector: 'app-add-edit-post',
  templateUrl: './add-edit-post.component.html'
})
export class AddEditPostComponent implements OnInit {

  public postTitle: string;
  myForm: FormGroup;
  testForm: any;
  imageSrc: string;

  constructor(
    private postService: PostService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      postTitle: ['', Validators.required],
      file: ['', Validators.required],
      fileSource: ['', Validators.required]
    });
    this.testForm = new FormData();
  }

  get f() { return this.myForm.controls; }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        console.log('1');
              
        this.testForm.append("file",file);
        this.testForm.append("postTitle", this.myForm.get("postTitle").value);
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.imageSrc = reader.result as string;
            console.log(this.myForm.value); 
        };
        console.log(this.myForm.get('postTitle').value);
    }
  }

  submit() {
    console.log(this.testForm);
    this.postService.createPost(this.testForm)
        .subscribe(res => {
            console.log(res);
            // this.alertService.success('Image created successfully', { keepAfterRouteChange: true });
            // this.getPosts();
            alert('Uploaded Successfully.');
            this.router.navigate(['../'], { relativeTo: this.route });
        }, error => {
            console.log(error);               
        })
    
  }

}
