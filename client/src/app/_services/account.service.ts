import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl= environment.apiUrl;  
  private currentUserSource = new ReplaySubject<User>(1);  
  currentUser$ = this.currentUserSource.asObservable();


  constructor(private http: HttpClient) { }

  login(model: any){
    //return this.http.post(this.baseUrl+'account/login',model);
    return this .http.post(this.baseUrl+'account/login',model).pipe(
      map((response: User)=>{    //map((response: any)=>{
        const user = response;
        if (user){
          /* 20220518 comment
          localStorage.setItem('user', JSON.stringify(user)); 
          this.currentUserSource.next(user);  
          */
          this.setCurrentUser(user);       
        }      
      })
    )
  }

  register(model: any){
    return this. http.post(this.baseUrl+'account/register',model).pipe(
      map((user:User)=>{
        if(user){
          //localStorage.setItem('user', JSON.stringify(user)); //20220518 move to setCurrentUser 
          //this.currentUserSource.next(user); //20220518 comments
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user: User){
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
