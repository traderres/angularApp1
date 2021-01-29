import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ElasticsearchService} from "../../services/elasticsearch.service";
import {SearchQueryDTO} from "../../models/search-query-dto";
import {GridOptions} from "ag-grid-community";
import {SaveSearchDialogComponent, SaveSearchDialogFormData } from "../../dialogs/save-search-dialog/save-search-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {SearchService} from "../../services/search.service";
import {MessageService} from "../../services/message.service";



@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  public query: string;
  public showProgressBar: boolean = false;
  public saveSearchDialogFormData: SaveSearchDialogFormData = new SaveSearchDialogFormData();

  public gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 20,
    rowGroupPanelShow: 'always'    // Possible options are 'never', 'always', and 'onlyWhenGrouping'
  };

  public defaultColDefs: any = {
    flex: 1,
    sortable: true,
    filter: true,
    floatingFilter: true    // Causes the filter row to appear below column names
  };



  public columnDefs = [
    {field: 'id' ,        headerName: 'Id',           filter: 'agNumberColumnFilter'},
    {field: 'name',       headerName: 'Report Name'},
    {field: 'country',    headerName: 'Country',    rowGroup: false, enableRowGroup: true},
    {field: 'priority',   headerName: 'Priority',   rowGroup: false, enableRowGroup: true},
    {field: 'start_year', headerName: 'Start Year',  filter: 'agNumberColumnFilter',   rowGroup: false, enableRowGroup: true},
    {field: 'start_date', headerName: 'Start Date',   filter: 'agDateColumnFilter'},
    {field: 'end_date',   headerName: 'End Date',     sortable: true}
  ];


  constructor(private route: ActivatedRoute,
              private elasticSearchService: ElasticsearchService,
              private matDialogService: MatDialog,
              private messageService: MessageService,
              private searchService: SearchService) { }



  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Get the passed-in query=
      this.query = params["query"];

      // Build a searchQueryDTO object
      let searchQueryDTO = new SearchQueryDTO();
      searchQueryDTO.index_name = "reports";
      searchQueryDTO.raw_query = this.query;
      searchQueryDTO.size = 20;

      this.gridOptions.onGridReady = () => {
        // The grid is ready

        this.elasticSearchService.runSearch(searchQueryDTO).subscribe(rowData => {
          // The REST call came back.  Now, load the matches into the grid

          if (this.gridOptions.api) {
            this.gridOptions.api.setRowData(rowData)
          }
        });
      };

    });

  }  // end of ngOnInit()





  /*
   * The user wishes to save the search
   * 1. Open the save-search-dialog
   * 2. Wait for it to close
   * 3. When it closes,
   *    If no data is returned, then user pressed "Cancel"
   *    If data is returned, then invoke the REST call to save the information
   */
  public openSaveSearchDialog(): void {
    this.saveSearchDialogFormData.name = '';
    this.saveSearchDialogFormData.is_default = false;

    // Open the Save-Search-Dialog-Component
    const dialogRef = this.matDialogService.open(SaveSearchDialogComponent, {
      minWidth: '250px',
      maxWidth: '250px',
      data: this.saveSearchDialogFormData
    });


    dialogRef.afterClosed().subscribe((formData: SaveSearchDialogFormData) => {
      // The dialog box has closed

      if (! formData) {
        // User pressed cancel or clicked outside of the dialog box
      }
      else {
        // User pressed "Save" and got passed validation

        // Show the progress bar
        this.showProgressBar = true;

        // Invoke REST call to save the search
        this.searchService.addSearch(formData).subscribe(response => {
            // REST call to update the record succeeded

            // Show a success message
            this.messageService.showSuccessMessage('Search was successfully saved.');
          },
          response => {
            // REST call failed

            // Show a failure message
            this.messageService.showErrorMessage('Failed to save this search.  Error is ' + response?.error);
            console.error('Failed to update this record.  Error is ', response?.error);
          }).add( () => {
          // REST call Finally block
          this.showProgressBar = false;
        });

      }

    });
  }

}
