import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements ControlValueAccessor {   //export class TextInputComponent implements OnInit {
  @Input() label: string;
  @Input() type= 'text';

  constructor(@Self() public ngControl:NgControl) { 
    this.ngControl.valueAccessor= this;
  }
  
  writeValue(obj: any): void {
    //throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    //throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    //throw new Error('Method not implemented.');
  }

  /* setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  } */

  

}
