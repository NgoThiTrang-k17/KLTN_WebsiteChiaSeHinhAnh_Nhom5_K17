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
                // this.testForm.patchValue({
                //     fileSource: reader.result
                // });
                console.log(this.myForm.value); 
            };
            
        }
    }

    submit() {
        // this.submitted = true;

        // // reset alerts on submit
        // this.alertService.clear();

        // this.loading = true;

        // this.post = {
        //     postTitle: this.postTitle,
        //     imagePath: this.response.dbPath
        // }

        console.log(this.testForm);
        this.postService.createPost(this.testForm)
            .subscribe(res => {
                console.log(res);
                this.alertService.success('Image created successfully', { keepAfterRouteChange: true });
                // this.getPosts();
                // alert('Uploaded Successfully.');
            }, error => {
                console.log(error);               
            })
        // this.postService.createPost(this.testForm)
        //     .pipe(first())
        //     .subscribe({
        //         next: () => {                    
        //             this.alertService.success('Image created successfully', { keepAfterRouteChange: true });
        //             // this.getPosts();
        //             // this.router.navigate(['../'], { relativeTo: this.route });
        //         },
        //         error: error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         }
        // });
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