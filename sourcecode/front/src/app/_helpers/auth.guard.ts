import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

import { AccountService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const account = this.accountService.accountValue;
        // console.log(this.accountService);

        // if(account!=null) {
        //   return true;
        // }

        // if (account.role==null) return true;
        if (account.role=='User') {
            // check if route is restricted by role
            // if (route.data.roles && !route.data.roles.includes(account.role)) {
            //     // role not authorized so redirect to home page
            //     //this.router.navigate(['/admin']);
            //     return false;
            // }

            // authorized so return true
            return true;
        }
        else if (account.role=='Admin') {
            this.router.navigate(['/admin']);
            return false;
        }
        else {
          this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
          return true;
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
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
