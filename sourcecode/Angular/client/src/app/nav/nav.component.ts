import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any= {};
  user: SocialUser | null; 
  
  constructor(private authService: SocialAuthService,
    private http: HttpClient,
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService) { 
      this.user = null;
      this.authService.authState.subscribe((user: SocialUser) => {
        console.log(user);
        if (user) {
          this.http.post<any>('https://localhost:5001/Accounts/google-login', { idToken: user.idToken }).subscribe(response => {
            console.log(response);
             
            this.accountService.googleLogin(response);
            },error =>{
            console.log(error);
            this.toastr.error(error.error);
          }) 
        }
        this.user = user;
      });
    }

  ngOnInit(): void {
    
  }

  login(){
    this.accountService.login(this.model).subscribe(response => {
      console.log(response);
      this.router.navigateByUrl('/members');
      },error =>{
      console.log(error);
      this.toastr.error(error.error);
    })
  }

  signInWithGoogle(){
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((x: any) => console.log(x));
  }
  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

}
