import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {DashboardDataDTO} from "../models/dashboard-data-dto";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {DashboardGridRowDTO} from "../models/dashboard-grid-row-dto";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }


  public getAllChartData(): Observable<DashboardDataDTO> {
    // Construct the URL of the REST call
    const restUrl = environment.baseUrl + '/api/dashboard/chart/data';

    // Return an observable
    return this.httpClient.get <DashboardDataDTO>(restUrl);
  }


  public getGridData(): Observable<DashboardGridRowDTO[]> {
    let data: DashboardGridRowDTO[] = [
      {
        id: 1,
        contractName: 'Major Contract #1',
        contractNumber: 'dbcde72345678',
        businessName: 'Cool Coders.com',
        lastEditedDate: '11/24/2021',
        lastEditedFullName: 'John Smith'
      },
      {
        id: 2,
        contractName: 'Major Contract #1',
        contractNumber: 'dbcde72345678',
        businessName: 'Cool Coders.com',
        lastEditedDate: '11/23/2021',
        lastEditedFullName: 'Jane Smith'
      },
      {
        id: 3,
        contractName: 'Major Contract #1',
        contractNumber: 'dbcde72345678',
        businessName: 'Microsoft',
        lastEditedDate: '10/03/2021',
        lastEditedFullName: 'Jim Johnson'
      },
      {
        id: 4,
        contractName: 'Major Contract #2',
        contractNumber: 'dbcde72345678',
        businessName: 'Boeing, Inc.',
        lastEditedDate: '09/23/2021',
        lastEditedFullName: 'Darrel Green'
      },
      {
        id: 5,
        contractName: 'Major Contract #23',
        contractNumber: 'dbcde72345678',
        businessName: 'Amazon.com',
        lastEditedDate: '10/03/2021',
        lastEditedFullName: 'John Smith'
      },

    ];

    return of(data);
  }

}
