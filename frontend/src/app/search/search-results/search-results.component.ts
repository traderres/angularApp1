import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ElasticsearchService} from "../../services/elasticsearch.service";
import {SearchQueryDTO} from "../../models/search-query-dto";
import {GridOptions} from "ag-grid-community";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  public query: string;


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


  // enableRowGroup: true --> makes it possible to group by row
  // rowGroup: true       --> perform row grouping on load

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
              private elasticSearchService: ElasticsearchService) { }



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

}
