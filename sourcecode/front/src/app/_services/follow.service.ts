import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Follow } from '@app/_models';

const baseUrl = `${environment.apiUrl}/follows`;

@Injectable({ providedIn: 'root' })
export class FollowService {
    private followSubject: BehaviorSubject<Follow>;
    public follow: Observable<Follow>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.followSubject = new BehaviorSubject<Follow>(null);
        this.follow = this.followSubject.asObservable();
    }

    public get followValue(): Follow {
        return this.followSubject.value;
    }

    getAll():Observable<Follow[]> {
        return this.http.get<Follow[]>(baseUrl);
    }

    createFollow(params) {
        return this.http.post(baseUrl, params);
    }

    getFollow(accountId){
        return this.http.get<Follow>(`${baseUrl}/GetAllByUserId/${accountId}`);
    }

    update(id, params) {
        return this.http.put(`${baseUrl}/${id}`, params);
    }

    delete(id){
        return this.http.delete(`${baseUrl}/DeleteByAccountId/${id}`);
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