import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  //@Input() usersFromHomeComponent: any;  //for test
  @Output() cancelRegister= new EventEmitter();

  model: any={};

  //constructor(private accountService: AccountService) { }
  constructor(private accountService: AccountService, private toastr: ToastrService) { }  

  ngOnInit(): void {
  }

  register(){
    this.accountService.register(this.model).subscribe(reponse=>{
      console.log(reponse);
      this.cancel();
    }, error=>{
      console.log(error);
      this.toastr.error(error.error);
    })
    //console.log(this.model);
  }

  cancel(){
    this.cancelRegister.emit(false);
    //console.log("cancelled");
  }

}
