import {Component, Inject, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SearchResultsComponent} from "../../search/search-results/search-results.component";


// This class holds the form data (that will be returned
export class SaveSearchDialogFormData {
  name: string;
  is_default: boolean;
}



@Component({
  selector: 'app-save-search-dialog',
  templateUrl: './save-search-dialog.component.html',
  styleUrls: ['./save-search-dialog.component.css']
})
export class SaveSearchDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SearchResultsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: SaveSearchDialogFormData) {}

  ngOnInit(): void {
  }


  public onCancelClick(): void {
    // Close the dialog box and return nothing
    this.dialogRef.close();
  }


  public onSubmitClick(aForm: NgForm): void {
    // Make all form fields as touched -- so that error validation displays
    aForm.form.markAllAsTouched();

    if (! aForm.form.valid) {
      // The form is not valid -- so stop here
      return;
    }

    // Validation psased.  Close the form and return the data
    this.dialogRef.close(this.data);
  }
}
