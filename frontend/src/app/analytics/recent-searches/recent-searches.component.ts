import { Component, OnInit } from '@angular/core';
import {ColumnApi, GridApi, GridOptions} from "ag-grid-community";
import {RecentSearchDTO} from "../../models/recent-search-dto";
import {AdvancedSearchService} from "../../services/advanced-search.service";

@Component({
  selector: 'app-recent-searches',
  templateUrl: './recent-searches.component.html',
  styleUrls: ['./recent-searches.component.css']
})
export class RecentSearchesComponent implements OnInit {

  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;
  public rowData: RecentSearchDTO[];

  public gridOptions: GridOptions = {
    domLayout: 'normal',
    debug: false,
    suppressCellSelection: true,
    rowModelType: 'clientSide'
  }

  private textFilterParams = {
    filterOptions: ['contains', 'notContains'],
    caseSensitive: false,
    debounceMs: 200,
    suppressAndOrCondition: true
  };

  public defaultColDefs: any = {
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: true,	// Causes the filter row to appear below column names
  };

  public columnDefs = [
    {
      headerName: 'Action',
      maxWidth: 100,
      filter: false,
      suppressMenu: true,
      sortable: false,
      cellStyle: {'text-align': 'center'},
      cellRenderer: 'actionCellRenderer',
      flex: 1,
    },
    {
      field: 'createdDate',
      headerName: "Run Time",
      filterParams: this.textFilterParams,
      filter: 'agTextColumnFilter',
      flex: 1
    },
    {
      field: 'query',
      headerName: "Search Query",
      filterParams: this.textFilterParams,
      filter: 'agTextColumnFilter',
      flex: 2
    }
  ];



  constructor(private advancedSearchService: AdvancedSearchService) { }


  ngOnInit(): void {
  }

  public onGridReady(params: any): void {
    // Get a reference to the gridApi and gridColumnApi (which we will need later to get selected rows)
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // Show the loading overlay
    this.gridApi.showLoadingOverlay();

    // Invoke a REST call to get data for the initial page load
    this.advancedSearchService.getRecentSearches().subscribe((aData: RecentSearchDTO[]) => {
      // We got data from the REST call

      // Put the data into the grid
      this.rowData = aData;
    });

  }	// end of onGridReady()
}
