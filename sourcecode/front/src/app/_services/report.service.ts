import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Report } from '@app/_models';

const baseUrl = `${environment.apiUrl}/reports`;

@Injectable({ providedIn: 'root' })
export class ReportService {
  private postSubject: BehaviorSubject<Report>;
  public post: Observable<Report>;

  constructor(
      private router: Router,
      private http: HttpClient
  ) {
      this.postSubject = new BehaviorSubject<Report>(null);
      this.post = this.postSubject.asObservable();
  }

  public get reactionValue(): Report {
      return this.postSubject.value;
  }

  getAll():Observable<Report[]> {
    return this.http.get<Report[]>(baseUrl);
  }

  createReport(model) {
    return this.http.post(baseUrl, model);
  }

  update(id, params) {
    return this.http.put(`${baseUrl}/${id}`, params);
  }
}
