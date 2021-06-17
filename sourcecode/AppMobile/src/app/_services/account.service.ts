import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Account } from '../_models';
import { PresenceService } from '../_services';

const baseUrl = `${environment.apiUrl}/Accounts`;

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account>;
    public account: Observable<Account>;

    // private currentUserSource = new ReplaySubject<Account>(1);
    // currentUser$ = this.currentUserSource.asObservable();

    constructor(
        private router: Router,
        private http: HttpClient,
        private presenceService: PresenceService
    ) {
        this.accountSubject = new BehaviorSubject<Account>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): Account {
        return this.accountSubject.value;
    }

    login(model) {
        return this.http.post<any>(`${baseUrl}/authenticate`, model, { withCredentials: true })
            .pipe(map(account => {
                this.presenceService.createHubConnection(account);
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    loginGoogle(params) {
      // const user = params;
      // if(user){
      //   localStorage.setItem('user',JSON.stringify(user));
      //   this.setCurrentUser(user);
      //   this.presenceService.createHubConnection(user);
      // }

      return this.http.post<any>(`${baseUrl}/google-login`, params, { withCredentials: true })
        .pipe(map(account => {
            this.accountSubject.next(account);
            this.startRefreshTokenTimer();
            return account;
        }));
    }

    // setCurrentUser(user: Account){
    //   this.currentUserSource.next(user);
    // }

    logout() {
        this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.accountSubject.next(null);

        // localStorage.removeItem('socialUser')
        // localStorage.removeItem('user');
        // this.currentUserSource.next(null);
        // this.presenceService.stopHubConnection();

        this.router.navigate(['/account/login']);
    }

    refreshToken() {
        return this.http.post<any>(`${baseUrl}/refresh-token`, { withCredentials: true })
            .pipe(map((account) => {
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    register(account: Account) {
      return this.http.post(`${baseUrl}/register`, account)
      // .pipe(map((user: Account) => {
      //   if(user){
      //     localStorage.setItem('user',JSON.stringify(user));
      //     this.setCurrentUser(user);
      //     this.presenceService.createHubConnection(user);
      //   }
      //   return user;
      // }))
    }

    verifyEmail(token: string) {
        return this.http.post(`${baseUrl}/verify-email`, { token });
    }

    forgotPassword(email: string) {
        return this.http.post(`${baseUrl}/forgot-password`, { email });
    }

    validateResetToken(token: string) {
        return this.http.post(`${baseUrl}/validate-reset-token`, { token });
    }

    resetPassword(token: string, password: string, confirmPassword: string) {
        return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
    }

    getAll() {
        return this.http.get<Account[]>(baseUrl);
    }

    getById(id) {
        return this.http.get<Account>(`${baseUrl}/${id}`);
    }


    create(params) {
        return this.http.post(baseUrl, params);
    }

    update(id, params) {
        return this.http.put(`${baseUrl}/${id}`, params)
            .pipe(map((account: any) => {
                // update the current account if it was updated
                if (account.id === this.accountValue.id) {
                    // publish updated account to subscribers
                    account = { ...this.accountValue, ...account };
                    this.accountSubject.next(account);
                }
                return account;
            }));
    }

    delete(id: number) {
        return this.http.delete(`${baseUrl}/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                if (id === this.accountValue.id)
                    this.logout();
            }));
    }

    // helper methods

    private refreshTokenTimeout;

    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}
