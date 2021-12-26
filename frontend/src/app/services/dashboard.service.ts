import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {DashboardDataDTO} from "../models/dashboard-data-dto";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {DashboardGridRowDTO} from "../models/dashboard-grid-row-dto";
import {BarChartDTO} from "../models/bar-chart-dto";

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


  public getBarChartData(): Observable<BarChartDTO> {
    let data: BarChartDTO = new BarChartDTO();

    data.chartData = [{
      name: 'Average Package Time in Each Work Role',  	// Named used for the "Back to <>" when drilled-in
      colorByPoint: true,
      data: [{
        name: 'GCA',
        y: 3
      }, {
        name: 'Contractor',
        y: 30
      }, {
        name: 'EM',
        y: 21,
        drilldown: 'emAnalysts'
      }, {
        name: 'EMTL',
        y: 5
      }, {
        name: 'FOCI Business Analyst',
        y: 15,
        drilldown: 'fociAnalysts'
      }, {
        name: 'FOCI Team Manager',
        y: 5,
      }, {
        name: 'RMO',
        y: 10,
      }, {
        name: 'Mitigation Strategy Officer / Approval Officer',
        y: 12,
      }, {
        name: 'Oversight RMO',
        y: 6,
      }]
    }];

    data.drillDownData = {
      series: [{
        id: 'emAnalysts',
        data: [
          {
            name: 'John Smith',
            y: 30
          },
          {
            name: 'Dave Lewis',
            y: 21
          },
          {
            name: 'Carl Johnson',
            y: 40
          },
          {
            name: 'Steve Young',
            y: 15
          }
        ]
      }, {
        id: 'fociAnalysts',
        data: [
          ['Nick Foles', 13],
          ['Blake Bortles', 15],
          ['Daniel Jones', 8]
        ]
      }]
    };

    return of(data);
  }  // end of getBarChartData()

}
