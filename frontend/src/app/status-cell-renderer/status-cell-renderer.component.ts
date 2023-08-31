import { Component} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";

@Component({
  selector: 'app-status-cell-renderer',
  templateUrl: './status-cell-renderer.component.html',
  styleUrls: ['./status-cell-renderer.component.css']
})
export class StatusCellRendererComponent implements ICellRendererAngularComp {
  public statusId: number;
  public params: ICellRendererParams;

  constructor() { }

  public agInit(aParams: ICellRendererParams): void {
    this.params = aParams;

    // Pull the status out of the params and store it in the class variable
    this.statusId = aParams.data.status_id;
  }

  public refresh(aParams: ICellRendererParams): boolean {
    return false;
  }

}
