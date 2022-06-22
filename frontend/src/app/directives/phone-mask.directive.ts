import {Directive, HostListener} from '@angular/core';
import {NgControl} from "@angular/forms";

@Directive({
  selector: '[appPhoneMask]'
})
export class PhoneMaskDirective {

  constructor(public ngControl: NgControl) { }

  /*
   * Angular has detected the model has changed
   */
  @HostListener('ngModelChange', ['$event'])
  onModelChange(event: any) {
    this.onInputChange(event, false);
  }

  /*
   * The user pressed the backspace key
   */
  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event: { target: { value: any; }; }) {
    this.onInputChange(event.target.value, true);
  }

  /*
   * Examine the text and update it
   */
  onInputChange(event: string, backspace: boolean) {
    if (! event) {
      return;
    }
    else if (! this.ngControl.valueAccessor) {
      return;
    }

    // Remove any non-digits from the entered value
    let newVal = event.replace(/\D/g, '');

    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    }
    else if (newVal.length <= 3) {
      newVal = newVal.replace(/^(\d{0,3})/, '($1)');
    }
    else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
    }
    else if (newVal.length <= 10) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    }
    else {
      newVal = newVal.substring(0, 10);
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    }

    this.ngControl.valueAccessor.writeValue(newVal);
  }  // end of onInputChange()

}
