import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {HistoryService} from "../services/history.service";
import {Observable} from "rxjs";
import {HistoryEntryDto} from "../models/history-entry-dto";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-tab-history',
  templateUrl: './tab-history.component.html',
  styleUrls: ['./tab-history.component.css']
})
export class TabHistoryComponent implements OnInit, OnDestroy {
  @Input() public reportId: number;

  public  historyEntriesObs: Observable<HistoryEntryDto[]>;
  public  myForm: FormGroup;


  constructor(private historyService: HistoryService,
              private formBuilder: FormBuilder) { }


  public ngOnInit(): void {

    // Get an observable to the list of history entries   (for the history tab)
    // NOTE:  The Async Pipe will subscribe and unsubscribe to this observable
    this.historyEntriesObs = this.historyService.getListOfHistoryEntries(this.reportId);

    // Initialize the form (for the timeline filter)
    this.myForm = this.formBuilder.group({
      eventType:       [null, null],
      eventDateRange:  [0, null],
      eventText:       [null,  null]
    });
  }


  public ngOnDestroy(): void {

  }
}
