import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs";
import {GetExceptionInfoDTO} from "../../models/get-exception-info-dto";
import {ColumnApi, GridApi, GridOptions, RowDoubleClickedEvent} from "ag-grid-community";
import {ExceptionService} from "../../services/exception.service";
import {PreferenceService} from "../../services/preference.service";
import {debounceTime, switchMap} from "rxjs/operators";
import {Constants} from "../../utilities/constants";
import {GetOnePreferenceDTO} from "../../models/preferences/get-one-preference-dto";
import {BannerService} from "../../services/banner.service";

@Component({
  selector: 'app-list-exceptions-grid',
  templateUrl: './list-exceptions-grid.component.html',
  styleUrls: ['./list-exceptions-grid.component.css']
})
export class ListExceptionsGridComponent implements  OnInit, OnDestroy {

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler() {
    // Someone pressed the Escape key
    this.userPressedEscape();
  }

  private readonly PAGE_NAME: string = "exceptions-grid-view";
  private listenForGridChanges: boolean = false;
  private saveGridColumnStateEventsSubject: Subject<any> = new Subject();
  private saveGridEventsSubscription: Subscription;

  public readonly LAST_1_DAY_FILTER: number = 1;
  public readonly LAST_7_DAYS_FILTER: number = 2;
  public readonly LAST_30_DAYS_FILTER: number = 3;
  public readonly YEAR_TO_DATE_FILTER: number = 4;
  public readonly SHOW_ALL_DATA_FILTER: number = 5;

  private readonly DEFAULT_FILTER = this.LAST_7_DAYS_FILTER;

  public selectedFilter: number = this.DEFAULT_FILTER;
  public selectedFilterLabel: string;

  public selectedRow: GetExceptionInfoDTO;
  public sideBarIsVisible: boolean = false;

  private textFilterParams = {
    filterOptions: ['contains', 'notContains'],
    caseSensitive: false,
    debounceMs: 200,
    suppressAndOrCondition: true,
  };

  public defaultColDefs: any = {
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: true,    // Causes the filter row to appear below column names
  };

  public gridOptions: GridOptions = {
    rowModelType: 'clientSide',
    domLayout: 'normal',
    debug: false,
    suppressCellSelection: true,

    overlayNoRowsTemplate:  '<span class="ng-overlay-loading-center">No exceptions were found</span>',
    overlayLoadingTemplate: '<span class="ng-overlay-loading-center">Loading data now...</span>',


    onRowDoubleClicked:(event: RowDoubleClickedEvent) => {
      this.openSideBar(event.data)
    },

    onSortChanged: () => {
      this.saveColumnState();
    },

    onDragStopped: () => {
      this.saveColumnState();
    },

    onDisplayedColumnsChanged: () => {
      this.saveColumnState();
    },

    onColumnVisible: () => {
      this.saveColumnState();
    },

    onColumnPinned: () => {
      this.saveColumnState();
    },

  }

  public columnDefs = [
    {
      field: 'id',
      headerName: "ID",
      filterParams: this.textFilterParams,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'app_name',
      headerName: "Application",
      filterParams: this.textFilterParams,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'app_version',
      headerName: "Version",
      filterParams: this.textFilterParams,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'event_date',
      headerName: "Date",
      filterParams: this.textFilterParams,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'message',
      headerName: "Message",
      filterParams: this.textFilterParams,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'url',
      headerName: "URL",
      filterParams: this.textFilterParams,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'user_name',
      headerName: "User Name",
      filterParams: this.textFilterParams,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'user_full_name',
      headerName: "User Full Name",
      filterParams: this.textFilterParams,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'cause',
      headerName: "Cause",
      filterParams: this.textFilterParams,
      filter: 'agTextColumnFilter',
      hide: true
    }
  ];

  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  public rowData: GetExceptionInfoDTO[];
  public bannerHeightInPixelsObs: Observable<string>;

  constructor(private bannerService: BannerService,
              private exceptionService: ExceptionService,
              private preferenceService: PreferenceService) { }

  public ngOnInit(): void {

    this.bannerHeightInPixelsObs = this.bannerService.getBannerHeightInPixelsObs();


    // Listen for save-grid-column-state events
    // NOTE:  If a user manipulates the grid, then we could be sending LOTS of save-column-state REST calls
    //        The debounceTime slows down the REST calls
    //        The switchMap cancels previous calls
    //        Thus, if there are lots of changes to the grid, we invoke a single REST call using the *LAST* event (over a span of 250 msecs)
    this.saveGridEventsSubscription = this.saveGridColumnStateEventsSubject.asObservable().pipe(
      debounceTime(250),         // Wait 250 msecs before invoking REST call
      switchMap( (aNewColumnState: any) => {
        // Use the switchMap for its cancelling effect:
        // On each observable, the previous observable is cancelled
        // Return an observable

        // Invoke the REST call to save it to the back end
        return this.preferenceService.setPreferenceValueForPageUsingJson(Constants.COLUMN_STATE_PREFERENCE_NAME, aNewColumnState, this.PAGE_NAME)
      })
    ).subscribe();
  }

