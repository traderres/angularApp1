import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-tab-advanced-search',
  templateUrl: './tab-advanced-search.component.html',
  styleUrls: ['./tab-advanced-search.component.css']
})
export class TabAdvancedSearchComponent implements OnInit {

  public  myForm: FormGroup;
  public  generatedQueriesAsArray: string[] = [ ];
  public  generatedQueriesAsString: string = "";
  public  searchingFieldLabel: string = "";

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit(): void {

    // Initialize the form
    this.myForm = this.formBuilder.group({
        chk1:           [false, null],
        textField1:     [null, null],
        chk2:           [false, null],
        textField2:     [null, null],
        chk3:           [false, null],
        dropdownField3: [null, null],
        chk4:           [false, null],
        dropdownField4: [null, null],
    });

  }

}
