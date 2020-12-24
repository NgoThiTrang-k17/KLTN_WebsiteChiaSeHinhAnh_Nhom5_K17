import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  temp: any;
  constructor(private activatedRoute: ActivatedRoute) {
  }
  loggedin = () => {
    this.activatedRoute.url.subscribe(url => {
      this.temp = url;
    });
    console.log(this.temp);
    if (this.temp.path === ''){
      return false;
    }
    else{
      return true;
    }
  }
}
