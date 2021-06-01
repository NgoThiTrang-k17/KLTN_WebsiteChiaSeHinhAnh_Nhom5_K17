import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { SocialAuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

import { AccountService, AlertService } from '@app/_services';
import { SocialUsers,  AccountLoginGoogle} from '@app/_models';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    response;  
    public accountLoginGoogle: AccountLoginGoogle;
    socialusers=new SocialUsers(); 

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService, 
        private authService: SocialAuthService,
        public OAuth: SocialAuthService,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    // get return url from query parameters or default to home page
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    this.router.navigateByUrl(returnUrl);
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    signInWithGoogle(): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
        this.OAuth.signIn(GoogleLoginProvider.PROVIDER_ID).then(socialusers => {   
            console.log(socialusers.idToken);
            this.accountLoginGoogle = {
                idToken: socialusers.idToken,
            }   
            this.accountService.loginGoogle(this.accountLoginGoogle)
            .pipe(first())
            .subscribe({
                next: () => {
                    // get return url from query parameters or default to home page
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    this.router.navigateByUrl(returnUrl);
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });   
        });
        
    }
    
    signInWithFB(): void {
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
        this.OAuth.signIn(FacebookLoginProvider.PROVIDER_ID).then(socialusers => {   
            console.log(socialusers);  
      
        });
    }
    
    signOut(): void {
        this.authService.signOut();
    }
}