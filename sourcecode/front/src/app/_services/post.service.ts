import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Post, PostToCreate } from '@app/_models';

const baseUrl = `${environment.apiUrl}/posts`;

@Injectable({ providedIn: 'root' })
export class PostService {
    private postSubject: BehaviorSubject<Post>;
    public post: Observable<Post>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.postSubject = new BehaviorSubject<Post>(null);
        this.post = this.postSubject.asObservable();
    }

    public get postValue(): Post {
        return this.postSubject.value;
    }

    getAll():Observable<Post[]> {
        return this.http.get<Post[]>(baseUrl);
    }

    getPostById(id):Observable<Post[]> {
        return this.http.get<Post[]>(`${baseUrl}/${id}`);
    }

    getAllByUserId(id:number):Observable<Post[]> {
        return this.http.get<Post[]>(`${baseUrl}/User/${id}`);
    }

    getDownloadImage(id:number): Observable<HttpEvent<Blob>> {
        return this.http.request(new HttpRequest(
            'GET',
            `${baseUrl}/DownloadImage/${id}`,
            null,
            {
              reportProgress: true,
              responseType: 'blob'
            }));
        // return this.http.get<Post>(`${baseUrl}/DownloadImage/${id}`);
    }

    createPost(params) {
        return this.http.post(baseUrl, params);
    }

    delete(id: number) {
        return this.http.delete(`${baseUrl}/${id}`)
    }

    update(id, params) {
        return this.http.put(`${baseUrl}/${id}`, params)
    }

    // createPost(posts) {
    //     const formData: FormData = new FormData();
    //     formData.append('postTitle', posts.postTitle)
    //     if (posts.imagePath)
    //     {
    //         formData.append('dbPath', posts.imagePath)
    //     }
    //     return this.http.post(baseUrl, formData);
    // }
}