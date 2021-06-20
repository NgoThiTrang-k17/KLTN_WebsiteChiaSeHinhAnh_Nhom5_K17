import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import  {map } from 'rxjs/operators';
import { environment } from "src/environments/environment";
import { User } from "../_models/user"; 
import { PresenceService } from "./presence.service";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  baseUrl = environment.apiUrl+'Accounts/';
   
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();



  constructor(  private http: HttpClient, private presenceService: PresenceService) {}

  login(model: any) {
    return this.http.post<any>(this.baseUrl+'authenticate',  model, { withCredentials: true }).pipe(
      map((response: User)=>{
        console.log(this.http.head);
      
        const user = response;
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.setCurrentUser(user);
          this.presenceService.createHubConnection(user);
        }
      })
    );
  }
  googleLogin(model: any) {
    console.log(model);
        const user = model;
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.setCurrentUser(user);
          this.presenceService.createHubConnection(user);
        }
  }

  register(model: any){
    return this.http.post(this.baseUrl+'register', model).pipe(
      map((user: User) => {
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.setCurrentUser(user);
          this.presenceService.createHubConnection(user);
        }
        return user;
      })
    )
  }
  
  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('socialUser')
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }
}
