import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {DashboardDTO} from "../models/dashboard.DTO";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }

  /*
   * Return an observable with the DashboardDTO object
   * NOTE:  This object has information for multiple charts
   */
  public getDashboardDTO(): Observable<DashboardDTO>
  {
    // Construct the URL of the REST call
    const restUrl = environment.baseUrl + '/api/dashboard/get';

    // Return an observable
    return this.httpClient.get <DashboardDTO>(restUrl);
  }

}
