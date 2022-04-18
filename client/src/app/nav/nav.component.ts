import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  /* template: `
    <p>
      nav works!
    </p>
  `, */
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  //Create properties to store data from form
  model: any={}
  //currentUser$: Observable<User>;  //loggedIn : boolean;

  //constructor(private accountService: AccountService) { }
  //constructor(public accountService: AccountService) { }  
  //constructor(public accountService: AccountService, private router: Router) { }  
  constructor(public accountService: AccountService, private router: Router, private toastr: ToastrService) { }  

  ngOnInit(): void {    
    //this.currentUser$ = this.accountService.currentUser$; //this.getCurrentUser();
  }

  login() { 
    
    this.accountService.login(this.model).subscribe(response=>{
      this.router.navigateByUrl('/members');
      //console.log(response);
      //this.loggedIn = true;
    }, error =>{
      console.log(error);
      this.toastr.error(error.error);
    })        
    //console.log(this.model);
  }

  logout()
  {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    //this.loggedIn = false;
  }

  /*
  getCurrentUser(){
    this.accountService.currentUser$.subscribe(user=>{
      this.loggedIn = !!user;
    }, error=>{
      console.log(error);
    })
  }*/

}
