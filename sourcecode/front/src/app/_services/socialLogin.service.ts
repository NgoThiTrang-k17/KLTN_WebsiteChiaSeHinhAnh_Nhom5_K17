import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

const baseUrl = `${environment.apiUrl}/accounts`;
@Injectable({
  providedIn: 'root'
})

export class SocialloginService {
url;
  constructor(private http: HttpClient) { }

  Savesresponse(responce)
  {
    this.url =  `${baseUrl}/revoke-token`;
    return this.http.post(this.url,responce);
  }
}