import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AddBannerDTO} from "../../../models/add-banner-dto";
import {BannerService} from "../../../services/banner.service";
import {MessageService} from "../../../services/message.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-banner-dialog',
  templateUrl: './add-banner-dialog.component.html',
  styleUrls: ['./add-banner-dialog.component.css']
})
export class AddBannerDialogComponent implements OnInit {
  public myForm: FormGroup;
  public submitInProgress: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private messageService: MessageService,
              private bannerService: BannerService,
              private dialogRef: MatDialogRef<AddBannerDialogComponent>) { }

  public ngOnInit(): void {
    // Initialize the form
    this.myForm = this.formBuilder.group({
      message: [null, Validators.required],
      urgency: [null, Validators.required]
    });
  }

  public userPressedOk(): void {
      this.myForm.markAllAsTouched();

      if (this.myForm.invalid) {
        // One or more form fields are invalid.  So, stop here
        return;
      }

      // Prevent the user from closing this dialog box by clicking outside of it
      this.dialogRef.disableClose = true;

      // Show the spinner and disable the buttons
      this.submitInProgress = true;

      let dto: AddBannerDTO = new AddBannerDTO();
      dto.message = this.myForm.controls.message.value;
      dto.banner_urgency_id = this.myForm.controls.urgency.value;

      let restCallSucceeded = false;

      // Invoke the REST call
      this.bannerService.addBanner(dto).subscribe( () => {
        // The new banner was successfully added

        // Show a success message
        this.messageService.showSuccessMessage("New banner was added");

        restCallSucceeded = true;

      }).add( () => {
        // REST call finally block.  This gets called whether the REST endpoint works or fails
        this.dialogRef.close(restCallSucceeded)
      });
  }

  public userPressedCancel(): void {
    // Close the dialog box and return false  (so the caller knows not to reload the grid)
    this.dialogRef.close(false);
  }
}
