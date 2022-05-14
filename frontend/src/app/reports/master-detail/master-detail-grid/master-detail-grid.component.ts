import {Component, OnInit} from '@angular/core';
import {ColumnApi, GridApi, GridOptions, ICellRendererParams, RowDoubleClickedEvent} from "ag-grid-community";
import {ReportRowDataDTO} from "../../../models/report-row-data-dto";
import {GridService} from "../../../services/grid.service";
import {CustomDetailRendererComponent} from "../custom-detail-renderer/custom-detail-renderer.component";

@Component({
  selector: 'app-master-detail-grid',
  templateUrl: './master-detail-grid.component.html',
  styleUrls: ['./master-detail-grid.component.css']
})
export class MasterDetailGridComponent implements OnInit {


  public gridOptions: GridOptions = {
    debug: false,
    suppressCellSelection: true,
    rowSelection: 'single',      // Possible values are 'single' and 'multiple'
    domLayout: 'normal',

    masterDetail: true,
    detailCellRenderer: 'myDetailRenderer',
    detailCellRendererParams: {
      updateWasPressed: (id: number, updatedRowData: ReportRowDataDTO) => this.updateWasPressedInDetailRenderer(id, updatedRowData)
    },


    // dynamically assigning detail row height
    getRowHeight: (params: any) => {
      const isDetailRow = params.node.detail;

      // for all rows that are not detail rows, return nothing
      if (!isDetailRow) { return undefined; }

      // otherwise return height based on number of rows in detail grid
      let detailPanelHeight = 200;
      if (params.data.id == 1) {
        // Do some calculation based on the data in this row
        detailPanelHeight = 150;
      }

      return detailPanelHeight;
    },


    onRowDoubleClicked: (event: RowDoubleClickedEvent) => this.userDoubleCLickedOnRow(event)
  };

  // Tell ag-grid which cell-renderers will be available
  // This is a map of components that implement ICellRendererAngularComp
  public frameworkComponents: any = {
    myDetailRenderer:  CustomDetailRendererComponent
  };


  public defaultColDefs: any = {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: true,    // Causes the filter row to appear below column names
    autoHeight: true
  };

  public columnDefs = [
    {
      field: 'id',
      cellRenderer: 'agGroupCellRenderer',
      valueGetter: () => { return " "},   // overwriting the value getter to nothing is displayed
      filter: false,
      suppressMenu: false,
      sortable: false,
      resizable: true,
    },
    {
      field: 'name',
      cellClass: 'grid-text-cell-format',
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'priority',
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'start_date',
      cellClass: 'grid-text-cell-format',
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter'
    },
    {
      field: 'end_date',
      cellClass: 'grid-text-cell-format',
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter'
    }
  ];



  public  rowData: ReportRowDataDTO[];
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;

  constructor(private gridService: GridService) {}


  public ngOnInit(): void {

  }


  /*
   * The grid is ready.  So, perform grid initialization here:
   */
  public onGridReady(params: any): void {
    // Get a reference to the gridApi and gridColumnApi (which we will need later to get selected rows)
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // Load the grid with data
    this.reloadPage();
  }


  private reloadPage(): void {

    // Show the loading overlay
    this.gridApi.showLoadingOverlay();

    // Invoke a REST call to get data for the initial page load
    this.gridService.getReportData().subscribe((aData: ReportRowDataDTO[]) => {
      // We got data from the REST call

      // Put the data into the grid
      this.rowData = aData;

      // Unselect all values
      this.gridApi.deselectAll();
    });

  }  // end of reloadPage()


  /*
   * Clear all grid sorting
   */
  private clearGridSorting(): void {

    // Tell the grid to clear sorting on all columns
    this.gridColumnApi.applyColumnState({
      defaultState: { sort: null }
    });

  }


  /*
   * Reset the grid back to default settings
   */
  public resetGrid(): void {
    // Clear all sorting
    this.clearGridSorting();

    // Clear the filters
    this.gridApi.setFilterModel(null);

    // Reset columns (so they are visible and restored to default)
    this.gridColumnApi.resetColumnState();
  }

  /*
   * User double clicked on a row
   *   If the row is expanded, then collapse it
   *   If the row is collapse, then expand it
   */
  private userDoubleCLickedOnRow(aEvent: RowDoubleClickedEvent) {
    let isRowExpanded: boolean = aEvent.node.expanded;

    if (isRowExpanded == true) {
      // This row is expanded so collapse it
      aEvent.node.expanded = false;
    }
    else {
      // This row is collapsed so expand it
      aEvent.node.expanded = true;
    }

    this.gridApi.onGroupExpandedOrCollapsed()
  }


  private updateWasPressedInDetailRenderer(aUpdatedRowId: number, aUpdatedRowData: ReportRowDataDTO) {
    console.log('updateWasPressed() updatedRowId=', aUpdatedRowId);

    // Update the row using a Transaction Update
    const transaction = {
      update: [ aUpdatedRowData ]
    };

    this.gridApi.applyTransaction(transaction);
  }
}
