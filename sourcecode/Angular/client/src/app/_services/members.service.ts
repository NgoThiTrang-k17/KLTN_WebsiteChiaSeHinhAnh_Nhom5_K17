import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { User } from '../_models/user';
import { UserParams} from '../_models/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeader } from './paginationHelper';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl+'Accounts/';
  members: Member[] =[];
  memberCache = new Map();
  userParams: UserParams;
  user:User;

  constructor(private http:HttpClient,private accountService:AccountService ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams =  new UserParams(user);
    })
   }
  getUserParams(){
    return this.userParams;
  }
  setUserParams(params: UserParams){
    this.userParams = params;
  }
  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    console.log(Object.values(userParams).join('-'));
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if(response){
      return of(response);
    }
    let params =  getPaginationHeader(userParams.pageNumber,userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.title);
    params = params.append('orderBy', userParams.orderBy);

    return  getPaginatedResult<Member[]>(this.baseUrl,params,this.http)
      .pipe(map(response1=>{
      this.memberCache.set(Object.values(userParams).join('-'), response1);
      
      return response1;
    }))
  }

  

  getMember (id:string) {
    const member = [...this.memberCache.values()]
      .reduce((array, element)=>array.concat(element.result), [])
      .find((member1:Member)=> member1.id.toString() === id);
    if(member){
      return of(member);
    }
    return this.http.get<Member>(this.baseUrl+id);
  }

  updateMember(id: number, member: Member){
    return this.http.put(this.baseUrl+id, member).pipe(
      map(()=>{
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  addLike(id:number){
    return this.http.post(environment.apiUrl+'Follows', {SubjectId: id})
  }

  getLikes(predicate:string){
    if(predicate === 'liked'){
      return this.http.get<Partial<Member[]>>(environment.apiUrl+'Follows/GetByFollowerId/'+this.user.id)
    }
    return this.http.get<Partial<Member[]>>(environment.apiUrl+'Follows/GetBySubjectId/'+this.user.id)
  }

}
