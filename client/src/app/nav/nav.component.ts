import { Component, OnInit } from '@angular/core';
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

  constructor(public accountService: AccountService) { }  //constructor(private accountService: AccountService) { }

  ngOnInit(): void {    
    //this.currentUser$ = this.accountService.currentUser$; //this.getCurrentUser();
  }

  login() { 
    
    this.accountService.login(this.model).subscribe(response=>{
      console.log(response);
      //this.loggedIn = true;
    }, error =>{
      console.log(error);
    })        
    //console.log(this.model);
  }

  logout()
  {
    this.accountService.logout();
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
