import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-add-report-custom-validator',
  templateUrl: './add-report-custom-validator.component.html',
  styleUrls: ['./add-report-custom-validator.component.css']
})
export class AddReportCustomValidatorComponent implements OnInit {

  public myForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    // Initialize the form
    this.myForm = this.formBuilder.group({
      report_name: [null, null],
      chk1: [null, null],
      chk2: [null, null],
      chk3: [null, null],
      chk4: [null, null],
      chk5: [null, null],
    });

  }  // end of ngOnInit()

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

  public resetPressed(): void {
    this.myForm.reset();
  }
}
