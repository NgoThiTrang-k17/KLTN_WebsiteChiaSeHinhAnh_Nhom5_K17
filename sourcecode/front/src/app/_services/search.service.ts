import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Post, Account } from '@app/_models';

const baseUrl = `${environment.apiUrl}/search`;

@Injectable({ providedIn: 'root' })
export class SearchService {
  private postSubject: BehaviorSubject<Post>;
  public post: Observable<Post>;
  private accountSubject: BehaviorSubject<Account>;
  public account: Observable<Account>;

  constructor(
      private router: Router,
      private http: HttpClient,
  ) {
      this.postSubject = new BehaviorSubject<Post>(null);
      this.post = this.postSubject.asObservable();
      this.accountSubject = new BehaviorSubject<Account>(null);
      this.account = this.accountSubject.asObservable();
  }

  public get postValue(): Post {
    return this.postSubject.value;
  }

  public get accoutValue(): Account {
    return this.accountSubject.value;
  }

  getHistorySearch(id) {
    return this.http.get<string[]>(`${baseUrl}/SearchHistory/${id}`);
  }

  getAllAccount(query):Observable<Account[]> {
    return this.http.get<Account[]>(`${baseUrl}`, {params: new HttpParams().set('query', query)});
  }

  getAllPost(query):Observable<Post[]> {
    return this.http.get<Post[]>(`${baseUrl}`, {params: new HttpParams().set('query', query)});
  }

  getAccountForMessage(query):Observable<Account[]> {
    return this.http.get<Account[]>(`${baseUrl}/SearchForMessage`, {params: new HttpParams().set('query', query)});
  }

}
