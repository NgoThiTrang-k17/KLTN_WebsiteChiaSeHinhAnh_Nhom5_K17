import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, PostService, AlertService } from '@app/_services';
import { Post } from '../_models/post';
import { PostToCreate } from '../_models/postToCreate';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    public isCreate: boolean;
    public postTitle: string;
    // public created: string;
    // public ownerId: number;
    public post: PostToCreate;
    public posts: Post[] = [];
    public response: { dbPath: '' };
    imageSrc: string;
    loading = false;
    submitted = false;
    myForm: FormGroup;
    testForm: any;

    account = this.accountService.accountValue;
    postS = this.postService.postValue;

    // myForm = new FormGroup({
    //     postTitle: new FormControl('', [Validators.required]),
    //     file: new FormControl('', [Validators.required]),
    //     fileSource: new FormControl('', [Validators.required])
    // });

    constructor(
        private http: HttpClient,
        private accountService: AccountService,
        private postService: PostService,
        private formBuilder: FormBuilder,
        private alertService: AlertService) { }

    ngOnInit() {
        // this.isCreate = true;
        this.myForm = this.formBuilder.group({
            postTitle: ['', Validators.required],
            file: ['', Validators.required],
            fileSource: ['', Validators.required]
        });
        this.testForm = new FormData();
        this.postService.getAll()
            .subscribe(res => {
                this.posts = res as Post[];
            });
    }

    get f() { return this.myForm.controls; }

    public onUploadFinished = new EventEmitter();
    
    onFileChange(event) {
        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            console.log('1');
            
            console.log(this.myForm.get('postTitle').value);
            this.testForm.append("file",file);
            this.testForm.append("postTitle", this.myForm.get("postTitle").value);
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.imageSrc = reader.result as string;
                console.log(this.myForm.value); 
            };
            
        }
    }

    submit() {
        console.log(this.testForm);
        this.postService.createPost(this.testForm)
            .subscribe(res => {
                console.log(res);
                this.alertService.success('Đăng hình thành công!', { keepAfterRouteChange: true });
            }, error => {
                console.log(error);               
            })
    }

    // onCreate() {
    //     this.post = {
    //       postTitle: this.postTitle,
    //       created: this.created,
    //       ownerId: this.ownerId,
    //       imagePath: this.response.dbPath
    //     }

    //     this.http.post('https://localhost:5000/posts', this.post)
    //     .subscribe(res => {
    //       this.getPosts();
    //       this.isCreate = false;
    //     });
    // }

    private getPosts = () => {
        this.postService.getAll()
            .subscribe(res => {
                this.posts = res as Post[];
            });
    }

    // public returnToCreate = () => {
    //     this.isCreate = true;
    //     this.postTitle = ''
    // }

    public uploadFinished = (event) => {
        this.response = event;
    }

    public createImgPath = (serverPath: string) => {
        return `http://localhost:5000/${serverPath}`;
    }
}