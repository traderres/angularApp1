import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidatorUtils} from "../../validators/validator-utils";
import {MessageService} from "../../services/message.service";
import {LookupDTO} from "../../models/lookup-dto";
import {LookupService} from "../../services/lookup.service";
import {Observable} from "rxjs";
import {ReportDTO} from "../../models/report-dto";
import {ReportService} from "../../services/report.service";
import {GetCountryCallingCodesDto} from "../../models/get-country-calling-codes-dto";
import {UserService} from "../../services/user.service";
import {tap} from "rxjs/operators";
import {GetServerSideGroupKey} from "ag-grid-community/dist/lib/entities/gridOptions";

@Component({
  selector: 'app-add-report2',
  templateUrl: './add-report2.component.html',
  styleUrls: ['./add-report2.component.css']
})
export class AddReport2Component implements OnInit {

  public myForm: FormGroup;
  public authorsObs: Observable<LookupDTO[]>;
  public reportSourceObs: Observable<LookupDTO[]>;
  public prioritiesObs: Observable<LookupDTO[]>;
  public countryCallingCodesObs: Observable<GetCountryCallingCodesDto[]>;

  public selectedItem: GetCountryCallingCodesDto;

  constructor(private messageService: MessageService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private lookupService: LookupService,
              private reportService: ReportService) { }


  public ngOnInit(): void {


    this.countryCallingCodesObs = this.userService.getCountryCodesForPhoneNumber().pipe(
      tap( (aData: GetCountryCallingCodesDto[]) => {
        for (let i=0; i<aData.length; i++) {
          let dto: GetCountryCallingCodesDto = aData[i];

          if (dto.countryId == 188) {
            // I found the default value.  So, set it in the form
            this.myForm.controls.phoneNumberCallingCode.setValue(dto);

            // Show the selected value on the web page
            this.selectedItem = dto;
          }
        }
      }));



    // Get the observable to the List of LookupDTO objects
    // NOTE:  The AsyncPipe will subscribe and unsubscribe automatically
    this.prioritiesObs = this.lookupService.getLookupWithTypeAndOrder(      "priority", "display_order");




    this.authorsObs = this.lookupService.getLookupWithTypeAndOrder("author", "name");

    this.reportSourceObs = this.lookupService.getLookupWithTypeAndOrder("report_source", "name");


    this.myForm = this.formBuilder.group({

      phoneNumberCallingCode: [null, null],

      report_name: [null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]],

      source: ['',  null],
      priority:  ['', Validators.required],
      phone_number: [null, [Validators.required, Validators.pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)]],
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

    // Mark all fields as touched so the user can see any errors
    this.myForm.markAllAsTouched();

    if (this.myForm.invalid) {
      // User did not pass validation so stop here
      return;
    }

    // Build the ReportDTO object
    let reportDTO: ReportDTO = new ReportDTO();
    reportDTO.name = this.myForm.controls.report_name.value;

    // Invoke a service to add a report record
    this.reportService.add(reportDTO).subscribe(response => {
        // REST call succeeded
        this.messageService.showSuccessMessage("Successfully added a new report.");

        // Reset the form
        this.myForm.reset();
      },
     ).add(  () => {
        // REST call finally block
        console.log('REST call finally block');
    });
  }

}
