import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {ColumnApi, GridApi, GridOptions, ICellRendererParams} from "ag-grid-community";
import {GetBannerDTO} from "../../../models/get-banner-dto";
import {PreferenceService} from "../../../services/preference.service";
import {debounceTime, switchMap} from "rxjs/operators";
import {Constants} from "../../../utilities/constants";
import {BannerService} from "../../../services/banner.service";
import {GetOnePreferenceDTO} from "../../../models/preferences/get-one-preference-dto";
import {MatDialog} from "@angular/material/dialog";
import {AddBannerDialogComponent} from "../add-banner-dialog/add-banner-dialog.component";
import {DeleteBannerDialogComponent} from "../delete-banner-dialog/delete-banner-dialog.component";
import {DeleteBannerFormData} from "../../../models/delete-banner-form-data";
import {ManageBannersGridActionRendererComponent} from "../manage-banners-grid-action-renderer/manage-banners-grid-action-renderer.component";

@Component({
  selector: 'app-manage-banners-grid',
  templateUrl: './manage-banners-grid.component.html',
  styleUrls: ['./manage-banners-grid.component.css']
})
export class ManageBannersGridComponent implements OnInit, OnDestroy {

  private readonly PAGE_NAME: string = "manage-banners-grid-view";
  private listenForGridChanges: boolean = false;
  private saveGridColumnStateEventsSubject: Subject<any> = new Subject();
  private saveGridEventsSubscription: Subscription;


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

    overlayNoRowsTemplate:  '<span class="ng-overlay-loading-center">No banners were found</span>',
    overlayLoadingTemplate: '<span class="ng-overlay-loading-center">Loading data now...</span>',

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


  // Tell ag-grid which cell-renderers will be available
  // This is a map of component names that correspond to components that implement ICellRendererAngularComp
  public frameworkComponents: any = {
    actionCellRenderer: ManageBannersGridActionRendererComponent
  };

  public columnDefs = [
    {
      field: 'id',
      cellClass: 'grid-text-cell-format',
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        deleteButtonGridMethod: (params: ICellRendererParams) => this.openDeleteBannerDialog(params.data),
      },
      headerName: 'Actions',
      filter: false,
      suppressMenu: false,
      sortable: false,
      resizable: true,
      maxWidth: 150
    },
    {
      field: 'urgency_label',
      headerName: "Urgency",
      filterParams: this.textFilterParams,
      filter: 'agTextColumnFilter',
      maxWidth: 150
    },
    {
      field: 'is_visible',
      headerName: "Is Visible?",
      filterParams: this.textFilterParams,
      filter: 'agTextColumnFilter',
      maxWidth: 150
    },
    {
      field: 'message',
      headerName: "Message",
      filterParams: this.textFilterParams,
      filter: 'agTextColumnFilter'
    },
  ];

  public gridApi: GridApi;

  public gridColumnApi: ColumnApi;

  public rowData: GetBannerDTO[];

  constructor(private bannerService: BannerService,
              private matDialog: MatDialog,
              private preferenceService: PreferenceService) { }

  public ngOnInit(): void {

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

        // Load the grid
        this.reloadData();
    });

  }    // end of onGridReady()


  public reloadData() {

    // Invoke the REST endpoint and import the data with a passed-in filter number
    this.bannerService.getListOfBanners().subscribe((aData: GetBannerDTO[]) => {
      // We got data from the REST call

      // Put the data into the grid
      this.rowData = aData;

    });

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
    this.reloadData();
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

  public openAddBannerDialog(): void {
    let dialogRef = this.matDialog.open(AddBannerDialogComponent, {
      width: "400px"
    });

    dialogRef.afterClosed().subscribe( (userAddedBanner: boolean) => {
      // The dialog box has closed

      if (userAddedBanner) {
        // The user added a banner.  So, reload the grid
        this.reloadData();
      }
    })
  }


  public openDeleteBannerDialog(aRowData: GetBannerDTO): void {
    let formData: DeleteBannerFormData = new DeleteBannerFormData();
    formData.id = aRowData.id;
    formData.message = aRowData.message;

    // Open the dialog box and pass-in the form data
    let dialogRef = this.matDialog.open(DeleteBannerDialogComponent, {
      width: "400px",
      data: formData
    });

    dialogRef.afterClosed().subscribe( (userDeletedBanner: boolean) => {
      // The dialog box has closed

      if (userDeletedBanner) {
        // The user deleted a banner.  So, reload the grid
        this.reloadData();
      }
    })
  }
}
