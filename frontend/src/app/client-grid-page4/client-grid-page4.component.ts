import { Component, OnInit } from '@angular/core';
import {ColDef, ColumnApi, GridApi, GridOptions} from "ag-grid-community";
import {GridService} from "../services/grid.service";
import {GetReportRowDTO} from "../models/get-report-row-dto";
import {StatusCellRendererComponent} from "../status-cell-renderer/status-cell-renderer.component";
import {Grid3ActionCellRendererComponent} from "../grid3-action-cell-renderer/grid3-action-cell-renderer.component";
import {ThemeService} from "../theme.service";
import {ThemeDTO} from "../models/theme-dto";

@Component({
  selector: 'app-client-grid-page4',
  templateUrl: './client-grid-page4.component.html',
  styleUrls: ['./client-grid-page4.component.css']
})
export class ClientGridPage4Component implements OnInit {
  public selectedTheme: string = "ag-theme-alpine";

  private gridApi:       GridApi;
  private gridColumnApi: ColumnApi;

  public frameworkComponents: any = {
    statusCellRenderer: StatusCellRendererComponent,
    actionCellRenderer: Grid3ActionCellRendererComponent
  };

  public gridOptions: GridOptions = {
    debug: false,
    rowModelType: 'clientSide',
    domLayout: 'normal',
    suppressContextMenu: true
  }

  public columnDefs: ColDef[] = [
    {
      headerName: 'Action',
      cellRenderer: 'actionCellRenderer',
      cellClass: "vertically-align-icon-buttons",
    },
    {
      field: 'report_name',
      headerName: 'Report Name',
      cellClass: 'grid-text-cell-format'
    },
    {
      field: 'status_label',
      headerName: 'Status',
      cellRenderer: 'statusCellRenderer',
      cellClass: "vertically-align-icon-buttons",
    },
    {
      field: 'created_date',
      headerName: 'Created Date',
      cellClass: 'grid-text-cell-format'
    }

  ]

  public defaultColDefs: ColDef = {
    resizable: true,
    sortable: true,
    flex: 1
  }

  constructor(private gridService: GridService,
              private themeService: ThemeService) { }

  public ngOnInit(): void {

    this.themeService.listenForMessagesWithNewTheme().subscribe( (aNewThemeDTO: ThemeDTO) => {
      // We received a message about a new theme

      // Set the theme on this page so it changes
      this.selectedTheme = aNewThemeDTO.themeName;
    })

  }

  public onGridReady(aParams: any): void {
    this.gridApi = aParams.api;
    this.gridColumnApi = aParams.columnApi;

    this.gridService.getAllReports().subscribe( (aData: GetReportRowDTO[] ) => {
      this.gridApi.setRowData(aData);
    })
  }

}
