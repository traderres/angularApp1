import { Component } from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";
import {ReportRowDataDTO} from "../../../models/report-row-data-dto";

@Component({
  selector: 'app-custom-detail-renderer',
  templateUrl: './custom-detail-renderer.component.html',
  styleUrls: ['./custom-detail-renderer.component.css']
})
export class CustomDetailRendererComponent implements ICellRendererAngularComp {

  public rowData: ReportRowDataDTO;
  public params: ICellRendererParams;

  constructor() { }


  public agInit(aParams: ICellRendererParams): void {
    this.rowData = aParams.data;
    this.params = aParams;
  }

  public refresh(aParams: ICellRendererParams): boolean {
    return false;
  }

  public updateClicked(): void {
    // Update the row data
    this.rowData.name = this.rowData.name + " Updated";

    // Call the updateWasPressed() method back in the master-detail-grid component
    // @ts-ignore
    this.params.updateWasPressed(this.rowData.id, this.rowData);
  }
}
