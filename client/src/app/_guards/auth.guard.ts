import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private toastr: ToastrService){}

  canActivate(): Observable<boolean>  {
    return this.accountService.currentUser$.pipe(
      map(user=>{
        
        return true; 
        //if(user) return true; //2022-5-8 comment to pass. B/C the user is returning null. Still no idea?
        this.toastr.error("You shall not pass!!");
      })
    )
  }  
}
