import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Notification } from '@app/_models';

const baseUrl = `${environment.apiUrl}/notification`;

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private postSubject: BehaviorSubject<Notification>;
    public post: Observable<Notification>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.postSubject = new BehaviorSubject<Notification>(null);
        this.post = this.postSubject.asObservable();
    }

    public get postValue(): Notification {
        return this.postSubject.value;
    }

    getAll():Observable<Notification[]> {
        return this.http.get<Notification[]>(baseUrl);
    }

    getPostById(id):Observable<Notification[]> {
        return this.http.get<Notification[]>(`${baseUrl}/GetPostById/${id}`);
    }

    getAllByUserId(id:number):Observable<Notification[]> {
        return this.http.get<Notification[]>(`${baseUrl}/GetAllByUserId/${id}`);
    }


    delete(id: number) {
        return this.http.delete(`${baseUrl}/${id}`)
    }

    // update(id, params) {
    //     return this.http.put(`${baseUrl}/${id}`, params)
    //         .pipe(map((post: any) => {
    //             // update the current account if it was updated
    //             if (post.id === this.postValue.id) {
    //                 // publish updated account to subscribers
    //                 post = { ...this.postValue, ...post };
    //                 this.postSubject.next(post);
    //             }
    //             return post;
    //         }));
    // }

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