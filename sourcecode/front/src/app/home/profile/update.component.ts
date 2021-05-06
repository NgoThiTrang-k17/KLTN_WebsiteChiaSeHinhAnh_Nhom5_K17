import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

@Component({ templateUrl: 'update.component.html' })
export class UpdateComponent implements OnInit {
    account = this.accountService.accountValue;
    form: FormGroup;
    updateData: any;
    loading = false;
    submitted = false;
    deleting = false;
    imageSrc: string;
    path: string;
    pathImg: string;
    public imagePath: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private af: AngularFireStorage,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            file: [this.account.avatarPath, Validators.required],
            title: [this.account.title, Validators.required],
            name: [this.account.name, Validators.required],
            email: [this.account.email, [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6)]],
            confirmPassword: ['']
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
        this.accountService.getById(this.account.id)
        .subscribe((res:any)=>{
            this.account = res;
        })
        this.updateData = new FormData();
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onFileChange($event) {
        this.path = $event.target.files[0]

        const reader = new FileReader();
        if ($event.target.files && $event.target.files.length) {
            const [file] = $event.target.files;
            console.log('1');               
            // this.updateData.append("file",file);
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.imageSrc = reader.result as string;
                console.log(this.form.value);
            };
        }
    }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.imagePath = "/files"+Math.random()+this.path;
        const fileRef = this.af.ref(this.imagePath);
        this.af.upload(this.imagePath,this.path).snapshotChanges().pipe(
            finalize(() => {
                fileRef.getDownloadURL().subscribe((url) => {
                    this.pathImg = url.toString();
                    console.log(this.pathImg);
                    this.updateData.append('avatarPath', this.imagePath);
                    this.updateData.append('title', this.form.get('title').value);
                    this.updateData.append('name', this.form.get('name').value);
                    this.updateData.append('email', this.form.get('email').value);
                    this.updateData.append('password', this.form.get('password').value);
                    console.log(this.updateData);

                    this.loading = true;
                    this.accountService.update(this.account.id, this.updateData)
                        .pipe(first())
                        .subscribe({
                            next: () => {
                                console.log(this.updateData.value);
                                this.alertService.success('Update successful', { keepAfterRouteChange: true });
                                this.router.navigate(['../'], { relativeTo: this.route });
                            },
                            error: error => {
                                this.alertService.error(error);
                                this.loading = false;
                            }
                        });
                })
            })
        ).subscribe();

        
    }

    onDelete() {
        if (confirm('Are you sure you want to delete this account?')) {
            this.deleting = true;
            this.accountService.delete(this.account.id)
                .pipe(first())
                .subscribe(() => {
                    this.alertService.success('Account deleted successfully', { keepAfterRouteChange: true });
                });
        }
    }

    public createImgPath = (serverPath: string) => {
        return `http://localhost:5000/${serverPath}`;
    }
}