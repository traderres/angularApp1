import { Injectable } from '@angular/core';
import {ReportDTO} from "../models/report-dto";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {GetReportDTO} from "../models/get-report-dto";
import {GetUpdateReportDTO} from "../models/get-update-report-dto";
import {SetUpdateReportDTO} from "../models/set-update-report-dto";
import {ResizeObserverService} from "ag-grid-community";
import {LookupDTO} from "../models/lookup-dto";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpClient: HttpClient) { }

  /*
     * Return an observable that will add a Reports record to the system
     */
  public add(report: ReportDTO): Observable<string> {
    // Construct the URL for the REST endpoint (so it works in dev and prod mode)
    const restUrl = environment.baseUrl + '/api/reports/add';

    // NOTE:  The REST call is not invoked you call subscribe() on this observable
    return this.httpClient.post(restUrl, report, {responseType: 'text'});
  }



  /*
   * showMessage()  Demonstrate Sharing Code
   */
  public showMessage(aMessage: string): void {
    console.log('Here is the message: ' + aMessage);
  }


  /*
   * Returns an observable that holds an array of GetReportDTO objects
   */
  public getAllReports(): Observable<GetReportDTO[]> {
    // Construct the URL of the REST call
    const restUrl = environment.baseUrl + '/api/reports/all';

    // Return an observable
    return this.httpClient.get <GetReportDTO[]>(restUrl);
  }


  /*
   * Returns an observable that holds the GetUpdateReportDTO object
   * NOTE:  This method is used by the "Edit Report" page to get info to load
   */
  public getEditReportInfo(aReportId: number): Observable<GetUpdateReportDTO> {
    // Construct the URL of the REST call
    const restUrl = environment.baseUrl + '/api/reports/update/get/' + aReportId;

    // Return an observable
    return this.httpClient.get <GetUpdateReportDTO>(restUrl);
  }

  /*
   * Returns an observable with nothing
   * NOTE:  This method is used by the "Edit Report" page to save info
   */
  public setEditReportInfo(aData: SetUpdateReportDTO): Observable<string> {
    // Construct the URL of the REST call
    const restUrl = environment.baseUrl + '/api/reports/update/set';

    // Return an observable
    return this.httpClient.post(restUrl, aData, {responseType: 'text'});
  }


  public getAllPrimaryObs(): Observable<LookupDTO[]> {
    let data: LookupDTO[] = [
      {
        id: 10,
        name: 'Primary Value 10'
      },
      {
        id: 20,
        name: 'Primary value 20'
      },
      {
        id: 30,
        name: 'Primary Value 30'
      },
    ];

    return of(data);
  }


  public getAllSecondaryValuesForParent(aPrimaryId: number): Observable<LookupDTO[]> {
    let data: LookupDTO[];

    if (aPrimaryId == 10) {
      // User selected the 1st primary option.  So, return 2 child records.
      data = [
        {
          id: 11,
          name: 'Secondary Value 11'
        },
        {
          id: 12,
          name: 'Secondary value 12'
        }];
    }
    else if (aPrimaryId == 20) {
      // User selected the 2nd primary option.  So, return 2 child records.
      data = [
        {
          id: 25,
          name: 'Secondary Value 25'
        },
        {
          id: 26,
          name: 'Secondary value 26'
        }];
    }
    else {
      // User selected the 3rd primary option.  So, return 1 child record
      data = [
        {
          id: 27,
          name: 'Secondary Value 27  (only option)'
        }];

      }

    return of(data);
  }


  public getAllTertiaryValuesForParent(aSecondaryId: number): Observable<LookupDTO[]> {
    let data: LookupDTO[];

    if (aSecondaryId == 11) {
      // User selected the 1st secondary option.  So, return 2 child records.
      data = [
        {
          id: 300,
          name: 'Tertiary Value 300'
        },
        {
          id: 301,
          name: 'Tertiary value 301'
        }];
    }
    else {
      // User selected something else.  So, return 1 child record
      data = [
        {
          id: 400,
          name: 'Tertiary Value 400  (only option)'
        }];
    }

    return of(data);
  }





}
