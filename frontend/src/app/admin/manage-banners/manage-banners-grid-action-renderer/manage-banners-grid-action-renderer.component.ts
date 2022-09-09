import { Component} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";

@Component({
  selector: 'app-manage-banners-grid-action-renderer',
  templateUrl: './manage-banners-grid-action-renderer.component.html',
  styleUrls: ['./manage-banners-grid-action-renderer.component.css']
})
export class ManageBannersGridActionRendererComponent implements ICellRendererAngularComp {

  public params: ICellRendererParams

  constructor() { }

  agInit(params: ICellRendererParams): void {
    this.params = params
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  public deleteClick(): void {
    // @ts-ignore
    // Call the "delete" method back on the grid page
    this.params.deleteButtonGridMethod(this.params);
  }
}
