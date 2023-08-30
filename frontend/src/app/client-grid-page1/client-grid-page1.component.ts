import { Component, OnInit } from '@angular/core';
import {ColumnApi, GridApi, GridOptions} from "ag-grid-community";
import {UsersGridRowDTO} from "../models/users-grid-row-dto";
import {UsersGridService} from "../services/users-grid.service";
import {LoginDateCellRendererComponent} from "./login-date-cell-renderer/login-date-cell-renderer.component";

@Component({
  selector: 'app-client-grid-page1',
  templateUrl: './client-grid-page1.component.html',
  styleUrls: ['./client-grid-page1.component.css']
})
export class ClientGridPage1Component implements OnInit {

  constructor(private usersGridService: UsersGridService) { }

  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;


  public gridOptions: GridOptions = {
    debug: true,                     // Tell ag-grid to show console logging
    rowModelType: 'clientSide',      // Tell ag-grid that this is a client-grid
    domLayout: 'normal',
  }


  public frameworkComponents: any = {
    loginDateCellRenderer: LoginDateCellRendererComponent,
  };



  private textFilterParams = {
    filterOptions: ['contains', 'notContains'],
    caseSensitive: false,
    debounceMs: 200,
    suppressAndOrCondition: true,
  };



  public defaultColDefs: any = {
    sortable: true,
    resizable: true,
    floatingFilter: true,
    filter: 'agTextColumnFilter',
    filterParams: this.textFilterParams,
  };


  public columnDefs: any = [
    {
      field: 'id',
      headerName: "Id",
      hide: false,
      flex: 1
    },
    {
      field: 'full_name',
      headerName: "Full Name",
      hide: false,
      flex: 2,
    },
    {
      field: 'last_login_date',
      headerName: "Last Login Date",
      flex: 1,
      cellRenderer: 'loginDateCellRenderer'
    }
  ];





  public ngOnInit(): void {
  }



  public onGridReady(params: any): void {
    // Get a reference to the gridApi and gridColumnApi (which we will need later to get selected rows)
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.usersGridService.getAllUsers().subscribe( (aData: UsersGridRowDTO[]) => {
        // The REST call came back

        // Set the data in the grid
        this.gridApi.setRowData(aData);

        this.gridApi.sizeColumnsToFit()
    })
  }




}
