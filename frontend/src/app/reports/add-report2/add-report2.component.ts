import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidatorUtils} from "../../validators/validator-utils";
import {MessageService} from "../../services/message.service";
import {LookupDTO} from "../../models/lookup-dto";
import {LookupService} from "../../services/lookup.service";
import {Observable, of, Subject} from "rxjs";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-add-report2',
  templateUrl: './add-report2.component.html',
  styleUrls: ['./add-report2.component.css']
})
export class AddReport2Component implements OnInit {

  public myForm: FormGroup;
  public authorsObs: Observable<LookupDTO[]>;
  public reportSourceObs: Observable<LookupDTO[]>;

  public prioritiesObs: Observable<LookupDTO[] | null>;
  public loadingPriorityErrorObs = new Subject<boolean>();


  constructor(private messageService: MessageService,
              private formBuilder: FormBuilder,
              private lookupService: LookupService) { }


  public ngOnInit(): void {

    // Get the observable to the List of LookupDTO objects
    // NOTE:  The AsyncPipe will subscribe and unsubscribe automatically
    this.prioritiesObs = this.lookupService.getLookupWithTypeAndOrder("priority", "display_order").pipe(
      catchError((error) => {
        // Log an error in the console here  (otherwise you will NOT see an error in the console)
        console.error('error loading the list of priorities: ', error);

        // Send a message to the html that there was an error loading priorities
        this.loadingPriorityErrorObs.next(true);

        // Recover the observable and give it a "falsy" value of null
        return of(null);
      })
    );

    this.authorsObs = this.lookupService.getLookupWithTypeAndOrder("author", "name");

    this.reportSourceObs = this.lookupService.getLookupWithTypeAndOrder("report_source", "name");


    this.myForm = this.formBuilder.group({
      report_name: [null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]],

      source: ['',  null],

      priority:  ['', Validators.required],

      authors:  ['',
        [
          Validators.required,
          ValidatorUtils.validateMultipleSelect(1,2)
        ]]
    });


  }


  public reset(): void {
    console.log('user pressed reset');
    this.myForm.reset();
  }

  public save(): void {
    console.log('User pressed save.');

    // Mark all fields as touched so the user can see any errors
    this.myForm.markAllAsTouched();

    if (this.myForm.invalid) {
      // User did not pass validation so stop here
      return;
    }

    // User enter valid data
    console.log('Valid data:  report_name=' + this.myForm.controls.report_name.value);

    // Send a message
    this.messageService.showErrorMessage("Failed to save your record.  An error occurred.");
  }



}
