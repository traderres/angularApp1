import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidatorFn} from "@angular/forms";

@Component({
  selector: 'app-add-report-custom-validator',
  templateUrl: './add-report-custom-validator.component.html',
  styleUrls: ['./add-report-custom-validator.component.css']
})
export class AddReportCustomValidatorComponent implements OnInit {

  public myForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }


  public ngOnInit(): void {

    // Initialize the form and set a form validator
    this.myForm = this.formBuilder.group({
        report_name: [null, null],
        chk1: [false, null],
        chk2: [false, null],
        chk3: [false, null],
        chk4: [false, null],
        chk5: [false, null],
      },
      {
        validators: this.validateMaxCheckboxes(3)
      });

  }  // end of ngOnInit()


  /*
   * User pressed the Submit button
   */
  public submitPressed(): void {
    // Touch all forms (so validation messages appear)
    this.myForm.markAllAsTouched();

    if (this.myForm.invalid) {
      // The form is invalid -- so stop here
      return;
    }

    console.log('Form is valid.');
    this.myForm.reset();
  }

  /*
   * User pressed the Reset button
   */
  public resetPressed(): void {
    this.myForm.reset();
  }


  /*
   * This is the custom validator
   *
   * It returns null if there are no errors
   * It returns a map that holds a key and value=error message displayed on the page
   */
  private validateMaxCheckboxes(aMaxCheckboxesChecked: number): ValidatorFn {
    return () => {

      const totalChecked = this.getTotalCheckboxesChecked();
      if (totalChecked < aMaxCheckboxesChecked) {
        // The user has not selected any values -- so assume everything is valid
        return null;
      }
      else {
        // The user has checked too many checkboxes.  So return a validation error
        return {'validateMaxCheckboxes': `You must select at most ${aMaxCheckboxesChecked} checkboxes.`};
      }

    }
  }  // end of validateMaxCheckboxes()


  /*
   * This method returns the total number of checkboxes that are checked
   */
  private getTotalCheckboxesChecked(): number {
    if (! this.myForm) {
      // Ths form is not fully initialized.  So, return zero.
      return 0;
    }

    let totalChecked: number = 0;

    if (this.myForm.controls.chk1.value) {
      totalChecked++;
    }
    if (this.myForm.controls.chk2.value) {
      totalChecked++;
    }
    if (this.myForm.controls.chk3.value) {
      totalChecked++;
    }
    if (this.myForm.controls.chk4.value) {
      totalChecked++;
    }
    if (this.myForm.controls.chk5.value) {
      totalChecked++;
    }

    return totalChecked;
  }

}