  public ngOnDestroy(): void {
    if (this.saveGridEventsSubscription) {
      this.saveGridEventsSubscription.unsubscribe();
    }

    if (this.saveGridColumnStateEventsSubject) {
      this.saveGridColumnStateEventsSubject.unsubscribe();
    }
  }


  public onGridReady(params: any): void {
    // Get a reference to the gridApi and gridColumnApi (which we will need later to get selected rows)
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // Show the loading overlay
    this.gridApi.showLoadingOverlay();

    // Get the preferences for the grid
    this.preferenceService.getPreferenceValueForPage(Constants.COLUMN_STATE_PREFERENCE_NAME, this.PAGE_NAME).subscribe( (aPreference: GetOnePreferenceDTO) => {
      // REST call came back.  I have the grid preferences

      if (! aPreference.value) {
        // There are no preferences, size the columns to fit
        this.gridApi.sizeColumnsToFit()
      }
      else {
        // There is past column state
        let storedColumnStateObject = JSON.parse(aPreference.value);

        // Set the grid to use past column state
        this.gridColumnApi.setColumnState(storedColumnStateObject);
      }

      // Get the preferences for the filters
      this.preferenceService.getPreferenceValueForPage(Constants.EXCEPTION_FILTER_PREFERENCE_NAME, this.PAGE_NAME).subscribe((aPreference: GetOnePreferenceDTO) => {
        let selectedFilterToUse: number;

        if (!aPreference.value) {
          // Theres no past saved filter number
          selectedFilterToUse = this.DEFAULT_FILTER;
        }
        else {
          // There is a past saved filter number
          selectedFilterToUse = Number(aPreference.value);
          this.selectedFilter = selectedFilterToUse;
        }
        // Load the grid
        this.applyFilterAndReloadGrid(selectedFilterToUse);
      });
    });

  }    // end of onGridReady()


  public applyFilterAndReloadGrid(aNewFilterNumber: number) {
    if (this.selectedFilter != aNewFilterNumber) {
      // The user is changing the filter, invoke the REST call to save it
      this.preferenceService.setPreferenceValueForPage(Constants.EXCEPTION_FILTER_PREFERENCE_NAME, aNewFilterNumber, this.PAGE_NAME).subscribe()
    }

    this.selectedFilter = aNewFilterNumber;

    // Show the loading message
    this.gridApi.showLoadingOverlay()

    // Invoke the REST endpoint and import the data with a passed-in filter number
    this.exceptionService.getListOfExceptions(aNewFilterNumber).subscribe((aData: GetExceptionInfoDTO[]) => {
      // We got data from the REST call

      this.updateFilterLabel(aNewFilterNumber);

      // Put the data into the grid
      this.rowData = aData;

    });

  }

  private updateFilterLabel(aFilterNumber: number) {
    if (aFilterNumber == this.LAST_1_DAY_FILTER) {
      this.selectedFilterLabel = "Filtering records to the last 1 day"
    }
    else if (aFilterNumber == this.LAST_7_DAYS_FILTER) {
      this.selectedFilterLabel = "Filtering records to the last 7 days"
    }
    else if (aFilterNumber == this.LAST_30_DAYS_FILTER) {
      this.selectedFilterLabel = "Filtering records to the last 30 days"
    }
    else if (aFilterNumber == this.YEAR_TO_DATE_FILTER) {
      this.selectedFilterLabel = "Filtering records to beginning of this year"
    }
    else if (aFilterNumber == this.SHOW_ALL_DATA_FILTER) {
      this.selectedFilterLabel = ""
    }
  }

  public resetGrid(): void {
    // Reset the columns before sizing them
    this.gridColumnApi.resetColumnState();
    this.gridApi.sizeColumnsToFit();

    // Clear all the grid sorting
    this.clearGridSorting();

    // Clear all the filters
    this.gridApi.setFilterModel(null);

    // Reload the grid with the current filter
    this.applyFilterAndReloadGrid(this.selectedFilter);
  }

  private clearGridSorting() {
    this.gridColumnApi.applyColumnState({
      defaultState: {
        sort: null
      }
    });
  }

  private saveColumnState(): void {
    if (this.listenForGridChanges) {
      // The grid has rendered data.  So, save the sort/column changes

      // Get the current column state
      let currentColumnState = this.gridColumnApi.getColumnState();

      // Send a message to save the current column state
      this.saveGridColumnStateEventsSubject.next(currentColumnState)
    }
  }

  public firstDataRendered(): void {
    // The grid is fully rendered.  So, set the flag to start saving sort/column changes
    this.listenForGridChanges = true;
  }

  private openSideBar(aData: GetExceptionInfoDTO) {
    this.selectedRow = aData;
    this.sideBarIsVisible = true;
  }

  public userPressedEscape(): void {
    this.sideBarIsVisible = false;
  }
}
