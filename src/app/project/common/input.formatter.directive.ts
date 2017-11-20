import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
@Directive({
  selector: '[ngModel][myInputFormatter]'
})
export class InputFormatterDirective {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  value: any;

  @HostListener('input', ['$event']) onInputChange($event) {
    // convert the input to lowercase and replace any ' '(space) with a '-'
    this.value = $event.target.value.toLowerCase().replace(/ /g, '-');
    this.ngModelChange.emit(this.value);
  }
}


