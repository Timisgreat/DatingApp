import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  login (){
    console.log(this.model);
  }

}
