import { Component, OnInit } from '@angular/core';
import {ColumnApi, GridApi, GridOptions} from "ag-grid-community";
import {GridService} from "../services/grid.service";
import {GetReportRowDTO} from "../models/get-report-row-dto";
import {StatusCellRendererComponent} from "../status-cell-renderer/status-cell-renderer.component";
import {Grid3ActionCellRendererComponent} from "../grid3-action-cell-renderer/grid3-action-cell-renderer.component";

@Component({
  selector: 'app-client-grid-page3',
  templateUrl: './client-grid-page3.component.html',
  styleUrls: ['./client-grid-page3.component.css']
})
export class ClientGridPage3Component implements OnInit {
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;

  public frameworkComponents: any = {
    statusCellRenderer: StatusCellRendererComponent,
    actionCellRenderer: Grid3ActionCellRendererComponent
  };


  public gridOptions: GridOptions = {
    debug: true,                     // Tell ag-grid to show console logging
    rowModelType: 'clientSide',      // Tell ag-grid that this is a client-grid
    domLayout: 'normal',
    suppressCellSelection: true
  };

  public columnDefs: any = [
    {
      headerName: "Action",
      cellRenderer: 'actionCellRenderer',
    },
    {
      field: 'id',
      headerName: "Id",
      cellClass: 'grid-text-cell-format'
    },
    {
      field: 'report_name',
      headerName: "Report Name ",
      cellClass: 'grid-text-cell-format'
    },
    {
      field: 'status_label',
      headerName: "Status",
      cellRenderer: 'statusCellRenderer',
      autoHeight: true             // Need this to fix the margins around the StatusCellRenderer
    },
    {
      field: 'created_date',
      headerName: "Created Date",
      cellClass: 'grid-text-cell-format'
    }
  ];

  public defaultColDefs: any = {
    sortable: true,
    resizable: true,
  };



  constructor(private gridService: GridService) { }

  ngOnInit(): void {
  }

  public onGridReady(params: any): void {
    // Get a reference to the gridApi and gridColumnApi (which we will need later to get selected rows)
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridService.getAllReports().subscribe( (aData: GetReportRowDTO[]) => {
      // The REST call came back

      // Set the data in the grid
      this.gridApi.setRowData(aData);
    })
  }


  public resetGrid(): void {

    // Reset columns is called *FIRST*  (so the default columns are visible and restored to default)
    this.gridColumnApi.resetColumnState();

    // Call sizeColumnsToFit *SECOND* (to make sure that all default columns appear and take the full grid width)
    this.gridApi.sizeColumnsToFit();
  }


}
