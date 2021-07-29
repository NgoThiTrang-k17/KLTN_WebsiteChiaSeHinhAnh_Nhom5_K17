import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
// import { SocialAuthService, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';

import { AccountService, AlertService } from '@app/_services';
import { SocialUsers,  AccountLoginGoogle, AccountLogin} from '@app/_models';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  response;
  public accountLoginGoogle: AccountLoginGoogle;
  public model: AccountLogin;
  socialusers=new SocialUsers();
  user: SocialUser | null;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private authService: SocialAuthService,
    public OAuth: SocialAuthService,
  ) {
    this.user = null;
    this.authService.authState.subscribe((user: SocialUser) => {
      console.log(user);
      if (user) {
        this.http.post<any>('https://localhost:5001/Accounts/google-login', { idToken: user.idToken }).subscribe(response => {
          console.log(response);

          this.accountService.googleLogin(response);
          },error =>{
          console.log(error);
        })
      }
      this.user = user;
    });
  }

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

      console.log(this.f.email.value);


      this.model = {
        email: this.f.email.value,
        password: this.f.password.value
      }

      console.log(this.model);


      this.loading = true;
      this.accountService.login(this.model)
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

  signInWithGoogle(){
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((x: any) => console.log(x));
  }

  // signInWithGoogle(): void {
  //     this.loading = true;
  //     this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  //     this.OAuth.signIn(GoogleLoginProvider.PROVIDER_ID).then(socialusers => {
  //         console.log(socialusers.idToken);
  //         this.accountLoginGoogle = {
  //             idToken: socialusers.idToken,
  //         }
  //         this.accountService.loginGoogle(this.accountLoginGoogle)
  //         .pipe(first())
  //         .subscribe({
  //             next: () => {
  //                 // get return url from query parameters or default to home page
  //                 const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/user';
  //                 this.router.navigateByUrl(returnUrl);
  //             },
  //             error: error => {
  //                 this.alertService.error(error);
  //                 this.loading = false;
  //             }
  //         });
  //     });

  // }

  // signInWithFB(): void {
  //     this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  //     this.OAuth.signIn(FacebookLoginProvider.PROVIDER_ID).then(socialusers => {
  //         console.log(socialusers);

  //     });
  // }

  signOut(): void {
      this.authService.signOut();
  }
}
