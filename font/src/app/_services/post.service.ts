import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

    getPostById(id:number):Observable<Post[]> {
        return this.http.get<Post[]>(`${baseUrl}/GetPostById/${id}`);
    }

    getAllByUserId(id:number):Observable<Post[]> {
        return this.http.get<Post[]>(`${baseUrl}/GetAllByUserId/${id}`);
    }

    createPost(params) {
        return this.http.post(baseUrl, params);
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