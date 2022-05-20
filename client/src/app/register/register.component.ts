import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] =[];

  //constructor(private accountService: AccountService) { }
  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder, private router: Router) { }  

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }

  initializeForm(){
    this.registerForm = this.fb.group({ //this.registerForm = new FormGroup({
      username: ['',Validators.required],//username: new FormControl('', Validators.required),
      gender: ['male',],
      knownAs: ['',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      password: ['',[Validators.required,
        Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required, this.matchValue('password')]] 
    })
    this.registerForm.controls.password.valueChanges.subscribe(()=>{
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  matchValue(matchTo: string): ValidatorFn
  {
    return (control: AbstractControl)=>{
      return control?.value === control?.parent?.controls[matchTo].value?null: {isMatching: true}
    }

  }

  register(){
    
    this.accountService.register(this.registerForm.value).subscribe(reponse=>{ //this.accountService.register(this.model).subscribe(reponse=>{
      this.router.navigateByUrl('/members');
      //console.log(reponse);
      //this.cancel();
    }, error=>{
      this.validationErrors = error;
      //console.log(error);
      //this.toastr.error(error.error);
    }) 
    //console.log(this.model);
  }

  cancel(){
    this.cancelRegister.emit(false);
    //console.log("cancelled");
  }

}
