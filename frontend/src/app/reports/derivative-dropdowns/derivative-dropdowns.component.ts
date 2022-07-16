import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LookupDTO} from "../../models/lookup-dto";
import {Observable, Subscription} from "rxjs";
import {ReportService} from "../../services/report.service";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-derivative-dropdowns',
  templateUrl: './derivative-dropdowns.component.html',
  styleUrls: ['./derivative-dropdowns.component.css']
})
export class DerivativeDropdownsComponent implements OnInit, OnDestroy {

  public myForm: FormGroup;

  public allPrimaryObsValues: Observable<LookupDTO[]>;
  public secondaryObsValues:  Observable<LookupDTO[]>;
  public tertiaryObsValues:   Observable<LookupDTO[]>;

  private primaryDropdownSubscription:   Subscription;
  private secondaryDropdownSubscription: Subscription;


  constructor(private formBuilder: FormBuilder,
              private reportService: ReportService) { }

  public ngOnInit(): void {

    // Initialize the formBuilder object
    this.myForm = this.formBuilder.group({
      primaryInput:   [null, Validators.required],
      secondaryInput: [null, Validators.required],
      tertiaryInput:  [null, Validators.required]
    })


    // Initialize the primaryObsValues to be an observable holding all possible primary values
    this.allPrimaryObsValues = this.reportService.getAllPrimaryObs();

    this.listenForPrimaryDropdownChanges();
    this.listenForSecondaryDropdownChanges();
  }


  public ngOnDestroy(): void {
    if (this.primaryDropdownSubscription) {
      this.primaryDropdownSubscription.unsubscribe();
    }

    if (this.secondaryDropdownSubscription) {
      this.secondaryDropdownSubscription.unsubscribe();
    }
  }


  private listenForPrimaryDropdownChanges(): void {
    this.primaryDropdownSubscription = this.myForm.controls.primaryInput.valueChanges.subscribe((selectedPrimaryId: number) => {

      if (selectedPrimaryId != null) {
        // The user has changed the primary dropdown

        // Reset the dropdowns after the primary dropdown
        this.myForm.controls.secondaryInput.reset()
        this.myForm.controls.tertiaryInput.reset()

        // Change what is displayed for the secondary dropdowns (by changing secondaryObsValues)
        this.secondaryObsValues = this.reportService.getAllSecondaryValuesForParent(selectedPrimaryId).pipe(
          tap((data: LookupDTO[]) => {
            // The REST call came back with the latest secondary values

            if ((data != null) && (data.length == 1)) {
              // There is only one secondary value.  So, have it pre-selected for the user
              this.myForm.controls.secondaryInput.setValue(data[0].id, { emitEvents: true})
            }
          })
        );
      }
    });

  }  // end of listenForPrimaryDropdownChanges()



  private listenForSecondaryDropdownChanges(): void {
    this.secondaryDropdownSubscription = this.myForm.controls.secondaryInput.valueChanges.subscribe((selectedSecondaryId: number) => {

      if (selectedSecondaryId != null) {
        // The user has changed the secondary dropdown

        // Reset the other dropdowns after the secondary dropdown
        this.myForm.controls.tertiaryInput.reset()

        // Change what is displayed for the secondary dropdowns (by changing secondaryObsValues)
        this.tertiaryObsValues = this.reportService.getAllTertiaryValuesForParent(selectedSecondaryId).pipe(
          tap((data: LookupDTO[]) => {
            // The REST call came back with the latest tertiary values

            if ((data != null) && (data.length == 1)) {
              // There is only one tertiary value.  So, have it pre-selected for the user
              this.myForm.controls.tertiaryInput.setValue(data[0].id, { emitEvents: true})
            }
          })
        );
      }
    });

  }  // end of listenForSecondaryDropdownChanges()


  public resetClicked(): void {
    this.myForm.reset()
  }


  public saveClicked(): void {

  }
}
