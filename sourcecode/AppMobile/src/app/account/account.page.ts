import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountLogin } from '../_models';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  error = false;

  public accountLogin: AccountLogin;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    // console.log(this.f.email.value);


    this.accountLogin = {
      email: this.f.email.value,
      password: this.f.password.value
    };

    this.loading = true;
    this.accountService.login(this.accountLogin)
    .pipe(first())
    .subscribe({
        next: () => {
            // get return url from query parameters or default to home page
            // eslint-disable-next-line @typescript-eslint/dot-notation
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigateByUrl(returnUrl);
        },
        error: error => {
          // this.error = true;
          alert(error);
          this.loading = false;
        }
    });
  }


}
