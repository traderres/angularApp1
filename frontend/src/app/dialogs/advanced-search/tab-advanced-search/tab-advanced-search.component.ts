import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";

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
  private currentDefaultSearchOperator: string = "and";

  // Initialize a read-only map of key=checkboxName and value=ES_field_name
  private readonly mapCheckboxToElasticSearchFieldName: Map<string, string> = new Map([
    ['chk1', 'report_name'],
    ['chk2', 'description'],
    ['chk3', 'priority_label'],
    ['chk4', 'is_administrator'],
  ]);


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



  /*
   * 1. Remove any previous value from generatedQueriesAsArray
   * 2. Append the new value to the generatedQueriesAsArray
   * 3. Refresh the generatedQueryAsString
   */
  public updatedGeneratedQuery(aCheckboxName: string, aFieldValue: string): void {
    // Get the ES field value (that corresponds to this checkbox)
    let esFieldValue = this.mapCheckboxToElasticSearchFieldName.get(aCheckboxName);

    let checkbox: AbstractControl = this.myForm.controls[aCheckboxName];
    if (aFieldValue == '') {
      // User entered NOTHING or cleared the text box

      // Uncheck the checkbox
      checkbox.setValue(false);

      // Look for this in the array (and remove it is found)
      let oldNameAndValuePrefix: string = esFieldValue + ":";
      for (let i=0; i<this.generatedQueriesAsArray.length; i++) {
        let nameAndValue: string = this.generatedQueriesAsArray[i];

        if (nameAndValue.startsWith(oldNameAndValuePrefix)) {
          // I found this in the array.  So, remove it from the array
          this.generatedQueriesAsArray.splice(i, 1);
          break;
        }
      }
    }
    else {
      // User entered something in the text box

      // Check the checkbox
      checkbox.setValue(true);

      if (aFieldValue.indexOf(' ') >= 0) {
        // The field value has a space.  So, surround it with quotes
        aFieldValue = "\"" + aFieldValue + "\"";
      }

      let queryWasFoundInArray: boolean = false;
      let oldNameAndValuePrefix: string = esFieldValue + ":";
      let newNameAndValue: string       = esFieldValue + ":" + aFieldValue;

      for (let i=0; i<this.generatedQueriesAsArray.length; i++) {
        let nameAndValue: string = this.generatedQueriesAsArray[i];

        if (nameAndValue.startsWith(oldNameAndValuePrefix)) {
          // I found this in the array  (so replace it with the new one
          this.generatedQueriesAsArray[i] = newNameAndValue;
          queryWasFoundInArray = true;
          break;
        }
      }

      if (! queryWasFoundInArray) {
        // The query was not found in the array -- so append it
        this.generatedQueriesAsArray.push(newNameAndValue);
      }
    }

    this.refreshGeneratedQueryAsString();
  }


  private refreshGeneratedQueryAsString(): void {
    this.generatedQueriesAsString = this.generatedQueriesAsArray.join(" " + this.currentDefaultSearchOperator + " ");

    let totalFields = this.generatedQueriesAsArray.length;
    if (totalFields == 0) {
      this.searchingFieldLabel = "";
    }
    else if (totalFields == 1) {
      this.searchingFieldLabel = "Searching 1 field...";
    }
    else {
      this.searchingFieldLabel = "Searching " + totalFields + " fields...";
    }

  }


  public removeIfUnchecked(aCheckboxName: string, aNameOfValueField: string) {
    // Get the ES field value (that corresponds to this checkbox)
    let esFieldValue = this.mapCheckboxToElasticSearchFieldName.get(aCheckboxName);

    let checkbox: AbstractControl = this.myForm.controls[aCheckboxName];
    let formFieldWithValue: AbstractControl = this.myForm.controls[aNameOfValueField];

    if (! checkbox.value) {
      // User unchecked.  So, clear the value
      formFieldWithValue.setValue(null);

      // Look for this in the array (and remove it is found)
      let oldNameAndValuePrefix: string = esFieldValue + ":";
      for (let i=0; i<this.generatedQueriesAsArray.length; i++) {
        let nameAndValue: string = this.generatedQueriesAsArray[i];

        if (nameAndValue.startsWith(oldNameAndValuePrefix)) {
          // I found this in the array.  So, remove it from the array
          this.generatedQueriesAsArray.splice(i, 1);
          break;
        }
      }
    }

    this.refreshGeneratedQueryAsString();
  }


  public clearForm(): void {
    this.myForm.reset();
    this.generatedQueriesAsArray = [];
    this.refreshGeneratedQueryAsString();
  }

}
