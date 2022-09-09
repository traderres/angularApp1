import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BannerService} from "../../../services/banner.service";
import {MessageService} from "../../../services/message.service";
import {DeleteBannerFormData} from "../../../models/delete-banner-form-data";

@Component({
  selector: 'app-delete-banner-dialog',
  templateUrl: './delete-banner-dialog.component.html',
  styleUrls: ['./delete-banner-dialog.component.css']
})
export class DeleteBannerDialogComponent implements OnInit {
  public submitInProgress: boolean = false;

  constructor(private bannerService: BannerService,
              private messageService: MessageService,
              private dialogRef: MatDialogRef<DeleteBannerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DeleteBannerFormData ) { }

  public ngOnInit(): void {
  }



  public userPressedOk(): void {

    // Prevent the user from closing this dialog box by clicking outside of it
    this.dialogRef.disableClose = true;

    // Show the spinner and disable the buttons
    this.submitInProgress = true;

    let restCallSucceeded = false;

    // Invoke the REST call
    this.bannerService.deleteBanner(this.data.id).subscribe( () => {
      // The banner was successfully delete

      // Show a success message
      this.messageService.showSuccessMessage("The banner was deleted.");

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
