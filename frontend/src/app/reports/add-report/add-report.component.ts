import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AddReportFormGroup} from "./add-report.form.group";
import {LookupDTO} from "../../models/lookup.DTO";
import {LookupService} from "../../services/lookup.service";
import {LoadingWrapper} from "../../services/loading.wrapper";
import {MessageService} from "../../services/message.service";
import {ReportService} from "../../services/report.service";
import {Observable} from "rxjs";

export class Report {
  name: string | null;
  priority: number | null;
  source: number | null;
  authors: string | null;
  start_date: Date | null;
  end_date: Date | null;         // new code is here
}

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.css']
})
export class AddReportComponent implements OnInit, AfterViewInit {
  @ViewChild('name',  { read: ElementRef }) reportNameTextbox: ElementRef;

  public form: AddReportFormGroup = new AddReportFormGroup();
  public formSubmitted: boolean = false;
  public defaultReportStartDate: Date = new Date();  // this.getFirstDayOfPreviousMonth();
  public prioritiesObs: LoadingWrapper<LookupDTO[]>;
  public authorsObs: Observable<LookupDTO[]>;
  public reportSourceObs: Observable<LookupDTO[]>;
  public showSpinner: boolean;

  constructor(private lookupService:  LookupService,
              private messageService: MessageService,
              private reportService:  ReportService)
  { }

  ngOnInit(): void {

    // Get an observable to the priorities
    // NOTE:  The AsyncPipe will subscribe and unsubscribe from this observable
    this.prioritiesObs = new LoadingWrapper(
          this.lookupService.getLookupWithTypeAndOrder("priority", "display_order")
    );

    this.authorsObs = this.lookupService.getLookupWithTypeAndOrder("author", "name");
    this.reportSourceObs = this.lookupService.getLookupWithTypeAndOrder("report_source", "name");
  }


  private getFirstDayOfPreviousMonth(): Date {
    let now = new Date();
    let firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return firstDayPrevMonth;
  }

  ngAfterViewInit(): void {

    // Set the focus to the report name textbox
    // WARNING:  By setting the focus on this textbox and making it a required field,
    //           this box will turn red as soon as the user clicks on any other control
    //  setTimeout(() => this.reportNameTextbox.nativeElement.focus(), 0);
  }


  public reset(): void {
    this.formSubmitted = false;

    // Reset the form back to pristine/untouched condition
    this.form.reset();
    this.messageService.sendMessage("Successfully saved this report");
  }

  public save(): void {
    this.formSubmitted = true;

    // Make all form fields as touched -- so that error validation displays
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      // The form is not valid -- so stop here
      return;
    }

    let report: Report = new Report();
    report.priority = this.form.controls.priority.value;
    report.name = this.form.controls.name.value;
    report.authors = this.form.controls.authors.value;
    report.start_date = this.form.controls.start_date.value;
    report.end_date = this.form.controls.end_date.value;

    // Show the spinner
    this.showSpinner = true;

    // Invoke a service to add a report record
    this.reportService.add(report).subscribe(response => {
        // REST call succeeded
        this.messageService.sendMessage("Successfully added a new report.");

        // Reset the form
        this.form.reset();
        this.formSubmitted = false;
      },
      response => {
        // REST call failed
        console.error('Failed to create a new report.  Error is ', response?.error);
        this.messageService.sendMessage(`Failed to create a new report.  Error is ${response?.error}`);
      }).add(() =>
      {
        // REST call has finished (either with failure or success)

        // Hide the spinner
        this.showSpinner = false;
      });

    }


}
