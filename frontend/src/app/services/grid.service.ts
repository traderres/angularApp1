import { Injectable } from '@angular/core';
import {GetReportRowDTO} from "../models/get-report-row-dto";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor() { }

  public getAllReports(): Observable<GetReportRowDTO[]> {

    // Create an array of DTOs
    let data: GetReportRowDTO[] = [
      { id: 1, report_name: 'Report 1',  status_label: 'Pending',  status_id: 1,  'created_date': '06/25/2023 08:05:03'},
      { id: 2, report_name: 'Report 2',  status_label: 'Open',     status_id: 2,  'created_date': '06/22/2024 16:45:35'},
      { id: 3, report_name: 'Report 3',  status_label: 'Approved', status_id: 3,  'created_date': '06/01/2022 14:36:38'},
      { id: 3, report_name: 'Report 3',  status_label: 'Approved', status_id: 3,  'created_date': '06/01/2022 14:36:38'},
      { id: 3, report_name: 'Report 3',  status_label: 'Approved', status_id: 3,  'created_date': '06/01/2022 14:36:38'},
      { id: 3, report_name: 'Report 3',  status_label: 'Approved', status_id: 3,  'created_date': '06/01/2022 14:36:38'},
      { id: 3, report_name: 'Report 3',  status_label: 'Approved', status_id: 3,  'created_date': '06/01/2022 14:36:38'},
      { id: 3, report_name: 'Report 3',  status_label: 'Approved', status_id: 3,  'created_date': '06/01/2022 14:36:38'},
    ];

    // Wrap the data in an observable and return it
    return of(data);
  }
}
