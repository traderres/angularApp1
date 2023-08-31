import { Component } from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";

@Component({
  selector: 'app-grid3-action-cell-renderer',
  templateUrl: './grid3-action-cell-renderer.component.html',
  styleUrls: ['./grid3-action-cell-renderer.component.css']
})
export class Grid3ActionCellRendererComponent implements ICellRendererAngularComp {
  public params: ICellRendererParams;

  constructor() { }

  public agInit(aParams: ICellRendererParams): void {
    this.params = aParams;
  }

  public refresh(params: ICellRendererParams): boolean {
    return false;
  }



}
