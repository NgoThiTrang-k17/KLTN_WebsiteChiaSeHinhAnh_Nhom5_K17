import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'client';
  accounts: any;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts(){
    this.http.get('http://localhost:5001/Account').subscribe(response=>{
      this.accounts = response;
    }, error=>{
      console.log(error);
    })
  }
}
