import { HttpClient } from '@angular/common/http';
import { Message } from '../_models/message';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, getPaginationHeader as getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }

  getMessages(pageNumber, pageSize, container){
    let params = getPaginationHeaders(pageNumber,pageSize);
    params = params.append('Container', container);
    console.log(params);
    return getPaginatedResult<Message[]>(this.baseUrl + 'Messages', params, this.http)
  }

  
}
