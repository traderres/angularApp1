import { Component } from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams, RowClassParams} from "ag-grid-community";
import {DateService} from "../../services/date.service";

@Component({
  selector: 'app-login-date-cell-renderer',
  templateUrl: './login-date-cell-renderer.component.html',
  styleUrls: ['./login-date-cell-renderer.component.css']
})
export class LoginDateCellRendererComponent implements ICellRendererAngularComp {

  public params: ICellRendererParams
  public lastLoginCssClass: string;

  constructor(private dateService: DateService) { }

  /*
   * Cell is being initialized
   */
  agInit(params: ICellRendererParams): void {
    this.params = params

    // Use the Date Service to calculate the CSS class
    this.lastLoginCssClass = this.dateService.calculateGridRowClass(params.data.last_login_date)
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

}
