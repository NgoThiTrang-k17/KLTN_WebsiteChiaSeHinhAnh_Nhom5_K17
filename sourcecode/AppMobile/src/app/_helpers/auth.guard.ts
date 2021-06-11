import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';

import { AccountService } from '../_services/account.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountService: AccountService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const account = this.accountService.accountValue;
    if (account) {
      return true;
    } else {
      this.router.navigate(['/account'], { queryParams: { returnUrl: state.url }});
      return false;
    }

    // if(account) {
    //     if (account.role == 1) {
    //         return true;
    //     }
    //     if (account.role == 0) {
    //         this.router.navigate(['/admin']);
    //         return false;
    //     }
    // }

    // not logged in so redirect to login page with the return url

  }
}
