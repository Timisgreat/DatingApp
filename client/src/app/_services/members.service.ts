import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, SystemJsNgModuleLoaderConfig } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

const httpOptions = {
  headers: new HttpHeaders({
    //Authorization: 'Bearer' + JSON.parse(localStorage.getItem('users')).token
    Authorization: 'Bearer' + JSON.parse(localStorage.getItem('users'))?.token
  })
    
}

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers(){
    if(this.members.length >0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl+'users').pipe(  //20220516 change to this
      map(members =>{
        this.members = members;
        return members;
      })
    )
    //return this.http.get<Member[]>(this.baseUrl+'users', httpOptions); //20220516 comment
    //return this.http.get<Member[]>(this.baseUrl+'users');
  }

  getMember(username:string){
    const member = this.members.find(x =>x.username === username);
    if (member !== undefined) return of(member);

    //return this.http.get<Member>(this.baseUrl+'users/' + username, httpOptions); //20220516 comment
    return this.http.get<Member>(this.baseUrl+'users/' + username);  //20220516 change to this
  }

  updateMember(member: Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(()=>{
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
    //return this.http.put(this.baseUrl + 'users', member);
  }

  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl+'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl+'users/delete-photo/' + photoId);     
  }
}
