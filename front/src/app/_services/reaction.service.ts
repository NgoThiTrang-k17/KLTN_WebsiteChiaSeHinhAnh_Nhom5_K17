import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Reaction } from '@app/_models';

const baseUrl = `${environment.apiUrl}/reactions`;

@Injectable({ providedIn: 'root' })
export class ReactionService {
    private postSubject: BehaviorSubject<Reaction>;
    public post: Observable<Reaction>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.postSubject = new BehaviorSubject<Reaction>(null);
        this.post = this.postSubject.asObservable();
    }

    public get reactionValue(): Reaction {
        return this.postSubject.value;
    }

    getAll():Observable<Reaction[]> {
        return this.http.get<Reaction[]>(baseUrl);
    }

    getPostById(id):Observable<Reaction[]> {
        return this.http.get<Reaction[]>(`${baseUrl}/GetPostById/${id}`);
    }

    getAllByUserId(id:number):Observable<Reaction[]> {
        return this.http.get<Reaction[]>(`${baseUrl}/GetAllByUserId/${id}`);
    }

    createReaction(params) {
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