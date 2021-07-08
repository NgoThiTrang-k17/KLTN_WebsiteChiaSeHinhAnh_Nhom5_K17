import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Comment } from '@app/_models';

const baseUrl = `${environment.apiUrl}/comment`;

@Injectable({ providedIn: 'root' })
export class CommentService {
    private commentSubject: BehaviorSubject<Comment>;
    public comment: Observable<Comment>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.commentSubject = new BehaviorSubject<Comment>(null);
        this.comment = this.commentSubject.asObservable();
    }

    public get commentValue(): Comment {
      return this.commentSubject.value;
    }

    getAll():Observable<Comment[]> {
      return this.http.get<Comment[]>(baseUrl);
    }

    getAllByPostId(id:number):Observable<Comment[]> {
      return this.http.get<Comment[]>(`${baseUrl}/Post/${id}`);
    }

    getAllByCommentId(id:number):Observable<Comment[]> {
      return this.http.get<Comment[]>(`${baseUrl}/Post/Comment/${id}`);
    }

    getById(id:number):Observable<Comment[]> {
        return this.http.get<Comment[]>(`${baseUrl}/GetById/${id}`);
    }

    create(params) {
        return this.http.post(baseUrl, params);
    }

    update(id, params) {
        return this.http.put(`${baseUrl}/${id}`, params)
    }

    delete(id: number) {
        return this.http.delete(`${baseUrl}/${id}`);
    }
}
