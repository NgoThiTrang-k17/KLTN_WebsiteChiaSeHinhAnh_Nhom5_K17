import { User } from "./user";

export class UserParams{
    title: string;
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize=5;
    orderBy ='lastActive';
    constructor(user:User){
        this.title = user.title === 'mr' ? 'mrs' : 'mr';
    }
}