import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {ToastrModule} from 'ngx-toastr';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'md-toast-bottom-right'	 //chagne toast-bottom-right to md-toast-bottom-right still failed; try this later:https://plnkr.co/edit/6W9URNyyp2ItO4aUWzBB?preview
    })
  ],
  exports:[
    BsDropdownModule,
    ToastrModule
  ]
})
export class SharedModule { }
