import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Report} from "../reports/add-report/add-report.component";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpClient: HttpClient)
  {}


  /*
   * save() Invoke a REST call and return an observable
   */
  public add(report: Report): Observable<string> {
    // Construct the URL for the REST endpoint (so it works in dev and prod mode)
    const restUrl = environment.baseUrl + '/api/reports/add';

    // Setup the REST call to /api/time that returns a string response (not the usual json response)
    // NOTE:  The REST call is not invoked until someone calls subscribe() on this observable
    return this.httpClient.post(restUrl, report, {responseType: 'text'});
  }

}
